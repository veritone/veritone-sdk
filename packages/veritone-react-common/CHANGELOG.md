# veritone-react-common changelog

## 1.0.0
* initial version published to NPM

## 1.0.1
* fixed npm build

## 1.0.2
* Add initial (WIP) form components
* add additional exported properties for a few components to the bundle (https://github.com/veritone/veritone-sdk/pull/24/files#diff-e276f48705b3ccb9737100d1142205d7)

# 1.1.0
* Adds FilePicker and ProgressDialog components to veritone-react-common. These are only meant to be used via the widgets in `veritone-widgets`.
* Adds AppContainer component — can be used as the central content container in an app that uses AppBar, TopBar, AppFooter, and/or a sidebar. See the associated story.

# 2.0.0
* filepicker:
  * fixes "Cannot have two HTML5 backends" issue
  * (breaking) The filepicker now supports single-file mode and uses it by default. Set `multiple: true` to allow multi file upload
  * URL uploads can be disabled with `allowUrlUpload: false`
  * Update veritone icon stylesheet to latest version
