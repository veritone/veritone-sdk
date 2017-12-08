# veritone-redux-common changelog

## 1.0.0
* initial version published to NPM

## 1.1.0
* add selectors for current-user fetching status in user module:
  * `isFetching`
  * `fetchingFailed`
* remove cookie reading code from selectEnabledApps, as external apps do not have access to cookies.
