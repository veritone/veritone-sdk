## Quick Start
As of v5.0.0, this package exports both React "smart components" and framework agnostic "widgets" for most components. When both are available, the smart component is the default export and the widget is a named export. For example, `import FilePicker, { FilePickerWidget } from 'veritone-widgets'` imports the smart component as FilePicker and the widget as FilePickerWidget. Smart components usually require redux reducers and sagas to be imported as well, see [Using Smart Components](#using-smart-components)

### Widgets (framework agnostic)
```javascript
import { VeritoneApp, OAuthLoginButtonWidget, AppBarWidget } from 'veritone-widgets'
const app = VeritoneApp();

// a "log in with veritone" button
const oauthButton = new OAuthLoginButtonWidget({
  // the ID of an existing element in your document where the button will appear
  elId: 'login-button-widget',
  // the ID of your Veritone application (found in Developer App)
  clientId: 'my-client-id',
  // the route in your app that will handle OAuth responses (more details below)
  redirectUri: 'https://my-app.com/handle_oauth_callback',
  // optional callbacks to retrieve the OAuth token for using outside of VeritoneApp:
  onAuthSuccess: ({ OAuthToken }) => console.log(OAuthToken),
  onAuthFailure: (error) => console.log(error)
});

// the Veritone app bar, which will receive auth after the user completes
// the oauth flow using the OAuthLoginButton
const appBar = new AppBarWidget({
  elId: 'appBar-widget',
  title: 'My App',
  backgroundColor: '#4caf50',
  profileMenu: true,
  appSwitcher: true
});
```
### React Components
```javascript
import { OAuthLoginButton } from 'veritone-widgets'

render(
  <OAuthLoginButton
    clientId="my-client-id"
    redirectUri="https://my-app.com/handle_oauth_callback"
  />
)
```

## Using Smart Components
Because smart components are not rendered within the VeritoneApp widget framework, they require the user's app to have its own redux store with the components' reducers installed. Often, [sagas](https://redux-saga.js.org/) are also included and must be started as part of the app's root saga.

### Smart component reducer/saga requirements
#### FilePicker
* reducer:
`import {filePickerReducer} from 'veritone-widgets'`

* saga:
`import {filePickerSaga} from 'veritone-widgets'`

#### Notifications
* reducer:
`import {notificationsReducer} from 'veritone-widgets'`

#### EngineOutputExport
* reducer:
`import {engineOutputExportReducer} from 'veritone-widgets'`

#### OAuthLoginButton
* reducers:
veritone-redux-common `User`, `Auth` and `Config` reducers

### Smart component theme wrapper requirements
In your app, import the `VeritoneSDKThemeProvider` from `veritone-react-common`:
```
import {VeritoneSDKThemeProvider } from 'veritone-react-common'
```
then wrap your root component with `<VeritoneSDKThemeProvider>`. If this is not possible, the `@withVeritoneSDKThemeProvider` decorator is provided to wrap individual components.

Components can be customized using [material-ui themes](https://material-ui.com/customization/themes/) by passing a theme into the `theme` prop of the provider. Passed-in themes will be merged with the default Veritone theme.

## Using Widgets
### 1. Create an instance of VeritoneApp
`VeritoneApp` is a container for all the widgets and widget data in an app. Before using any widgets, you need to import and call it. Typically this will be done when your application is loaded and initialized.

```javascript
import { VeritoneApp } from 'veritone-widgets'
const app = VeritoneApp();
```

_Note_: `VeritoneApp` creates a singleton, so you do not need to manage the constructed app instance yourself. As long as VeritoneApp() has been imported and called at least once, you can retrieve the same instance by importing and calling VeritoneApp() again elsewhere in your app, if needed.

### 2. Authenticate with Veritone via OAuth
If you already have an OAuth token (because your app handles the client-side OAuth flow on its own), provide it by calling `login()` on the returned app instance.

```javascript
import { VeritoneApp } from 'veritone-widgets'
const app = VeritoneApp().login({
  OAuthToken: 'my-token-here'
});
```
 
Calling `login()` is usually not necessary; we provide an `OAuthLoginButton` widget, which handles the OAuth token exchange automatically. See the instructions in the next section for more information.


### 3. Add widgets to your app
After you've initialized the app framework by calling `VeritoneApp()`, you can begin using widgets.

A "widget" is a self-contained frontend component. Widgets always render into an empty element which you provide. They are self-contained and handle rendering a UI, responding to user interactions, making api calls, and so on.

For example, the `AppBar` widget renders the Veritone application toolbar, fetches the required data to render the Veritone app switcher and profile menu, and allows the developer to configure their application logo and title. When the user uses the app switcher or uses the profile menu to log out, the AppBar widget handles those events.  

Widgets typically can be configured with a variety of options, but always require at least `elId`. This is the id (string) of an element in your document, often a `div`, into which the widget will be rendered. By applying styling to that div, you can position the widget around your app. The element specified in elId must exist in the document before you create the widget that will use it.

#### Example: Using the OAuthLoginButton widget
The first widget you are likely to include is `OAuthLoginButton`. `OAuthLoginButton` renders a "log in with Veritone" button that your users can click to start the OAuth authentication flow. At the end of that flow, your VeritoneApp instance will be authenticated and able to make requests to our API. You can also retrieve the oauth token to use in your own app.

_Note_: Unless you are handling the OAuth flow on your own and providing the token to VeritoneApp manually, the `OAuthLoginButton` widget is required for Veritone widgets to work.

The actual code you write to use widgets will vary based on your framework of choice, but in general, it should be as follows.

```javascript
// assuming VeritoneApp has already been initialized as described earlier, and given a document like:
<body>
  ...
  <div id="login-button-widget" />
</body>

// you can render the login button to the document like this:
import { OAuthLoginButtonWidget } from 'veritone-widgets'
const oauthButton = new OAuthLoginButtonWidget({
  // the ID of an existing element in your document where the button will appear
  elId: 'login-button-widget',
  // the ID of your Veritone application (found in Developer App)
  clientId: 'my-client-id',
  // the route in your app that will handle OAuth responses (more details below)
  redirectUri: 'https://my-app.com/handle_oauth_callback',
  // optional callbacks to retrieve the OAuth token for using outside of VeritoneApp:
  onAuthSuccess: ({ OAuthToken }) => console.log(OAuthToken),
  onAuthFailure: (error) => console.log(error)
});
```

When `new OAuthLoginButtonWidget({ ... })` runs, the widget will appear on your page.

#### Example: Using the AppBar widget
All Veritone apps should also include the AppBar widget.

```javascript
<body>
  <div id="appBar-widget" />
  ...
</body>

import { AppBarWidget } from 'veritone-widgets'
const appBar = new AppBarWidget({
  elId: 'appBar-widget',
  title: 'My App',
  backgroundColor: '#4caf50',
  profileMenu: true,
  appSwitcher: true
});
```

## Use via script tag
For environments that do not support javascript module imports, widgets can also be included in an app via script tags.

```
<body>
  <div id="appBar-widget"></div>

  <script src="https://unpkg.com/veritone-widgets@^5/dist/umd/VeritoneApp.js"></script>
  <script src="https://unpkg.com/veritone-widgets@^5/dist/umd/AppBar.js"></script>

  <script>
    const app = VeritoneApp.default();

    const appBar = new AppBar.AppBarWidget({
      elId: 'appBar-widget',
      title: 'AppBar Widget',
      profileMenu: true,
      appSwitcher: true
    });
  </script>
</body>
```

As you can see, each widget is bundled individually to keep file sizes small. In addition, VeritoneApp is separately bundled and required to use widgets. Scripts can be accessed from the the [unpkg](https://unpkg.com/) cdn or downloaded and hosted on your own infrastructure. Unpkg supports [semver ranges](https://docs.npmjs.com/misc/semver), or a specific version can be specified exactly. 


## Configuring widgets
Note that the OAuthLoginButton widget in the example above is being configured with five properties: elId, clientId, OAuthURI, onAuthSuccess and onAuthFailure. As mentioned earlier, an elId is required for every widget. OAuthURI, clientId, onAuthSuccess and onAuthFailure are specific configurable properties on the OAuthLoginButton. As it is in the example, configuration is always provided to the widget constructor.

## Widget instance methods
Some widgets have methods which can be called on an instance of that widget. For example, the FilePicker widget has the methods `pick()` and `cancel()` to open and close the picker dialog, respectively.

```javascript
this._picker = new FilePickerWidget({
  elId: 'file-picker-widget',
  accept: ['image/*'],
  multiple: true
});

...
// call the pick() instance method on the widget
this._picker.pick(files => console.log(files))
```

#### Where to look for widget options
In practice, a widget is just a wrapper around a React component. The easiest way to determine all the possible options for a given widget is to look at the PropTypes of its component. Remember to watch for console warnings which will indicate when an option was configured incorrectly, or when a required option was not provided. 

* The "storybook" dev environments in veritone-widgets and veritone-react-common have live examples of the various widgets and components.

* The `story.js` file in the root of each widget folder in veritone-widgets and in the root of each component folder in veritone-react-common show the code used to create the storybook pages. If you are using React to write your application, these can be used directly as a basis for your own implementation. 

* The PropTypes in the source files of the various widgets (in veritone-widgets) and their respective components (in veritone-react-common) generally correspond to configurable options. Likewise, instance methods for a widget will be defined on its widget class in veritone-widgets.

### Destroying widgets
To remove a widget, call `destroy()` on the instance
```javascript
const oauthButton = new OAuthLoginButtonWidget({ ... });
...
oauthButton.destroy();
```

## Available widgets
The current widgets are:

**AppBar**

The title and navigation bar common between all Veritone applications. Includes a logo, title, the Veritone app switcher and profile menu.

*Options:*

* title: string, a title to show in the center of the AppBar
* logoSrc: string, a URL or image (like an SVG) to use as the logo on the left-hand side of the AppBar.
* backgroundColor: string, a color (in hex) to use for the AppBar background
* profileMenu: bool, whether or not to show the profile menu
* appSwitcher: bool, whether or not to show the app switcher menu
* logo: bool, whether or not to show the veritone logo on the left side of the AppBar
* onLogout: func, called when the user clicks "logout". Apps must implement their own logout logic (usually by deleting the stored oauth token and redirecting or refreshing the page appropriately)

**OAuthLoginButton**
The "Log in with Veritone" button and corresponding frontend logic to handle the OAuth2 authentication flow.

*Options:*
* mode: "implicit" (default) or "authCode", the OAuth grant type you wish to use. 
* OAuthURI: string (required if using `authCode` mode), the URL of your app server's OAuth callback endpoint.
* redirectUri: string (required if using `implicit` mode), the URL of your app frontend's OAuth callback endpoint.
* clientID: string (required if using implicit mode), the ID of your Veritone application (found in Developer App)
* onAuthSuccess: function, a callback that will be called with the OAuth token when the OAuth flow is completed successfully.
* onAuthFailure: function, a callback that will be called with the error when the OAuth flow fails.

*Requirements*

Veritone provides two OAuth modes to suit different app requirements:

`Implicit`, the default mode, is a frontend-only grant flow with no serverside requirement. _Most apps will use this mode._ This flow is much easier for apps to implement but has the downside of not returning a refresh token; users will need to log in again each time their token expires. 

`Auth Code` is a server-based grant flow, which uses your Veritone app's OAuth secret to retrieve both an auth token and refresh token. Auth code flow requires a server because the OAuth secret cannot be exposed to the client; the veritone-widets-server package is an example implementation, and more information can be found in its readme.

**FilePicker**

The Veritone file upload dialog. Handles selecting and uploading files to S3 for use on the Veritone platform.

*Options:*

* accept: oneOfType([arrayOf(string), string]), file extension(s) or mimetype(s) which the file picker will accept
* multiple: bool, whether the picker will accept multiple files to upload in a batch
* width: number, the width of the filepicker dialog
* height: number, the height of the filepicker dialog
* allowUrlUpload: bool, whether the filepicker will allow files to be selected by URL

*Instance methods*

* pick(callback): open the filepicker dialog.
  * callback signature is (result, { warning, error, cancelled })
    * result: array of result objects, one for each file uploaded
      * key: string, the filename as stored on the server (may include a UUID)
      * fileName: string, the original filename
      * size: number, the file size in bytes
      * type: string, the mime type of the file
      * error: string or `false`, the error that prevented the file from uploading, if any
      * bucket: string, the S3 bucket to which the file was uploaded
      * expiresInSeconds: number, the length of time the credentials in `getUrl` will be valid, in seconds.
      * getUrl: string or `null`, the resulting S3 URL, if successful. Includes credentials that are valid for `expires` seconds. 
      * unsignedUrl: string or `null`, the resulting S3 URL, if successful. Does not include credentials and will need to be signed to be used.
    * warning: string or `false`, a warning message if some (but not all) files failed to upload. A warning indicates that `result` contains some successful upload result objects, and some that were not successful (unsuccessful objects will have `error` populated with an error message, as noted above)
    * error: string or `false`, an error message, if all files failed to upload.
    * cancelled: bool, whether or not the filepicker interaction was cancelled (by the user, or by calling cancel()).

* cancel(): close the filepicker dialog. The callback provided to pick() will be called with `(null, { cancelled: true })`.

**Table**

A Veritone table to display data.

*Options:*

* data: arrayOf(object) (required), the dataset
* columns: arrayOf(shape) (required), a set of defintions for each column to be displayed
  * shape: object with the following keys:
    * dataKey: string (required), the data attribute to display within column 
    * header: string, the column heading
    * transform: function, specifies how column data should be displayed
      * signature: `(cellValue) => {}`
    * menu: bool, identifies a column as a menu column
    * onSelectItem: function, when `menu` is `true`, specifies action(s) to take when a menu option is clicked
      * signature: `(menuAction) => {}`
    * cursorPointer: bool, show cursor pointer over table cells
    * align: string, specifies columm alignment: `['left', 'right', 'center']`
    * width: number, specifies the width of a column
* paginate: bool, specifies whether table data should be paginated
* initialItemsPerPage: number, the number of items to display per page in a paginated table,
* onCellClick: function, specifies action to take when a table cell is clicked
  * signature: `(cellRow, cellColumn, cellData) => {}`
* focusedRow: number, identifies a row to display additional content for
* renderFocusedRowDetails: function, specifies additional content to display for `focusedRow`
  * signature: `(focusedRowData) => (string | react component)`
* onShowCellRange: function, fires when table page or rows (on page) changes;
  * signature: `({ start: firstRowIndex, end: lastRowIndex }) => {}`
* onRefreshPageData: function, specifies how to refresh data (if needed)
  * signature: `() => {}`
* emptyMessage: string, text to display when table has no data

**EngineOutputExport**

The Veritone export engine outputs full screen dialog. This will fetch the engines ran on a tdo/recording and allow the user to configure what file types are included in the export

*Options:*

* tdos: arrayOf(shape), array of tdo data objects that engine outputs will be exported for
  * shape: object with the following keys:
    * tdoId: string (required), the unique id of a tdo you want to export engine outputs for
    * mentionId: string, the unique id of a mention you want to export engine outputs for. If a mentionId is provided the engine results of the mention will be returned rather than those of the tdo
    * startOffsetMs: number, an integer representing the number of milliseconds from the start of the tdo where the exported engine outputs will begin
    * stopOffsetMs: number, an integer representing the number of milliseconds from the start of the tdo where the exported engine outputs will end
* onExport: func, specifies action to take when export button is clicked
  * signature: `(response) => {}`
* onCancel: func, specifies action to take when cancel button is clicked
  * signature: `() => {}`

*Instance methods*

* open(): opens the export engine output dialog.

## Running the development environment (storybook)
1. Set up your local clone of veritone-sdk, following the instructions in the [main readme](https://github.com/veritone/veritone-sdk#development)
2. cd to this package
3. In `config.dev.json`, fill in the missing fields with your own app's information (see our [application quick-start guide](http://docs.veritone.com/#/applications/quick-start/) for more info on how to create an app). **Your app's `URL` and `redirect URL` should be set to the same value** for the purposes of dev in this package. This default allows the environment to run with minimal config. 
4. run `yarn start`.
5. When the build finishes, access the storybook at the url provided in your terminal.

## License
Copyright 2019, Veritone Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
