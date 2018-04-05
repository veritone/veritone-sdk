# veritone-oauth-helpers changelog

## 1.0.0
* initial version published to NPM

## 1.1.0
* Use babel to transform es6 code and async/await 

## 1.1.1
* Fix botched 1.1.0 release
 
## 1.1.2
* Include babelHelpers in the bundle to prevent "babelHelpers is not defined" error
 
## 2.0.0
* Project is now built as an ES module
* Removed es6-promise polyfill

## 2.0.1
* Added a commonjs build to support older bundlers.
* Tweaked the existing ES module build to run through rollup. Behavior should be unchanged.

## 2.1.0
* Added `handleImplicitRedirect` helper. Designed to be used in a popup-window based implicit oauth flow, it will extract the returned token (or error) from the oauth response, and post it back to the opener parent window.
