# veritone-sdk

this is a monorepo managed by Yarn's workspaces feature (https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/).

# development
if you don't have `yarn`, install it here: https://yarnpkg.com/en/docs/install

`yarn install` in either the veritone-sdk root, or an individual project's directory. packages can be `yarn publish`ed to npm from their own root directory.

# Releasing
_This is WIP and may change as we find a better process_

1. Complete your feature and PR it to the master branch.
2. Once merged, update `package.json` in each affected folder under the `packages` directory
    * Increment the version field using [semver](http://semver.org/)
3. Update each package's `CHANGELOG` file with your new version.
4. Commit the `package.json` and `CHANGELOG` changes (only!) to master.
5. [Tag the commit as a release](https://github.com/veritone/veritone-sdk/releases). Create a release for _each_ package you updated, using the naming scheme:
    * Tag version: version-packagename, ie. `1.0.0-veritone-client-js`
    * Release title: packagename vVersion, ie. veritone-client-js v1.0.0
6. On your local machine, checkout the `master` branch and `git pull`.
7. Run `npm publish` in each package directory as needed to push your release to NPM.

# License
Copyright 2017, Veritone Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.