# veritone-redux-common changelog

## 1.0.0
* initial version published to NPM

## 1.1.0
* add selectors for current-user fetching status in user module:
  * `isFetching`
  * `fetchingFailed`
* remove cookie reading code from selectEnabledApps, as external apps do not have access to cookies.

## 2.0.0
* *breaking change:* modules now include versions when they specify endpoint URLs. For example:
> Previously: endpoint: state => `${getConfig(state).apiRoot}/admin/current-user`

> Now: endpoint: state => `${getConfig(state).apiRoot}/v1/admin/current-user`

This allows redux-common to use more than one version of the API.

* *Required change in user code*: config.apiRoot must not specify the api version.

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