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

## 4.1.0
* The CJS bundle is now transpiled to >0.5% in babel-preset-env (compared to >5% previously), for wider compatibility with old browsers and tools. 

## 4.2.0
* Added `NavigationSideBar` component. See the story for more details.

## 4.2.1
* Removed dependency on redux-form-material-ui as it was causing dependency issues.
* Fixed storybook build so docs deployments work.

## 4.3.0
* Added DataTable component
* Added OAuthLoginButton component
* Added RereshButton component

## 4.3.1
* Updated material-ui dependency to v1.0.0-beta.36

## 4.4.0
* DataTable
* * Added props.excludeActions for MenuColumn
* * Fixed LOADING export in DataTable
* * Fixed split table issue where focused table row was wrong value
* * Fixed Column width prop to use css rather than the (deprecated) html property.
* * props.dataKey to dataTables can now be any value accepted by lodash _.get. This means nested keys are now supported.

* Updated veritone icons file

## 4.5.0
* AppContainer
* * Removed the overflow-y rule which was causing a scrollbar to always appear, even when no scrolling content existed.
* MenuColumn
* * Added props.actions to specify actions that don't appear in data
* Added GeoPicker component
* Added HorizontalScroll component
* Added SearchPill component
* Updated veritone icons css file

## 5.0.0
* Bumped React and React DOM to 16.3.0
* Updated to Material-UI v1.0.0!

## 5.1.0
* Added Lozenge component
* Added Truncate component
* Added ExpandableInputField component

## 5.2.0
* Added SourceTypeField component
* Added export for DateTimePicker component
* Bumped Redux to 4.0

## 5.3.0
* Exported the Interval class and defaultIntervals for use with date-handling components.
