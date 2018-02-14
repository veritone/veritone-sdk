## Getting started
Before using any widgets, first import and call `VeritoneApp`. Typically this will be done when your application is loaded and initialized.

```javascript
import { VeritoneApp } from 'veritone-widgets'
const app = VeritoneApp();
```

_Note_: `VeritoneApp` creates a singleton, so you do not need to manage the constructed app instance yourself. As long as VeritoneApp() has been imported and called at least once, you can retrieve the same instance by importing and calling VeritoneApp() again elsewhere in your app, if needed.

## Authentication
If you already have an OAuth token, provide it by calling `login()` on the returned app instance.

```javascript
import { VeritoneApp } from 'veritone-widgets'
const app = VeritoneApp().login({
  OAuthToken: 'my-token-here'
});
```
 
Calling `login()` is usually not necessary; we provide an `OAuthLoginButton` widget, which handles the OAuth token exchange automatically. See the instructions in the next section for more information.


## Using widgets
After you've initialized the app framework by calling `VeritoneApp()`, you can begin using widgets.

A "widget" is a self-contained frontend component. Widgets always render into an empty element which you provide. They are self-contained and handle rendering a UI, responding to user interactions, making api calls, and so on.

For example, the AppBar widget renders the Veritone application toolbar, fetches the required data to render the Veritone app switcher and profile menu, and allows the developer to configure their application logo and title. When the user uses the app switcher, or uses the profile menu to log out, the AppBar widget handles those events.  

Widgets typically can be configured with a variety of options, but always require at least `elId`. This is the id (string) of an element in your document, often a `div`, into which the widget will be rendered. By applying styling to that div, you can position the widget around your app. The element specified in elId must exist in the document before you create the widget that will use it.

### Example: Using the OAuthLoginButton widget
The first widget you are likely to include is `OAuthLoginButton`. `OAuthLoginButton` renders a "log in with veritone" button, which your users can click to start the authentication flow. At the end of that flow, your VeritoneApp instance will be authenticated and able to make requests to our API. You can also retrieve the oauth token to use in your own app.

_Note_: Unless you are handling the OAuth flow on your own and providing the token to VeritoneApp manually, the `OAuthLoginButton` widget is required for Veritone widgets to work.

The actual code you write to use widgets will vary based on your framework of choice, but in general, it should be as follows.

```javascript
// assuming VeritoneApp has already been initailized as described earlier, and a document like:
<body>
  ...
  <div id="login-button-widget" />
</body>

// render the login button to the document like this:
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


### Configuring widgets
Note that the OAuthLoginButton widget in the example above is being configured with four properties: elId, OAuthURI, onAuthSuccess and onAuthFailure. As mentioned earlier, an elId is required for every widget. OAuthURI, onAuthSuccess and onAuthFailure are specific configurable properties on the OAuthLoginButton, among others. Configuration is always provided to the constructor.

In practice, a widget is just a wrapper around a React component. The easiest way to determine all the possible options for a given widget is to look at the PropTypes of its component. Remember to watch for console warnings which will indicate when an option was configured incorrectly, or when a required option was not provided. 

### Widget instance methods
Some widgets have methods which can be called on an instance of that widget. For example, the FilePicker widget has the methods `pick()` and `cancel()` to open and close the picker dialog, respectively.

```javascript
this._picker = new FilePicker({
  elId: 'file-picker-widget',
  accept: ['image/*'],
  // allowUrlUpload: false
  multiple: true
});

...

this._picker.pick(files => console.log(files))
```

#### Where to look for widget options
* The "storybook" dev environments in veritone-widgets and veritone-react-common have live examples of the various widgets and components.

* The `story.js` file in the root of each widget folder, and the root of each component folder in veritone-react-common show the code used to create the storybook pages.

* The PropTypes in the source files of the various widgets and components generally correspond to configurable options. Likewise, instance methods for a widget will be defined on its widget class.

### Destroying widgets
To remove a widget, call `destroy()` on the instance
```javascript
const oauthButton = new OAuthLoginButton({ ... });
...
oauthButton.destroy();
```



## Available widgets
The current widgets are:
* *AppBar*: The title and navigation bar common between all Veritone applications. Includes a logo, title, the Veritone app switcher and profile menu.


## Serverside requirements


# License
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