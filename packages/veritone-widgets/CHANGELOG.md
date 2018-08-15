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


* OAuthLoginButton
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
new AppBar(/*...*/)
```

### After
```javascript
// Now, widgets are named <thing>Widget...
import { AppBarWidget, FilePickerWidget } from 'veritone-widgets';

new AppBarWidget(/*...*/);
new FilePickerWidget(/*...*/);


// ...and smart components keep the old "plain" names
import { AppBar, FilePicker } from 'veritone-widgets';

const MyPage = () => (
  <div>
    <AppBar/>
    <FilePicker/>
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
  *  Fix initial selected engines not reinitializing across widgets.
  *  Optimized search by sharing search results state across widgets.

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
