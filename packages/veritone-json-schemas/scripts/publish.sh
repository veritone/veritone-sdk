#!/usr/bin/env bash

# TODO(km):
# - If no version number is provided, make one by incrementing the last version?
# - If --release is specified, get the ITSM ticket number and verify it is approved before proceeding

usage() {
  cat <<EOF
Usage: 
        $(basename "$0") [--release] [--archive] [--upload] [--safe] [--force] <version>

Where: 
        <version> is the version to publish (e.g., v2.7)
        --release: Will upload the archive to the schemas directory instead of the schemas/pre-release directory.
        --archive: Create the archive directory, but do not upload it. An archive directory may only be created
                if the version is, or will be, the latest minor version of its major version.
        --upload: Upload an existing archive to the S3 bucket (do not create the archive if it does not exist)
        --safe: Will not perform any actions, but will print what it would do.
        --force: Required if you want to overwrite an existing version in the archive directory or S3 bucket

This script is used to publish JSON schemas to the https://get.aiware.com/schemas/ directory. See the README.md
file for details, but the general flow is as follows:
1. Update the affected schema in the 'schema/vX' directory to include the desired changes.
2. Update the CHANGELOG.md file in the same directory to include a reference to the new version.
3. Update the index.md file in the 'veritone-json-schemas' directory to include a link to the new version.
4. Run this script with the desired version to create an archive of the schemas and upload it to the pre-release
    directory in the S3 bucket.
5. Once the changes have been approved and are ready for the release, create an ITSM ticket.
6. Once approved, re-run this script with the --release flag to upload the archive to the release directory in the S3 bucket.
7. The archive will be available at https://get.aiware.com/schemas/<version>/
EOF
  return 0
}

# Reports an error
error() {
  local message="$1"
  echo "ERROR: $message" >&2
}

# Changes the current directory to the JSON schemas directory by looking for the parent
# directory called "veritone-json-schemas" and changing to it
cd_json_schemas() {
  local dir="$(realpath .)"
  while [[ "$dir" != "/" && "$dir" != *"/veritone-json-schemas" ]]; do
    dir="$(dirname "$dir")"
  done

  if [[ "$dir" == "/" ]]; then
    error "cd_json_schemas: Could not find 'veritone-json-schemas' directory."
    return 1
  fi
  cd "$dir" || { error "cd_json_schemas: Failed to change directory to '$dir'"; return 1; }
}

# Verifies that the environment is set up correctly and all tools are available
verify_environment() {
  # verify docker is installed
  command -v docker >/dev/null 2>&1 || {
    error "docker is not installed. Please install Docker and try again."
    return 1
  }

  # verify jq is installed
  command -v jq >/dev/null 2>&1 || {
    error "jq is not installed. Please install jq and try again."
    return 1
  }

  # verify aws is installed
  command -v aws >/dev/null 2>&1 || {
    error "aws is not installed. Please install aws-cli and try again."
    return 1
  }

  return 0
}

# Checks if the given version is a valid version string in the format vX.Y
# where X and Y are integers. If valid, returns 0, otherwise prints an error and returns 1.
is_version_valid() {
  local version="$1"
  
  [[ "$version" ]] || { 
    error "No version specified"
    return 1
  }

  [[ "$version" =~ ^v[0-9]+\.[0-9]+$ ]] || {
    error "Invalid version format '$version'. Expected format: vX.Y (e.g., v2.7)"
    return 1
  }

  return 0
}

# Checks if we have access to the aiware-prod-public bucket, and if not, assumes the production
# role for access
assume_prod_role() {
  # if we can see the bucket then no need to assume the role
  aws s3 ls s3://aiware-prod-public/schemas >/dev/null 2>&1 && return 0 

  unset AWS_ACCESS_KEY_ID
  unset AWS_SECRET_ACCESS_KEY
  unset AWS_SESSION_TOKEN

  local aws_role=VeritoneAiwareAssumeRole
  local aws_account=026972849384
  local creds
  creds=$(aws sts assume-role \
      --role-arn "arn:aws:iam::${aws_account}:role/${aws_role}" \
      --role-session-name publish-schemas-session \
      --query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" \
      --output text)
  [ "$creds" ] || {
    echo "Unable to assume role $aws_role, proceeding using [default] credentials"
    return 0
  }

  # Set the AWS environment variables
  # (this is awkward, but works in sh, bash, and zsh)
  creds=$(echo "$creds" | tr ' \t\n' '   ')
  export AWS_ACCESS_KEY_ID="$(echo "$creds" | cut -d' ' -f1)"
  export AWS_SECRET_ACCESS_KEY="$(echo "$creds" | cut -d' ' -f2)"
  export AWS_SESSION_TOKEN="$(echo "$creds" | cut -d' ' -f3)"

  aws s3 ls s3://aiware-prod-public/schemas >/dev/null 2>&1 || {
    error "Failed to assume role $aws_role in account $aws_account. Please check your AWS credentials."
    return 1
  }

  echo "Assumed role $aws_role in account $aws_account"
  return 0
}


# Creates an "*.html" version of the input "*.md" file using the pandoc Docker image.
#
# Usage: convert_markdown_to_html <input_file.md>
#
# Note: must be run from the directory containing the input file.
convert_markdown_to_html() {
  local in_file="$1"

  local file_path=$(realpath "$(dirname "$in_file")")
  local file_name=$(basename "$in_file")
  local out_name="${file_name%.md}.html"
  
  docker run --rm -v "${file_path}:/data" pandoc/core:3-alpine "$file_name" -o "$out_name" --standalone
}

# Converts all "*.md" files in a directory to "*.html"
convert_all_markdown_to_html() {
  local dir="$1"

  [[ -z "$dir" ]] && { error "convert_all_markdown_to_html: No directory specified" && return 1; }
  [[ -d "$dir" ]] || { error "convert_all_markdown_to_html: Directory '$dir' does not exist." && return 1; }

  for file in $(find "$dir" -name "*.md"); do
    convert_markdown_to_html "$file" || return 1
  done
}

# Given a directory and a version, verifies that the CHANGELOG.md file exists and contains a
# reference to the new version, and that the master index file exists and contains a link to the new
# version.
#
# Usage: verify_version_links <dir> <version>
# Where: <dir> is the directory containing the JSON schemas (e.g., ./schemas/v2)
#        <version> is the version to verify (e.g., v2.7)
#
# Verifies that:
# 1. The <dir>/CHANGELOG.md file exists and contains a reference to the new version.
# 2. The <dir>/../index.md file exists and contains a link to the new version.
verify_version_links() {
  local dir="$1"
  local version="$2"

  # Verify the CHANGELOG exists and contains a reference to the new version
  local changelog_file="$dir/CHANGELOG.md"
  [[ -f "$changelog_file" ]] || { 
    error "Changelog file '$changelog_file' does not exist."
    return 1
  }
  grep -q "${version/v/Version }" "$changelog_file" || {
    error "Changelog file '$changelog_file' does not contain notes for 'Version ${version#v}'."
    return 1
  }

  # Verify that index file exists and contains a link to the new version
  local index_file="$dir/../index.md"
  [[ -f "$index_file" ]] || { 
    error "Index file '$index_file' does not exist."
    return 1
  }
  grep -q "/$version/index.html" "$index_file" || {
    error "Index file '$index_file' does not contain a link to version '$version'."
    return 1
  }

  return 0
}

# Given an archive directory, updates the '$id' property in all JSON schema files to include the
# version number from the directory name. The '$id' property is used to identify the schema and
# must be unique for each version.
#
# Schema files are identified by the presence of a "$schema" property that references
# "json-schema.org" (e.g., "$schema": "http://json-schema.org/draft-07/schema#").
update_id_to_version() {
  local dir="$1"          # like "archive/schemas/v2.7/examples"

  # extract the version from the directory
  local version="${dir#*/schemas/}"
  version="${version%%/*}"

  [[ -d "$dir" ]] || { error "Archive directory '$dir' does not exist."; return 1; }
  is_version_valid "$version" || return 1

  # Update the '$id' property in all JSON schema files
  echo "... Updating \$id fields in '$dir' for version '$version'"
  local schema_file
  for schema_file in $(grep -Rl '"\$id"' "$dir"); do
    local file_path="${schema_file#$dir/}"  # Remove the archive directory prefix
    if [[ "$safe" ]]; then
      echo SAFE: "sed 's|\"\$id\": *\"[^\"]*\"|\"\$id\": \"https://get.aiware.com/schemas/'$version'/'$file_path'\"|' \"$schema_file\""
    fi
    sed 's|"\$id": *"[^"]*"|"\$id": "https://get.aiware.com/schemas/'$version'/'$file_path'"|' "$schema_file" >"${schema_file}.tmp" || {
      error "Failed to update \$id field in '$schema_file'"
      return 1
    }
    mv "${schema_file}.tmp" "$schema_file"
  done

  return 0
}

# Creates an index of the examples in the given directory and writes it to the specified
# markdown file. The index will include links to the examples. Each example file will be added
# to the index file with a link to the example file and a description if it has a
# "$example" property at the root.
#
# Usage: create_examples_index <index_file.md> <dir>
# Where: <index_file.md> is the file to write the index to (e.g, examples.md)
#        <dir> is the directory containing the examples (e.g., ./archive/schemas/v2.7)
create_examples_index() {
  local index_file="$1"  # like "archive/schemas/v2.7/examples.md"
  local dir="$2"          # like "archive/schemas/v2.7"

  [[ -z "$index_file" ]] && { error "create_examples_index: No index file specified"; return 1; }
  [[ -z "$dir" ]] && { error "create_examples_index: No directory specified"; return 1; }
  [[ -d "$dir" ]] || { error "create_examples_index: Directory '$dir' does not exist."; return 1; }

  # Create the index file
  echo "... Creating examples index in '$index_file'"
  {
    echo "# Examples"
    echo ""
    local cur_schema_name=
    local example_file
    for example_file in $(find "$dir" -name "*.json" | sort); do
      # Get the title and description and skip non-public examples
      local title=$(jq -r '."$example"' "$example_file" 2>/dev/null)
      [[ "$title" == null ]] && continue

      local description=$(jq -r '."$comment"' "$example_file" 2>/dev/null)
      [[ "$description" == null ]] && description=""
      
      # If the directory name has changed, add a header for the new schema
      local schema_name="$(basename "${example_file%%/examples/*}")"
      if [[ "$cur_schema_name" != "$schema_name" ]]; then
        cur_schema_name="$schema_name"
        echo "## $cur_schema_name"
        echo ""
      fi

      echo "- [**${title}**](./${example_file#$dir/})  " # <-- 2 spaces at end required for markdown formatting
      echo "$description"

      # Remove the "$example" property from the file
      jq . "$example_file" | grep -v '"\$example"' >"${example_file}.tmp" && mv "${example_file}.tmp" "$example_file"
    done
  } > "$index_file" || {
    error "create_examples_index: Failed to create index file '$index_file'"
    return 1
  }

  return 0
}

# Creates an archive of a version of the JSON schemas. Given a version like "v2.7", copies the
# relevant files from the major version schema (e.g., "v2") to a new archive schema directory
# (e.g., "v2.7") and converts all "*.md" files to "*.html" (removing the "*.md" files).
#
# Usage: create_archive [--force] <version> 
# Where: <version> is the version to archive (e.g., v2.7)
#        --force: Will overwrite the existing archive directory if it exists
create_archive() {
  local safe=
  local force=
  # Handle flags
  while [[ "$1" == --* ]]; do
    case "$1" in
      --safe) safe="$1" ;;
      --force) force="$1" ;;
    esac
    shift
  done
  local version="$1"

  is_version_valid "$version" || return
  cd_json_schemas || return 1

  # Find source directory from major version
  local major_version="${version%.*}"
  local source_dir="schemas/$major_version"
  [[ -d "$source_dir" ]] || { error "create_archive: Source directory '$source_dir' does not exist."; return 1; }

  ##
  ## Verify that the indexes and changelog are ready for the new version
  ##

  #echo "Verifying version history for $version exists"
  verify_version_links "$source_dir" "$version" || return 1

  ##
  ## Verify the archive directory does not already exist, or remove it if --force is specified
  ##

  # Compute the archive directory
  local archive_schema_dir="archive/schemas"
  local archive_dir="$archive_schema_dir/$version"

  ## Create a record of the original archive directory, then redirect to a temporary directory if --safe is specified
  if [[ "$safe" ]]; then
    archive_schema_dir="/tmp/archive/schemas"
    archive_dir="$archive_schema_dir/$version"
    echo "╭────────────────────────────────────────────────────────────────────────────────────────"
    echo "│ SAFE MODE:"
    echo "├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌"
    echo "│ Because of --safe, the archive will be created in the directory '$archive_dir'"
    echo "│ instead of './archive/schemas/$version'."
    echo "╰──────────────────────────────────────────────────────────────────────────────────────────────"
  fi

  # Verify the archive directory does not already exist
  echo "📀 Creating archive for $version from '$source_dir' to '$archive_dir'"
  if [[ "$force" ]]; then
    # If the archive directory exists, remove it
    [[ -d "$archive_dir" ]] && {
      echo "... Removing existing archive directory '$archive_dir'..."
      if [[ "$safe" ]]; then
        echo SAFE: "rm -rf \"$archive_dir\""
      fi
      rm -rf "$archive_dir" || { error "Failed to remove existing archive directory '$archive_dir'"; return 1; }
    }
  else
    [[ -d "$archive_dir" ]] && { error "Archive directory '$archive_dir' already exists. Use --force to overwrite"; return 1; }
  fi

  ##
  ## Update the root index file
  ##

  # Copy the index file to the archive directory
  local index_file="$source_dir/../index.md"
  if [[ "$safe" ]]; then
    echo SAFE: "cp \"$index_file\" \"$archive_schema_dir\""
  fi
  cp "$index_file" "$archive_schema_dir" || {
    error "create_archive: Failed to copy index file '$index_file'"
    return 1
  }

  # Convert the index file to HTML
  echo "... Converting index file '$archive_schema_dir/index.md' to HTML"
  if [[ "$safe" ]]; then
    echo SAFE: "convert_markdown_to_html \"$archive_schema_dir/index.md\""
    echo SAFE: "rm \"$archive_schema_dir/index.md\""
  fi
  convert_markdown_to_html "$archive_schema_dir/index.md" || {
    error "Failed to convert index file '$archive_schema_dir/index.md' to HTML"
    return 1
  }
  rm "$archive_schema_dir/index.md" || {
    error "create_archive: Failed to remove index file '$archive_schema_dir/index.md'"
    return 1
  }

  ##
  ## Create the archive directory for the new version
  ##

  # Copy all files as well as the public examples from the source directory to the archive directory
  echo "... Copying files from '$source_dir' to '$archive_dir'"
  local t
  for t in $(find "$source_dir" -type f); do
    # Skip invalid examples
    [[ "$t" == *"/invalid-examples/"* ]] && continue

    # Files in the examples directories must have an "$example" property to be included in the archive
    [[ "$t" == *"/examples/"* ]] && {
      [[ "$(jq -r '."$example"' "$t")" == null ]] && continue
    }

    # Copy the file to the archive directory
    local target_file="$archive_dir/${t#$source_dir/}"
    if [[ "$safe" ]]; then
      echo SAFE: "cp -f \"$t\" \"$archive_dir/\""
    fi
    mkdir -p "$(dirname "$target_file")" && cp -f "$t" "$target_file" || {
      error "create_archive: Failed to copy '$t' to '$archive_dir'"
      return 1
    }
  done

  # Update the $ids of all files to include the specific version number
  update_id_to_version "$archive_dir"
  

  # Create an index of the examples in the archive directory
  echo "... Creating index of examples in '$archive_dir/examples.md'"
  create_examples_index "$archive_dir/examples.md" "$archive_dir" || {
    error "create_archive: Failed to create examples index in '$archive_dir/examples/index.md'"
    return 1
  }
  
  # Convert documentation to HTML and remove markdown files
  echo "... Converting markdown files to HTML in '$archive_dir'"
  if [[ "$safe" ]]; then
    echo SAFE: "convert_all_markdown_to_html \"$archive_dir\""
    echo SAFE: "find \"$archive_dir\" -name \"*.md\" -exec rm -f {} \\;"
  fi
  convert_all_markdown_to_html "$archive_dir" || return 1
  find "$archive_dir" -name "*.md" -exec rm -f {} \; || { error "create_archive: Failed to remove markdown files in '$archive_dir'"; return 1; }

  echo "Archive created successfully at '$archive_dir'"
  return 0
}

# Uploads a single  file to an AWS S3 bucket. The file may be of any type, but the following
# special processing is done:
# - If the file is a JSON schema file (identified by the presence of a "$schema" property that
#   references "json-schema.org"), the content type will be set to "application/schema+json"
# - If the file is a JSON schema file, all '$ref' fields will be update to use a full URL
#   instead of a relative path, so that the schema can be accessed directly by a validator.
# - If the file is a JSON file with an '$id' property, the '$id' property will be updated to
#   include the full URL to the file on get.aiware.com
#
# Usage: upload_file_to_getaiwarecom [--safe] <source_file> <target_dir>
# Where: 
#        <source_file> is the local file to upload (e.g., ./archive/schemas/v2.7/aion/examples/empty.json)
#        <target_dir> is the target S3 directory (e.g., s3://aiware-prod-public/schemas/v2.7)
upload_file_to_getaiwarecom() {
  local dryrun=
  # Handle flags
  while [[ "$1" == --* ]]; do
    case "$1" in
      --safe|--dryrun) dryrun="--dryrun" ;;
    esac
    shift
  done

  local source_file="$1"
  local target_dir="$2"

  [[ -z "$source_file" ]] && { error "upload_dir_to_getaiwarecom: No source file specified"; return 1; }
  [[ -z "$target_dir" ]] && { error "upload_dir_to_getaiwarecom: No target directory specified"; return 1; }
  [[ -f "$source_file" ]] || { error "upload_dir_to_getaiwarecom: Source file '$source_file' does not exist."; return 1; }

  # Determine information we'll need for doing the upload
  local tmp_source_file="$tmp_dir/${source_file##*/}"    # like "/tmp/veritone-json-schemas/empty.json"
  local target_version=$(basename "${target_dir}")       # like "v2.7" or "latest"
  local version_rel_path="${source_file#*/schemas/v*/}"  # like "aion/examples/empty.json"
  local target_file="${target_dir}/${version_rel_path}"  # like "s3://aiware-prod-public/schemas/v2.7/aion/examples/empty.json"
  local version_url="https://get.aiware.com/${target_dir#*aiware-prod-public/}"  # like "https://get.aiware.com/schemas/v2.7"
  local target_id="${version_url}/${version_rel_path}"  # like "https://get.aiware.com/schemas/v2.7/aion/examples/empty.json"

  # Make a copy of the source file to upload (and determine content type)
  local content_type_param=""   # default to letting AWS S3 determine the content type
  case "${source_file##*.}" in
    json)
      # Copy and format the JSON file
      jq . "$source_file" > "$tmp_source_file" || {
        error "upload_file_to_getaiwarecom: Failed to copy '$source_file' to '$tmp_source_file'"
        return 1
      }

      # If the file is a JSON schema file...
      if grep -q '"\$schema".*json-schema\.org' "$tmp_source_file"; then
        # Set the content type for a json schema file
        content_type_param="--content-type=application/schema+json"
        # Update the $ref fields to use the full URL to the referenced schema file.
        # For example, replace 
        #  "$ref": "../master.json#definitions/PREAMBLE" 
        # with 
        #  "$ref": "https://get.aiware.com/schemas/v2.7/master.json#definitions/PREAMBLE"
        # (The following only works because we already ran this through jq so we know the
        # format)
        sed 's|"\$ref": "\.\.*/|"\$ref": "'"${version_url}"'/|' "$tmp_source_file" > "${tmp_source_file}.tmp" || {
          error "upload_file_to_getaiwarecom: Failed to update \$ref fields in '$tmp_source_file'"
          return 1
        }
        mv "${tmp_source_file}.tmp" "$tmp_source_file"
      else  
        # Is a JSON file, but not a schema file. This can only happen for an example file that
        # is in the examples directory, like "archive/schemas/v2.7/aion/examples/empty.json"
        echo "$source_file" | grep -q '/examples/' || {
          error "upload_file_to_getaiwarecom: '$source_file' is not a JSON schema file or an example file."
          return 1
        }
        
        # Find the schema for this type "aion" which will be the only schema in the parent
        # directory
        local example_dir="$(dirname "$source_file")"                # like "archive/schemas/v2.7/aion/examples/"
        local schema_dir="$(dirname "$example_dir")"                 # like "archive/schemas/v2.7/aion"
        local schema_name="$(basename "$schema_dir")"                # like "aion"
        local schema_file="$(basename "$schema_dir"/*.json)"         # like "schema.json" or "aion.json"
        local schema="${version_url}/${schema_name}/${schema_file}"  # like "https://get.aiware.com/schemas/v2.7/aion/schema.json"

        jq --arg schema "$schema" '."$schema" = $schema' "$tmp_source_file" > "${tmp_source_file}.tmp" || {
          error "upload_file_to_getaiwarecom: Failed to update \$schema in '$tmp_source_file'"
          return 1
        }
        mv "${tmp_source_file}.tmp" "$tmp_source_file"
      fi

      # For all JSON files...

      # ... set the $id property to the full URL to the file
      jq --arg id "$target_id" '."$id" = $id' "$tmp_source_file" > "${tmp_source_file}.tmp" || {
        error "upload_file_to_getaiwarecom: Failed to update \$id in '$tmp_source_file'"
        return 1
      }
      mv "${tmp_source_file}.tmp" "$tmp_source_file"
      ;;
    *)
      # All other files are unchanged
      cp "$source_file" "$tmp_source_file" || {
        error "upload_file_to_getaiwarecom: Failed to copy '$source_file' to '$tmp_source_file'"
        return 1
      }
      ;;
  esac

  # Upload the file to the target directory
  aws s3 cp $dryrun $content_param "$tmp_source_file" "$target_file" || {
    error "upload_file_to_getaiwarecom: Failed to upload '$source_file' to '$target_dir'"
    return 1
  }

  return 0
}

# Uploads a single directory to an AWS S3 bucket
#
# Usage: upload_dir_to_getaiwarecom [--force] [--safe] <source_dir> <target_dir>
# Where: <source_dir> is the local directory to upload (e.g., ./archive/schemas/v2.7)
#        <target_dir> is the target S3 directory (e.g., s3://aiware-prod-public/schemas/v2.7)
upload_dir_to_getaiwarecom() {
  local dryrun=
  local force=
  # Handle flags
  while [[ "$1" == --* ]]; do
    case "$1" in
      --safe|--dryrun) dryrun="--dryrun" ;;
      --force) force="$1" ;;
    esac
    shift
  done

  local source_dir="$1"
  local target_dir="$2"

  [[ -z "$source_dir" ]] && { error "upload_dir_to_getaiwarecom: No source directory specified"; return 1; }
  [[ -z "$target_dir" ]] && { error "upload_dir_to_getaiwarecom: No target directory specified"; return 1; }
  [[ -d "$source_dir" ]] || { error "upload_dir_to_getaiwarecom: Source directory '$source_dir' does not exist."; return 1; }

  # Check if target directory already exists and delete it if --force is specified
  aws s3 ls "$target_dir" >/dev/null 2>&1 && {
    if [[ "$force" ]]; then
      echo "... Target directory '$target_dir' already exists. Removing it..."
      aws s3 rm $dryrun "$target_dir" --recursive || {
        error "upload_dir_to_getaiwarecom: Failed to remove existing target directory '$target_dir'"
        return 1
      }
    else
      error "Target directory '$target_dir' already exists. Use --force to overwrite."
      return 1
    fi
  }

  echo "... Uploading directory '$source_dir' to '$target_dir'"
  local schema_file
  for schema_file in $(find "$source_dir" -type f | sort -r); do
    # Upload each file to the target directory
    upload_file_to_getaiwarecom $dryrun "$schema_file" "$target_dir" || return 1
  done

  return 0
}

# Checks if the given version is or would be the latest minor version of its major version. If
# the version does not exist, it checks if it would be the latest minor version if it were to be
# created. 
#
# For example, if the version is v2.7, it checks if that version exists and is the highest v2.x
# version, otherwise it checks if the highest version is v2.6 so v2.7 would be the latest minor
# version.
#
# Returns 0 if it is the latest minor version, 1 otherwise.
is_latest_minor_version() {
  local version="$1"
  is_version_valid "$version" || return

  local major_version="${version%%.*}"

  # Find the latest minor version for the major version
  local schemas_dir="archive/schemas"
  local latest_version=$(ls "$schemas_dir" | grep "^$major_version\." | sort -V | tail -n 1)
  
  # If this is the latest minor version, return 0
  [[ "$version" == "$latest_version" ]] && return 0

  # If this is one more than the latest minor version, return 0
  local incremented_latest_version="${major_version}.$(( ${latest_version#*.} + 1))"
  [[ "$version" == "$incremented_latest_version" ]] && return 0

  return 1
}

# Checks if the given version is the latest major version.
# For example, if the version is v2.7, it checks that it is the latest v2.x version, and there
# are no v3.x versions.
# Returns 0 if it is the latest major version, 1 otherwise.
is_latest_major_version() {
  local version="$1"
  is_version_valid "$version" || return

  is_latest_minor_version "$version" || return

  local major_version="${version%%.*}"

  local schemas_dir="archive/schemas"
  local latest_version=$(ls "$schemas_dir" | sort -V | tail -n 1)
  local latest_major_version="${latest_version%%.*}"

  [[ "$latest_major_version" == "$major_version" ]]
}

# Upload the archive to the AWS S3 bucket as s3://aiware-prod-public/schemas/.
#
# Usage: upload_to_getaiwarecom [--safe] [--force] [--latest] [--pre-release] <version>
# Where: <version> is the version to upload (e.g., v2.7)
#        --safe: Will not perform any actions, but will print what it would do.
#        --force: Will overwrite the existing archive directory if it exists
#        --latest: Will also upload the archive to the latest and major version directories
#        --pre-release: Will upload the archive to the pre-release directory
upload_to_getaiwarecom() {
  local safe=
  local dryrun=
  local force=
  local latest=
  local release=
  # Handle flags
  while [[ "$1" == --* ]]; do
    case "$1" in
      --safe|--dryrun) safe="--safe"; dryrun="--dryrun" ;;
      --force) force="$1" ;;
      --latest) latest="$1" ;;
      --release) release="$1" ;;
    esac
    shift
  done

  # get version
  local version="$1"
  is_version_valid "$version" || return

  cd_json_schemas || return 1
  local schemas_dir="archive/schemas"
  local archive_dir="$schemas_dir/$version"
  [[ -d "$archive_dir" ]] || { error "upload_to_getaiwarecom: Archive directory '$archive_dir' does not exist."; return 1; }

  # In the Jenkins environment, we have a configured AWS CLI with the necessary permissions, on
  # local machines, we'll use the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment
  # variables.
  assume_prod_role || return 1

  # Compute the target directory in the S3 bucket
  local target_schemas_dir="s3://aiware-prod-public/schemas/pre-release"
  [[ "$release" ]] && target_schemas_dir="s3://aiware-prod-public/schemas"

  local target_dir="$target_schemas_dir/$version"

  # Upload the version index file to the target directory
  echo "⬆️ Uploading schema index file to '$target_schemas_dir/index.html'"
  aws s3 cp $dryrun "$schemas_dir/index.html" "$target_schemas_dir/index.html" || {
    error "Failed to upload index file to '$target_schemas_dir/index.html'"
    return 1
  }

  # Upload the archive directory to the target directory
  echo "⬆️ Uploading archive for version '$version' to '$target_dir'"
  upload_dir_to_getaiwarecom $force $safe "$archive_dir" "$target_dir" || return 1

  # If this is the latest of the minor versions, also upload to the major version directory
  is_latest_minor_version "$version" && {
    # Upload to the major version directory (e.g., v2.7 -> v2) (always overwriting it)
    local major_version="${version%.*}"
    local latest_target_dir="${target_dir/\/$version//$major_version}"
    echo "⬆️ Uploading archive for version '$version' to '$latest_target_dir'"
    upload_dir_to_getaiwarecom --force $safe "$archive_dir" "$latest_target_dir" || return 1
  }

  # If this is the latest major version, upload to the latest directory
  is_latest_major_version "$version" && {
    # Upload to the latest directory (e.g., v2.7 -> latest) (always overwriting it)
    local latest_dir="${target_dir/\/$version//latest}"
    echo "⬆️ Uploading archive for version '$version' to '$latest_dir'"
    upload_dir_to_getaiwarecom --force $safe "$archive_dir" "$latest_dir" || return 1
  }

  # If --release was not specified, notify the user how to upload the release version
  if [[ "$release" ]]; then
    echo "Version $version has been uploaded to the release directory:"
    echo "  https://get.aiware.com/schemas/$version/index.html"
    echo "Index page: https://get.aiware.com/schemas/index.html"
  else
    echo "╭───────────────────────────────────────────────────────────────────────────"
    echo "│ NOTE:"
    echo "├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌"
    echo "│ Version $version has been uploaded to the pre-release directory:"
    echo "│   https://get.aiware.com/schemas/pre-release/$version/index.html"
    echo "│ Index page: https://get.aiware.com/schemas/pre-release/index.html"
    echo "│"
    echo "│ To upload the release version, re-run this command with the --release flag"
    echo "╰───────────────────────────────────────────────────────────────────────────"
  fi
}


# main script logic
{
  # Prepare the temporary directory for storing JSON schemas
  tmp_dir="/tmp/veritone-json-schemas"
  [[ -d "$tmp_dir" ]] || mkdir -p "$tmp_dir"
  rm -rf "$tmp_dir"/*


  safe=           # Will not perform any actions, but will print what it would do.
  force=          # Will overwrite the existing archive directory if it exists
  release=        # Will upload the archive to the release directory instead of the pre-release directory
  archive=        # Will create the archive directory for the version, but not upload it
  upload=         # Will upload the archive to the S3 bucket

  # Handle flags
  while [[ "$1" == --* ]]; do
    case "$1" in
      --help|-h) usage; exit 0 ;;
      --safe|--dryrun) safe="--safe" ;;
      --force) force="--force" ;;
      --release) release="--release" ;;
      --archive) archive="--archive" ;;
      --upload) upload="--upload" ;;
      *) error "Unknown option: $1"; exit 1 ;;
    esac
    shift
  done

  # If neither archive nor upload is specified, default to both
  [[ -z "$archive" && -z "$upload" ]] && { archive="--archive"; upload="--upload"; }

  # TODO(km): this should be smarter about some things like:
  # - If no version number is provided, make one by incrementing the last version

  # Validate version argument
  version="$1"
  [[ -z "$version" ]] && { error "No version specified. Usage: $0 [--safe] [--force] [--latest] [--release] <version>"; exit 1; }
  if ! [[ "$version" =~ ^v[0-9]+\.[0-9]+$ ]]; then
    error "Invalid version format '$version'. Expected format: vX.Y (e.g., v2.7)"
    exit 1
  fi

  verify_environment || exit

  # Create the archive for the version only if --archive is specified and the version is (or
  # would be) the latest minor version
  [[ "$archive" ]] && {
    if is_latest_minor_version "$version"; then
      create_archive $force $safe "$version" || exit
    else
      echo "⏭️ Version $version is not the latest minor version of ${version%%.*}. Skipping archive creation."
    fi
  }

  # Upload the archive to the S3 bucket only if --upload is specified
  [[ "$upload" ]] && {
    upload_to_getaiwarecom $safe $force $latest $release "$version" || exit
  }

  exit 0
}
