React components and related code

## Use
Import components by name. For example,
```
import { Avatar, Chip } from 'veritone-react-common'
```

In your app, import the `VeritoneSDKThemeProvider` from `veritone-react-common`:
```
import {VeritoneSDKThemeProvider } from 'veritone-react-common'
```
then wrap your root component with `<VeritoneSDKThemeProvider>`. If this is not possible, the `@withVeritoneSDKThemeProvider` decorator is provided to wrap individual components.

Components can be customized using [material-ui themes](https://material-ui.com/customization/themes/) by passing a theme into the `theme` prop of the provider. Passed-in themes will be merged with the default Veritone theme.

A list of all components can be found in `src/index.js`. Usage examples of each component can be found in `src/components/<component>/story.js`.



## Running the dev environment
`yarn start`: run the examples site

`yarn run build:watch`: watch files and produce a new dist bundle on any changes. This is convenient when developing projects that import from veritone-react-common, as they will immediately pick up the new code through their imports.

`yarn run test` and `yarn run test:watch`: run tests (`:watch` will autorun on file changes)

## Troubleshooting
problems with storybook can usually be resolved by `cd`ing to the veritone-sdk root and running `yarn install --force`

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
