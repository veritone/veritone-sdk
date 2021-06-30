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
  * add human-readable name for "image/\*" accept type

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
* * props.dataKey to dataTables can now be any value accepted by lodash \_.get. This means nested keys are now supported.

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

## 6.0.0

* (breaking) removed @withMuiTheme decorator which automatically provided the material-ui theme to each component. Direct users of react-common components need to follow the new instructions in the README to add VeritoneSDKThemeProvider to their apps.
* Added withVeritoneSDKThemeProvider, VeritoneSDKThemeProvider, and defaultVSDKTheme, related to above change
* FilePicker title can now be customized with props.title
* Added BoundingPolyOverlay and OverlayPositioningProvider components
* Added ContentTemplateForm and ContentTemplate components
* Added SDOTable component
* Added IngestionJobs-related components
* Added SourceManagementForm and SourceManagement-related components
* Added Switch component under formComponents

## 6.0.1

* Support signedApplicationIconUrl field in the AppSwitcher
* Update veritone icons font

## 6.1.0

* Add support for more engines in SearchBar
* Add Scheduler component
* Add better validation to DateTimePicker form component
* Add TimeRangePicker form component

## 6.1.1

* Overlay:
  * fix position of drawn boxes being out of sync with mouse position in some cases where the screen is scrolled.

## 6.2.0

* Overlay:
  * Added the ability to style bounding boxes individually and as a group. Opened up styling so more than just background and border styles can be customized.
    * props.stagedBoundingBoxStyles apply to new, unconfirmed bounding boxes
    * props.stylesByObjectType apply to a bounding box if that box has a matching "overlayObjectType" key
    * props.defaultBoundingBoxStyles apply to every box not covered by the above props

## 6.3.0

* Add missing recompose dependency
* DataTable
  * Propagate focusedRow to simple table when no focused row renderer was provided. Make focused row highlighted in that simple table - this allows to control which row is selected even when no special renderer needed for focused row.
* ContentTemplate
  * text inputs are now multiline
  * Added props.textInputMaxRows to allow user to specify the maximum number of rows to display
* ContentTemplateForm
  * Added props.textInputMaxRows to allow user to specify the maximum number of rows to display
* ProfileMenu
  * fix profile image location
* SDOTable
  * Make SdoTable able to render schemas with nested object properties flatten all to one level and build columns. Surface onClick and focusedRow to allow users react to on row/cell click and highlight specific rows.
    R

## 6.3.1

* Add recompose to excluded dependencies (fixes build issues)

## 6.4.1

* AppBar/ProfileMenu: add handlers for and button for editing user profile
* BoundingPolyOverlay: support readOnly attribute for individual bounding boxes
* RaisedTextField: add tool tip support for action buttons
* redux-form-material-ui: fix helperText typo

## 6.5.0

* added StatusPill
* TopBar
  \*\* Added ability to render an action button on the bar's left side

## 6.6.0

* Add additionalMenuItems prop to AppBar/profile menu
* Add autoSelect to BoundingPolyOverlay

## 6.7.0

* Add CopyPrompt component

## 7.0.0

* OverlayPositioningProvider: add contentClassName prop for styling inner contents
* remove ContentTemplates
* MenuColumn: add transformActions prop which allows modifying menu items
* FullScreenDialog: add className prop
* Remove IngestionJobs
* Remove SDOTable
* Remove Scheduler
* Remove SourceConfiguration
* Remove SourceManagementForm
* Remove SourceTypeField
* DateTimePicker: add readOnly prop
* TimeRangePicker: add support for time zones; add readOnly prop
* Update veritone-icons css file

## 7.0.1

* Update file picker to use an overflow when multiple files exceed the modal height

## 7.1.0

* Added a radio selection button

## 7.2.0

* Changes to file picker:
  * Added a non-modal style so it can sit flat in a modal, so we don’t have a modal on top of a modal
  * Added maxFiles limit. When used, it shows {numberOfFilesToUpload} / {maxFiles}.
  * Allow the upload button to be set via props, in case we want it to say “Benchmark” or “Process” as the next step instead.
  * Better error messages when >1 file when multiple is false, better error messages when multiple is true, and maxFiles limit is set.

## 7.3.0

* Added MediaPlayer component with skinned native control bar
* Updated FilePicker UI and upload progress UX

## 7.4.0

* MediaPlayer: ability to customize control bar
* MediaPlayer: fix behavior for preload: 'none'

## 7.5.0

* Add Notification component
* AppBar: add an option to enable notifications

## 7.6.0

* Update @material-ui/icons to ^2.0.0
* Update enzyme to ^3.5.0 and fix test incompatability errors
* Add DataPicker components

## 7.7.0

* AppBar:
  * Add Help Menu
  * Standardize AppBar Layout

## 8.0.0

* (breaking) DateTimePicker & TimeRangePicker: Pass `timezone` instead of `showTimezone`.

## 8.0.1

* Fixed missing icons from updates

## 8.0.2

* Fixed AppBar css overridden issue

## 8.0.3

* Add Dosis font to global style import for the AppBar title

## 9.0.0

* Added analytics tracking to App Bar
* Search bar with auto suggestion template support
* Form builder components
* Added analytics tracking to Sidebar component

* **POTENTIONALLY BREAKING UPDATES** that may or may not affect existing styles / behaviours
  * React version updated to 16.9.0
  * Material-ui version updated to 4.4

## 9.0.4

* Upgrade redux and related package to latest.
* Add folder tree components

* **POTENTIONALLY BREAKING UPDATES** that may or may not affect existing styles / behaviours
  * Material-ui version updated to lastest
  * Redux version updated to 4.0.4
  * React-redux version updated to 7.1.3
  * Redux-form version updated to 8.2.6
  * Redux-saga version updated to 1.1.3
  * Using css-in-js
  
## 9.0.10
* Fix: Cannot initially type 0 in any Time input when create/edit scheduled ingestion (#496)
## 10.0.0 
* Unpublished 
## 10.0.1
* BREAKING UPDATES: add discovery settings - Changes User Profile menu styling
* add data-test attributes
* bump lodash
* fix collections folder/name

## 10.0.2
* export breadcrumbs 
* fix to use the users orgId for discovery settings button 

## 10.0.3
* add data-test attributes for SimpleSearchBar

## 10.0.4
* fix EditProfileButton's text color to white

## 10.0.5
* Fix: Close help modal on Chat With Support click

## 10.0.6
* bump CSP generator

# 10.0.7
* Pass cookies without domain check to support white labeling