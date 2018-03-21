# veritone-react-common changelog

## 1.0.0
* initial version published to NPM

## 1.0.1
* fixed npm build

## 1.0.2
* Add initial (WIP) form components
* add additional exported properties for a few components to the bundle (https://github.com/veritone/veritone-sdk/pull/24/files#diff-e276f48705b3ccb9737100d1142205d7)

## 1.1.0
* Adds FilePicker and ProgressDialog components to veritone-react-common. These are only meant to be used via the widgets in `veritone-widgets`.
* Adds AppContainer component — can be used as the central content container in an app that uses AppBar, TopBar, AppFooter, and/or a sidebar. See the associated story.

## 2.0.0
* filepicker:
  * fixes "Cannot have two HTML5 backends" issue
  * (breaking) The filepicker now supports single-file mode and uses it by default. Set `multiple: true` to allow multi file upload
  * URL uploads can be disabled with `allowUrlUpload: false`
  * Update veritone icon stylesheet to latest version

## 2.1.0
* Appbar
  * removes a rogue period from the component

* ProfileMenu
  * Render a "not found" menu when the user object is not available.

* FilePicker
  * add human-readable name for "image/*" accept type

## 3.0.0
* Replaced webpack with rollup
  * The bundle is now an es module rather than UMD, which should enable tree shaking to a greater extent, reducing the filesize overhead of using the library.
  * Dependencies are now external to the library rather than being included in the bundle. Because of this, bundle size is reduced significantly. 
  * A commonJS bundle is also included for older toolchains that do not understand the es module format.

* Remove normalize.css to avoid polluting global styles.

* AppBar
  * update Veritone logo

## 4.0.0
* AppBar
  * Added props.logoSrc (string), which allows a logo to be passed into the component.
  * (breaking) Added props.onSwitchApp (func), which replaces the original behavior of setting window.location to the app immediately.
