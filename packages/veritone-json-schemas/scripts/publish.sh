#!/usr/bin/env bash

###############################################################################
# TODO(km): Implement publishing logic
# Eventually, this script should handle the automatic publishing of the JSON 
# schemas, but at the current time it is serving as a library of functions
# that may be useful both for automated publishing and for manual publishing.
###############################################################################

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

# Checks if we have access to the aiware-prod-public bucket, and if not, assumes the production
# role for access
assume_prod_role() {
  # if we can see the bucket then no need to assume the role
  aws s3 ls s3://aiware-prod-public/schemas >/dev/null 2>&1 && return 0 

  local awsRole=VeritoneAiwareAssumeRole
  local awsAccount=026972849384
  local creds
  creds=$(aws sts assume-role \
      --role-arn "arn:aws:iam::${awsAccount}:role/${awsRole}" \
      --role-session-name publish-schemas-session \
      --query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" \
      --output text)
  [ "$creds" ] || {
    echo "Unable to assume role $awsRole, proceeding using [default] credentials"
    return 0
  }

  # Set the AWS environment variables
  # (this is awkward, but works in sh, bash, and zsh)
  creds=$(echo "$creds" | tr ' \t\n' '   ')
  export AWS_ACCESS_KEY_ID="$(echo "$creds" | cut -d' ' -f1)"
  export AWS_SECRET_ACCESS_KEY="$(echo "$creds" | cut -d' ' -f2)"
  export AWS_SESSION_TOKEN="$(echo "$creds" | cut -d' ' -f3)"

  echo "Assumed role $awsRole in account $awsAccount"
  return 0
}


# Creates an "*.html" version of the input "*.md" file using the pandoc Docker image.
#
# Usage: convert_markdown_to_html <input_file.md>
#
# Note: must be run from the directory containing the input file.
convert_markdown_to_html() {
  local in_file="$1"

  local out_file="${in_file%.md}.html"

  docker run --rm -v "$(pwd):/data" pandoc/core:3-alpine "$in_file" -o "$out_file" --standalone
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

  # Validate version
  [[ -z "$version" ]] && { error "create_archive: No version specified"; return 1; }
  if ! [[ "$version" =~ ^v[0-9]+\.[0-9]+$ ]]; then
    error "create_archive: Invalid version format '$version'. Expected format: vX.Y (e.g., v2.7)"
    return 1
  fi

  cd_json_schemas || return 1

  # Find source directory from major version
  local major_version="${version%.*}"
  local source_dir="schemas/$major_version"
  [[ -d "$source_dir" ]] || { error "create_archive: Source directory '$source_dir' does not exist."; return 1; }

  # Verify the archive directory does not already exist
  local archive_schema_dir="archive/schemas"
  local archive_dir="$archive_schema_dir/$version"
  echo "Creating archive for version '$version' from '$source_dir' to '$archive_dir'"
  if [[ "$force" ]]; then
    # If the archive directory exists, remove it
    [[ -d "$archive_dir" ]] && {
      echo "... Removing existing archive directory '$archive_dir'..."
      if [[ "$safe" ]]; then
        echo SAFE: "rm -rf \"$archive_dir\""
      else
        rm -rf "$archive_dir" || { error "Failed to remove existing archive directory '$archive_dir'"; return 1; }
      fi
    }
  else
    [[ -d "$archive_dir" ]] && { error "Archive directory '$archive_dir' already exists. Use --force to overwrite"; return 1; }
  fi

  ##
  ## Update the root index file
  ##

  # Verify that index file exists and contains a reference to the new version
  local index_file="schemas/index.md"
  [[ -f "$index_file" ]] || { 
    error "Index file '$index_file' does not exist."
    return 1
  }
  grep -q "$version" "$index_file" || {
    error "Index file '$index_file' does not contain a reference to version '$version'."
    return 1
  }

  # Copy the index file to the anchive directory
  if [[ "$safe" ]]; then
    echo SAFE: "cp \"$index_file\" \"$archive_schema_dir\""
  else
    cp "$index_file" "$archive_schema_dir" || {
      error "create_archive: Failed to copy index file '$index_file'"
      return 1
    }
  fi

  # Convert the index file to HTML
  echo "... Converting index file '$archive_schema_dir/index.md' to HTML"
  if [[ "$safe" ]]; then
    echo SAFE: "convert_markdown_to_html \"$archive_schema_dir/index.md\""
    echo SAFE: "rm \"$archive_schema_dir/index.md\""
  else
    convert_markdown_to_html "$archive_schema_dir/index.md" || {
      error "Failed to convert index file '$archive_schema_dir/index.md' to HTML"
      return 1
    }
    rm "$archive_schema_dir/index.md" || {
      error "create_archive: Failed to remove index file '$archive_schema_dir/index.md'"
      return 1
    }
  fi

  ##
  ## Create the archive directory for the new version
  ##

  # Copy files from source to archive
  echo "... Copying files for version '$version' from '$source_dir' to '$archive_dir'"
  if [[ "$safe" ]]; then
    echo SAFE: "mkdir -p \"$archive_dir\""
    echo SAFE: "cp -r \"$source_dir\"/* \"$archive_dir/\""
  else
    mkdir -p "$archive_dir" || { error "create_archive: Failed to create archive directory '$archive_dir'"; return 1; }
    cp -r "$source_dir"/* "$archive_dir/" || { error "create_archive: Failed to copy files to '$archive_dir'"; return 1; }
  fi
  
  # Convert documentation to HTML and remove markdown files
  echo "... Converting markdown files to HTML in '$archive_dir'"
  if [[ "$safe" ]]; then
    echo SAFE: "convert_all_markdown_to_html \"$archive_dir\""
    echo SAFE: "find \"$archive_dir\" -name \"*.md\" -exec rm -f {} \\;"
  else
    convert_all_markdown_to_html "$archive_dir" || return 1
    find "$archive_dir" -name "*.md" -exec rm -f {} \; || { error "create_archive: Failed to remove markdown files in '$archive_dir'"; return 1; }
  fi

  # Delete example directories (not ready for this yet)
  # TODO(km): Remove this when we have examples ready
  echo "... Removing example directories from '$archive_dir'"
  if [[ ! "$safe" ]]; then
    rm -rf "$archive_dir"/*/examples || { error "create_archive: Failed to remove '*/examples' directory in '$archive_dir'"; return 1; }
    rm -rf "$archive_dir"/*/invalid-examples || { error "create_archive: Failed to remove '*/invalid-examples' directory in '$archive_dir'"; return 1; }
  fi

  echo "Archive created successfully at '$archive_dir'"
  return 0
}

# Uploads a single directory to an AWS S3 bucket
#
# Usage: upload_dir_to_getaiwarecom [--force] [--safe] <source_dir> <target_dir>
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

  # Check if target directory already exists and return if --force is not specified, delete it
  # if --force is specified
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

  # TODO(km) this code needs to upload the schemas with the correct content type for json schemas
  echo "... Uploading directory '$source_dir' to '$target_dir'"
  aws s3 cp $dryrun "$source_dir" "$target_dir" --recursive || {
    error "upload_dir_to_getaiwarecom: Failed to upload '$source_dir' to '$target_dir'"
    return 1
  }

  return 0
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
  local pre_release=
  # Handle flags
  while [[ "$1" == --* ]]; do
    case "$1" in
      --safe|--dryrun) safe="--safe"; dryrun="--dryrun" ;;
      --force) force="$1" ;;
      --latest) latest="$1" ;;
      --pre-release) pre_release="$1" ;;
    esac
    shift
  done

  # Validate version
  local version="$1"
  [[ -z "$version" ]] && { error "upload_to_getaiwarecom: No version specified"; return 1; }
  if ! [[ "$version" =~ ^v[0-9]+\.[0-9]+$ ]]; then
    error "upload_to_getaiwarecom: Invalid version format '$version'. Expected format: vX.Y (e.g., v2.7)"
    return 1
  fi

  cd_json_schemas || return 1
  local schemas_dir="archive/schemas"
  local archive_dir="$schemas_dir/$version"
  [[ -d "$archive_dir" ]] || { error "upload_to_getaiwarecom: Archive directory '$archive_dir' does not exist."; return 1; }

  # In the Jenkins environment, we have a configured AWS CLI with the necessary permissions, on
  # local machines, we'll use the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment
  # variables.
  assume_prod_role || return 1

  # Compute the target directory in the S3 bucket
  local target_schemas_dir="s3://aiware-prod-public/schemas"
  [[ "$pre_release" ]] && target_schemas_dir="s3://aiware-prod-public/schemas/pre-release"

  local target_dir="$target_schemas_dir/$version"

  echo "Uploading archive for version '$version' to '$target_dir'"
  upload_dir_to_getaiwarecom $force $safe "$archive_dir" "$target_dir" || return 1

  echo "Uploading schema index file to '$target_schemas_dir/index.html'"
  aws s3 cp $dryrun "$schemas_dir/index.html" "$target_schemas_dir/index.html" || {
    error "Failed to upload index file to '$target_schemas_dir/index.html'"
    return 1
  }

  # If --latest is specified, upload the latest directories as well
  [[ "$latest" ]] && {
    # Upload to the major version directory (e.g., v2.7 -> v2) (always overwriting it)
    local major_version="${version%.*}"
    local latest_target_dir="${target_dir/\/$version//$major_version}"
    echo "... Uploading archive for version '$version' to '$latest_target_dir'"
    upload_dir_to_getaiwarecom --force $safe "$archive_dir" "$latest_target_dir" || return 1

    # Also upload to the 'latest' directory (always overwriting it)
    local latest_dir="${target_dir/\/$version//latest}"
    echo "... Uploading archive for version '$version' to '$latest_dir'"
    upload_dir_to_getaiwarecom --force $safe "$archive_dir" "$latest_dir" || return 1
  }
}