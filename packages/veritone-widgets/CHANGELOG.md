# veritone-widgets changelog

## 1.0.0

* initial version published to NPM

## 1.0.1

* fix bad publish in 1.0.0

## 2.0.0

* FilePicker:

  * ensure endPick() is always called to close the dialog, even when file uploads fail.
  * include original filenames (without server-added UUID) in result payload at the fileName key.
  * (breaking) encode resulting s3 resource URLs with encodeUri
  * change signature of result callback to include information about warnings (some file(s) failed to upload), errors (all files failed to upload), and whether the user cancelled the picking flow by closing the dialog:

    ```
    (results: object[], { warning: string, error: string, cancelled: bool })
    ```

  * refactor to allow multiple instances of a filepicker to share the same page and app.

* AppBar:

  * fetch the user's applications (in appswitcher) correctly.
  * render the profile menu correctly when no user is present.

* VeritoneApp:

  * (breaking) rework veritoneApp.login. It should now be called with either { sessionToken } or { OAuthToken }, instead of the generic { token } param before. If called without a token, the request will be made using a cookie, if one exists. If you need an OAuth token, use the OAuthLoginButton widget (see the various stories in the widgets/ folder for examples)

  * Trying to render a widget with its elId set to an element that is not currently in the document will no longer throw an error. This should help in cases where the element needs to be shown or hidden by app code.

  * VeritoneApp will now call the method veritoneAppDidAuthenticate() on a widget, if such a method exists, when the app (re-)authenticates. This gives widgets a hook from
    which they can fetch data depencies, knowing auth is available or has changed. Widgets should also do this in componentDidMount(), to handle the case where the app is already authenticated. (see widgets/AppBar for an example)

* rework stories to make them more useable and instructive.

* refactor to use the new redux-common auth reducer move oauth grant flow code into redux-common so it can be reused.

## 2.0.1

* FilePicker:
  * fix s3 bucket url in result.
  * add `bucket` param to result objects.

## 3.0.0

* Replaced webpack with rollup

  * The bundle is now an es module rather than UMD, which should enable tree shaking to a greater extent, reducing the filesize overhead of using the library.
  * Dependencies are now external to the library rather than being included in the bundle. Because of this, bundle size is reduced significantly.
  * A commonJS bundle is also included for older toolchains that do not understand the es module format.

* FilePicker
  * (breaking) change `name` in upload result objects to `key`, to align with the actual server response.
  * add `expires`, `getUrl`, and `unsignedUrl` fields to upload result objects (see readme)

- OAuthLoginButton
  * Add onAuthSuccess, onAuthFailure callback props, which will receive the token or error, respectively, when the OAuth grant flow completes.

## 3.0.1

* FilePicker
  * Change `expires` to `expiresInSeconds` to match API update.

## 4.0.0

* Add script tag builds, making widgets available for use without a build system like webpack (see the readme for details)
* Implement OAuth implicit grant flow
  * (breaking) The OAuthLoginButton widget now uses implicit mode by default. The old behavior is available with `mode: 'authCode'`. See the storybook files and the readme for examples.
* Added devconfig.json for easier configuration during development.
* AppBar
  * Use the correct route when switching apps in the appSwitcher.

## 4.1.0

* The CJS and script tag bundles are now transpiled to >0.5% in babel-preset-env (compared to >5% previously), for wider compatibility with old browsers and tools.

## 4.2.0

* Added Table widget

## 5.0.0

With this release, the package's components have been restructured to provide both framework-agnostic widgets (as before) and React smart components. Apps built with React can now import and use widgets with far less trouble.

In order to make this possible, the exports have been slightly changed:

### Before

```javascript
// previously, all imports were widgets.
import { AppBar, FilePicker } from 'veritone-widgets';
// ...
new AppBar /*...*/();
```

### After

```javascript
// Now, widgets are named <thing>Widget...
import { AppBarWidget, FilePickerWidget } from 'veritone-widgets';

new AppBarWidget /*...*/();
new FilePickerWidget /*...*/();

// ...and smart components keep the old "plain" names
import { AppBar, FilePicker } from 'veritone-widgets';

const MyPage = () => (
  <div>
    <AppBar />
    <FilePicker />
  </div>
);
```

### Other changes:

* Updated to Material-UI v1.0.0!
* VeritoneApp.login() no longer requires a token (for internal Veritone apps where a cookie is present). Most users will not be affected by this change.
* VeritoneApp.login() now returns a promise which will be resolved or rejected when the login flow is complete.
* Refactored stories in dev to use a common BaseStory component.
* Script tag builds:
  * The VeritoneApp singleton is now stored on `window`, which should fix issues with it not being found.
  * (Breaking) Because of the new export scheme described above, script tag globals are now objects rather than direct widget exports, and must be used as follows:
    * Before: `const app = VeritoneApp(); const appBar = new AppBar();`
    * After: `const app = VeritoneApp.default(); const appBar = new AppBar.AppBarWidget()`

## 5.1.0

* Added Engine Selection widget

## 5.2.0

* Added MediaPlayer component.
* Fixed Redux devtools extension crashing.
* Engine Selection widget
  * Fix initial selected engines not reinitializing across widgets.
  * Optimized search by sharing search results state across widgets.

## 5.2.1

* Moved Video-React from a peer dependency to a dependency
* Bumped Redux to 4.0

## 5.2.2

* Bumped internal veritone-redux-common dependency.
* Import `fetchGraphQLApi` from veritone-redux-common and remove own internal version.

## 6.0.0

* Bumped internal veritone-react-common dependency
* Exported reducers and modules from various widgets so they can actually be used as smart components
* Added MediaPlayerControlBar
* (breaking) Reworked MediaPlayer to add support for bounding poly overlays
* Added EngineOutputExport/widget/module/reducer
* Engine Selection widget
  * Added separate search and filter states for tabs + UX improvements
* Themes can now be passed into VeritoneApp: `new VeritoneApp({ theme: { ... }}`

## 6.0.1

* MediaPlayer: Don't require props related to bounding poly overlay mode.

## 6.1.0

* Bump internal veritone-react-common dependency
* Add Scheduler widget
* MediaPlayerComponent
  * Fix width/height propTypes to match video-react Player's (accept string or number)

## 6.1.1

* MediaPlayer component
  * bump version and open up semver range to support changes from 6.1.0

## 6.2.0

* MediaPlayer component
  * Support styling changes introduced in veritone-react-common v6.2.0

## 6.3.0

* _Widget sagas are now started when the widget mounts, and stopped them when the widget unmounts_
  * This means tree shaking can get rid of unrelated sagas!
  * It also means unrelated sagas aren't running and possibly doing unnecessary actions in the background!
  * This is enabled by a new 2-argument widget() wrapper which accepts a saga, ie. `const FilePickerWidget = widget(FilePickerWidgetComponent, filePickerRootSaga)`
* Updates to EngineOutputExport module, see https://github.com/veritone/veritone-sdk/pull/235
* ContentTemplate
  * text inputs are now multiline
  * Added props.textInputMaxRows to allow user to specify the maximum number of rows to display
* ContentTemplateForm
  * Added props.textInputMaxRows to allow user to specify the maximum number of rows to display

## 6.3.1

* Add recompose to excluded dependencies (fixes build issues)

## 6.4.0

* Revert saga changes from 6.3.0 until a better solution is found.
* Add UserProfile widget for user profile editing
* Update AppBar to support user profile editing with the UserProfile widget

## 7.0.0

* Remove ContentTemplate
* Remove ContentTemplateForm
* Remove SourceManagementForm
* Remove SourceList
* Remove SDOTable
* Remove IngestionJobsList
* Remove SchedulerWidget
* Add UserProfileWidget
* Updates to engineOutputExport module and widget
* Update veritone icons css file version
* AppBar: always fetch enabled apps, even outside of a widget

## 7.1.0

* Add support for Azure storage blobs via File Picker

## 7.1.1

* Fix/Update engineOutputExport and export its saga

## 7.1.2

* Use version of file picker from veritone-react-common with a scrollbar when there are multiple files.

## 7.1.3

* Namespace global styles used by media player widget

## 7.2.0

* New multiple engine picker and selected engines info panel
* Beta: InfinitePicker exported as part of engine picker.

## 7.3.0

* Updated/Migrated MediaPlayer widget
* Added option to use a reskinned native control bar with the MediaPlayer
* Reskinned and added retry logic to FilePicker

## 7.4.0

* MediaPlayer: fix controlbar positioning when full screen

## 7.5.0

* AppBar: add an option to display notifications

## 7.6.0

* Update enzyme to ^3.5.0 and fix test incompatability errors
* Add DataPicker widgets, reducer, and saga

## 7.7.0

* AppBar:
  * Add Help Menu
  * Standardize AppBar Layout

## 8.0.0

* (not published to npm - skipped to 8.0.1)
* (breaking) DateTimePicker & TimeRangePicker: Pass `timezone` instead of `showTimezone`.

## 8.0.1

* Fixed missing icons from updates

## 8.0.2

* Update `veritone-react-common` version

## 8.0.3

* Fixed AppBar css overridden issue

## 8.0.4

* Fixed AppBar not importing the correct font for the title

## 8.0.5

* Exposed `open` prop for DataPicker component
* Default DataPicker to modal view

## 9.0.0

* Add folder tree widgets
* Upgrade redux and related package to latest

* **POTENTIONALLY BREAKING UPDATES** that may or may not affect existing styles / behaviours
  * Material-ui version updated to lastest
  * Redux version updated to 4.0.4
  * React-redux version updated to 7.1.3
  * Redux-form version updated to 8.2.6
  * Redux-saga version updated to 1.1.3
  * Using css-in-js
  
## 9.0.10
* Bug fixes 
* Fix user profile user name is not editable
* Add image resize functionality to file picker
* Add tracking headers
    * VeritoneApp now requires `applicationId` config parameter where `applicationId` is your veritone application's id.

## 10.0.0
* unpublished

## 10.0.1
* **Breaking Change** - profile menu styling - changed classNames
* add settings button discovery
* fix year not showing edit profile
* data-test attributes

## 10.0.2
* bump veritone-react-common

## 10.1.0
* support whitelabeling

## 10.1.1
* bump veritone-react-common to fix white labeling