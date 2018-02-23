## Quick Start
```javascript
import { VeritoneApp } from 'veritone-widgets'
const app = VeritoneApp();

// a "log in with veritone" button
const oauthButton = new OAuthLoginButton({
  // the ID of an existing element in your document where the button will appear
  elId: 'login-button-widget',
  // your app server's authentication endpoint (required):
  OAuthURI: 'http://localhost:5001/auth/veritone',
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

## Use
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
// assuming VeritoneApp has already been initailized as described earlier, and given a document like:
<body>
  ...
  <div id="login-button-widget" />
</body>

// you can render the login button to the document like this:
import { OAuthLoginButton } from 'veritone-widgets'
const oauthButton = new OAuthLoginButton({
  // the ID of the element in your document where the button will appear
  elId: 'login-button-widget',
  // your app server's authentication endpoint (required):
  OAuthURI: 'http://localhost:5001/auth/veritone', 
  // optional callbacks to retrieve the OAuth token for using outside of VeritoneApp:
  onAuthSuccess: ({ OAuthToken }) => console.log(OAuthToken),
  onAuthFailure: (error) => console.log(error)
});
```

When `new OAuthLoginButton({ ... })` runs, the widget will appear on your page.

#### Example: Using the AppBar widget
All Veritone apps should also include the AppBar widget.

```javascript
<body>
  <div id="appBar-widget" />
  ...
</body>

import { AppBar } from 'veritone-widgets'
const appBar = new AppBarWidget({
  elId: 'appBar-widget',
  title: 'My App',
  backgroundColor: '#4caf50',
  profileMenu: true,
  appSwitcher: true
});
```

## Configuring widgets
Note that the OAuthLoginButton widget in the example above is being configured with four properties: elId, OAuthURI, onAuthSuccess and onAuthFailure. As mentioned earlier, an elId is required for every widget. OAuthURI, onAuthSuccess and onAuthFailure are specific configurable properties on the OAuthLoginButton. As it is in the example, configuration is always provided to the widget constructor.

## Widget instance methods
Some widgets have methods which can be called on an instance of that widget. For example, the FilePicker widget has the methods `pick()` and `cancel()` to open and close the picker dialog, respectively.

```javascript
this._picker = new FilePicker({
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
const oauthButton = new OAuthLoginButton({ ... });
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

**OAuthLoginButton**
The "Log in with Veritone" button and corresponding frontend logic to handle the OAuth2 authentication flow.

*Options:*

* OAuthURI: string (required), the URL of your app server's OAuth authentication endpoint
* onAuthSuccess: function, a callback that will be called with the OAuth token when the OAuth flow is completed successfully.
* onAuthFailure: function, a callback that will be called with the error when the OAuth flow fails.


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
      * expires: number, the length of time the credentials in `getUrl` will be valid, in seconds.
      * getUrl: string or `null`, the resulting S3 URL, if successful. Includes credentials that are valid for `expires` seconds. 
      * unsignedUrl: string or `null`, the resulting S3 URL, if successful. Does not include credentials and will need to be signed to be used.
    * warning: string or `false`, a warning message if some (but not all) files failed to upload. A warning indicates that `result` contains some successful upload result objects, and some that were not successful (unsuccessful objects will have `error` populated with an error message, as noted above)
    * error: string or `false`, an error message, if all files failed to upload.
    * cancelled: bool, whether or not the filepicker interaction was cancelled (by the user, or by calling cancel()).

* cancel(): close the filepicker dialog. The callback provided to pick() will be called with `(null, { cancelled: true })`.

## Serverside requirements
The OAuth2 flow requires both frontend and serverside components. An example server implementation can be found in the `veritone-widgets-server` package. The responsibility of the server is primarily to manage the application's OAuth secret during the token exchange with Veritone's servers. Please see the `veritone-widgets-server` readme for more information. 

## Running the development environment (storybook)
1. Set up your local clone of veritone-sdk, following the instructions in the [main readme](https://github.com/veritone/veritone-sdk#development)
2. In the `packages/veritone-widgets-server` folder, fill in the missing fields in the `env.development` file with your own app's information (see our [application quick-start guide](http://docs.veritone.com/applications/quick-start/) for more info on how to create an app)
3. In the `packages/veritone-widgets` folder, run `yarn start`.
4. When the build finishes, access the storybook at the url provided in your terminal.

## License
Copyright 2017, Veritone Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.