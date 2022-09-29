# veritone-sdk

this is a monorepo managed by Yarn's workspaces feature (https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/).
# Documentation
Documentation for each package can be found in their respective README files.

# Development
1. if you don't have `yarn`, install it here: https://yarnpkg.com/en/docs/install
2. `yarn install` in the veritone-sdk root.
3. run `yarn buildall` from the veritone-sdk root. This will bundle all the packages so that cross-dependencies can resolve correctly.

# Releasing
_This is WIP and may change as we find a better process_

1. Complete your feature and PR it to the master branch.
2. Once merged, update `package.json` in each affected folder under the `packages` directory
    * Increment the version field using [semver](http://semver.org/)
3. Update each package's `CHANGELOG` file with your new version
    * To diff individual packages in git: `git diff <hash of previous release> -- packages/<packagename>`
    * If there's a backlog of unreleased code, **Yours may not be the only changes in the release!** If that's the case, talk with each code author to get changelog entries from them.
4. Commit the `package.json` and `CHANGELOG` changes (only!) to master.
5. [Tag the commit as a release](https://github.com/veritone/veritone-sdk/releases). Create a release for _each_ package you updated, being sure to set the _release target_ to the correct commit, and using the naming scheme:
    * Tag version: version-packagename, ie. `1.0.0-veritone-client-js`
    * Release title: packagename vVersion, ie. veritone-client-js v1.0.0
6. On your local machine, checkout the `master` branch and `git pull`.
7. Run `yarn --force` from the root directory.
8. Run `yarn buildall` from the root directory.
9. Run `yarn publish` in each package directory as needed to push your release to NPM.

## veritone-json-schema
The JSON schema is deployed to the documentation page (docs.veritone.com). 
This may be deployed manually with
```bash
aws s3 sync \
  github.com/veritone/veritone-sdk/packages/veritone-json-schemas/schemas/vtn-standard \
  s3://veritone-docs-prod/schemas/vtn-standard
```
(with appropriate updates for the local directory)

# Creating development/integration bundles (for internal Veritone use)
Occasionally you may need to integrate unfinished work on an SDK package with another project. In cases where that project must be deployed or shared, we cannot rely on `yarn link`. Rather than cluttering our ecosystem with with prerelease package versions, you can publish a tar archive to an S3 bucket and reference that archive in the package.json of your project (using yarn's ability to download tarball dependencies).

1. Obtain S3 user permissions to PUT to the `dev-sdk-build-artifacts` bucket.
2. Make changes to an SDK package locally. The changes do not need to be pushed or even committed. The only requirement is that the SDK package can be built.
3. From the veritone-sdk root directory, run `yarn publish-dev <packageName>`. ie. `yarn publish-dev veritone-react-common`
4. Copy the resulting s3 resource url, ie. https://dev-sdk-build-artifacts.s3.amazonaws.com/veritone-react-common-[timestamp].tar.gz
5. Reference the s3 url in the package.json of your sdk-using project. ie.
```
{
  "dependencies": {
    ...,
    "veritone-react-common": "https://dev-sdk-build-artifacts.s3.amazonaws.com/veritone-react-common-[timestamp].tar.gz",
    ...
  }
}
```
6. run `yarn install` in your project to pull in the new dependency.


# License
Copyright 2019, Veritone Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
