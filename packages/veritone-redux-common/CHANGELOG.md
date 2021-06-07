# veritone-redux-common changelog

## 1.0.0

* initial version published to NPM

## 1.1.0

* add selectors for current-user fetching status in user module:
  * `isFetching`
  * `fetchingFailed`
* remove cookie reading code from selectEnabledApps, as external apps do not have access to cookies.

## 2.0.0

* _breaking change:_ modules now include versions when they specify endpoint URLs. For example:
  > Previously: endpoint: state => `${getConfig(state).apiRoot}/admin/current-user`

> Now: endpoint: state => `${getConfig(state).apiRoot}/v1/admin/current-user`

This allows redux-common to use more than one version of the API.

* _Required change in user code_: config.apiRoot must not specify the api version.

> Previously: apiRoot: 'https://api.veritone.com/v1'

> Now: apiRoot: 'https://api.veritone.com‘

## 2.1.0

* add an auth reducer to handle session and oauth tokens. Refactors stuff to use that rather than the user module.

* add oauth grant flow that was previously in veritone-widgets

* bump React to 16.2.0

* remove minification from bundle for easier dev and debugging.

## 2.1.1

* Fix incorrect key name in reducer causing oauth to fail

* Add callbacks to oauth saga to support behavior needed in veritone-widgets

## 3.0.0

* Replaced webpack with rollup
  * The bundle is now an es module rather than UMD, which should enable tree shaking to a greater extent, reducing the filesize overhead of using the library.
  * Dependencies are now external to the library rather than being included in the bundle. Because of this, bundle size is reduced significantly.
  * A commonJS bundle is also included for older toolchains that do not understand the es module format.

## 3.1.0

* Implement the oauth implicit grant flow
* remove `credentials: include` on user.fetchEnabledApps, which does not work cross-domain.

## 3.2.0

* The CJS bundle is now transpiled to >0.5% in babel-preset-env (compared to >5% previously), for wider compatibility with old browsers and tools.

## 3.3.0

* Bumped React and React DOM to 16.3.0
* Add `promiseMiddleware`, a middleware for promisifying Redux actions.

## 3.4.0

* Added engine module

## 3.5.0

* Added regeneratorRuntime to the bundle to prevent build errors.

## 3.6.0

* Added Redux as a peer dependency
* Added `callGraphQLApi` helper for calling the veritone API with a graphql query within a thunk.
* Renamed existing internal `callGraphQLApi` helper to `fetchGraphQLApi`

## 3.6.1

* Fix export of `callGraphQLApi` in 3.6.0 due to babel bug (cannot `export default async function`)

## 3.7.0

* Bolster error handling in the OAuth flow
* Change credentials mode for API calls based on whether we're in a veritone-internal host
* Add engine module action to fetch engine categories + related selectors
* Always clear user state after logout
* Add selectors to user module: selectUserOrganizationID and hasFeature

## 3.8.0

* Add handleApiCall helper which, along with an updated callGraphQLApi, should be able to handle most data-fetching reducer/selector requirements. See the header comment in src/helpers/redux/handleApiCall.js for details.

## 3.9.0

* Add initial version of KeyBindings helper component/module, for handling an app's global keybinds in redux

## 3.10.0

* Add module functions to reset user password and update user profile

## 3.11.0

* Calls made with callGraphQLApi now fail on bad responses as well as graphql errors
* add stateSelector to handleApiCall selectors so they can get data within an app's nested reducer

## 3.11.1

* revert "Calls made with callGraphQLApi now fail on bad responses as well as graphql errors"

## 3.11.2

\*\* Update enzyme to ^3.5.0 and fix test incompatability errors

## 3.11.3

\*\* Added response key under metadata in callGraphQLApi helper function to access raw response

## 3.11.4

* Upgrade redux and related package to latest.

* **POTENTIONALLY BREAKING UPDATES** that may or may not affect existing behaviours
  * Redux version updated to 4.0.4
  * React-redux version updated to 7.1.3
  * Redux-form version updated to 8.2.6
  * Redux-saga version updated to 1.1.3
  
## 3.11.5
* Add `getExtraHeaders` function to retrieve tracking headers (exported in modules)
* Pass `x-veritone-user` header along with requests
    * It will start passing it when user is fetched
* Pass `x-veritone-application` header along with requests
    * It will get `applicationId` from state/config/applicationId
    
## 3.11.7
* update lodash

## 3.11.8
* update veritone-funtional-permissions

## 3.12.0
* support whitelabeling