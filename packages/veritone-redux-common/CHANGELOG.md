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
