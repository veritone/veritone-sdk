import React from 'react';
import ReactDOM from 'react-dom';
import { isFunction } from 'lodash';
import { Provider } from 'react-redux';
import * as appModule from '../redux/modules/veritoneApp';
import appConfig from '../../config.json';
import configureStore from '../redux/configureStore';
import { modules, util, helpers } from 'veritone-redux-common';
import { VeritoneSDKThemeProvider } from 'veritone-react-common';
import { PropUpdater } from './PropUpdater';

const { auth: authModule, config: configModule, user: userModule } = modules;
const { promiseMiddleware } = helpers;
const {
  WAIT_FOR_ACTION,
  ERROR_ACTION,
  CALLBACK_ERROR_ARGUMENT
} = promiseMiddleware;

const Sagas = util.reactReduxSaga.Sagas;
class _VeritoneApp {
  _store = configureStore();
  _containerEl = null;

  constructor(config) {
    this._store.dispatch(configModule.setConfig({ ...appConfig, ...config }));
    this._theme = config && config.theme;
  }

  _register(widget) {
    this._store.dispatch(appModule.widgetAdded(widget));
    this._renderReactApp();
  }

  _unregister(widget) {
    this._store.dispatch(appModule.widgetRemoved(widget));
    this._renderReactApp();
  }

  login({ sessionToken, OAuthToken } = {}) {
    // Allows us to transform dispatch into a promise by adding symbols
    // See promiseMiddleware.js
    const addSymbols = action => {
      return {
        ...action,
        [WAIT_FOR_ACTION]: userModule.FETCH_USER_SUCCESS,
        [ERROR_ACTION]: userModule.FETCH_USER_FAILURE,
        [CALLBACK_ERROR_ARGUMENT]: action => action.payload
      };
    };

    if (sessionToken) {
      return this._store.dispatch(
        addSymbols(authModule.setSessionToken(sessionToken))
      );
    } else if (OAuthToken) {
      return this._store.dispatch(
        addSymbols(authModule.setOAuthToken(OAuthToken))
      );
    } else {
      return this._store.dispatch(addSymbols(authModule.checkAuthNoToken()));
    }
  }

  destroy() {
    if (this._containerEl) {
      ReactDOM.unmountComponentAtNode(this._containerEl);
      try {
        document.body.removeChild(this._containerEl);
      } catch (e) {
        // ignore
      }
    }
  }

  setWidgetRef = (widget, ref) => {
    if (!ref) {
      // protect against errors when destroying the app
      return;
    }

    if (isFunction(ref.getWrappedInstance) && !ref.wrappedInstance) {
      console.warn(
        `Warning: the following widget looks like it's wrapped with a
         @connect decorator, but the forwardRef option is not set to true.
         { forwardRef: true } should be set as the fourth argument to @connect`
      );
      console.warn(widget);

      return;
    }

    // try to get at the base component for @connected widgets.
    // fixme: generic solution (hoisting specified instance methods?)
    // https://github.com/elado/hoist-non-react-methods
    const r = isFunction(ref.getWrappedInstance)
      ? ref.getWrappedInstance()
      : ref;

    widget.setRefProperties(r);
  };

  setPropsUpdaterRef = (widget, ref) => {
    if (!ref) {
      // protect against errors when destroying the app
      return;
    }

    widget.setUpdaterProperties(ref);
  };

  _renderReactApp() {
    this._containerEl = document.getElementById('veritone-react-app');
    if (!this._containerEl) {
      this._containerEl = document.createElement('div');
      this._containerEl.setAttribute('id', 'veritone-react-app');
      document.body.appendChild(this._containerEl);
    }

    ReactDOM.render(
      <VeritoneSDKThemeProvider theme={this._theme}>
        <Sagas middleware={this._store.sagaMiddleware}>
          <Provider store={this._store}>
            <div>
              {appModule.widgets(this._store.getState()).map(w => {
                if (!w._elId) {
                  console.warn(
                    'The widget',
                    w,
                    'needs to specify an elId that references an existing dom node.'
                  );
                  return null;
                }

                if (document.getElementById(w._elId)) {
                  return ReactDOM.createPortal(
                    <PropUpdater
                      initialProps={w.props}
                      // eslint-disable-next-line react/jsx-no-bind
                      ref={this.setPropsUpdaterRef.bind(this, w)}
                      // eslint-disable-next-line react/jsx-no-bind
                      render={props => (
                        <w.Component
                          {...props}
                          // bind is OK because this isn't a component -- only renders
                          // when mount() is called.
                          // eslint-disable-next-line
                          ref={this.setWidgetRef.bind(this, w)}
                        />
                      )}
                    />,
                    document.getElementById(w._elId)
                  );
                }
              })}
            </div>
          </Provider>
        </Sagas>
      </VeritoneSDKThemeProvider>,
      this._containerEl
    );
  }
}

let global = window || {};
export default function VeritoneApp(config, { _isWidget } = {}) {
  // client calls this on init to configure the app:
  // import VeritoneApp from 'veritone-widgets';
  // VeritoneApp({ ...myConfig })
  if (!global.__veritoneAppSingleton) {
    if (_isWidget) {
      console.warn(
        `A widget was registered to an app which hasn't yet been initialized. Import and call VeritoneApp before constructing any widgets.`
      );
      return;
    }

    global.__veritoneAppSingleton = new _VeritoneApp(config);
  }

  return global.__veritoneAppSingleton;
}
