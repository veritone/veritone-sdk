import React from 'react';
import ReactDOM from 'react-dom';
import { isFunction } from 'lodash';
import { Provider } from 'react-redux';

import { modules, util } from 'veritone-redux-common';
const { auth: authModule, config: configModule } = modules;

import * as appModule from '../redux/modules/veritoneApp';
import appConfig from '../../config.json';
import configureStore from '../redux/configureStore';
const Sagas = util.reactReduxSaga.Sagas;

class _VeritoneApp {
  _store = configureStore();
  _containerEl = null;

  constructor(config) {
    this._store.dispatch(configModule.setConfig({ ...appConfig, ...config }));
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
    // todo: handle promise result
    // make sure it rejects on bad auth
    if (sessionToken) {
      this._store.dispatch(authModule.setSessionToken(sessionToken));
    }

    if (OAuthToken) {
      this._store.dispatch(authModule.setOAuthToken(OAuthToken));
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
         @connect decorator, but the withRef option is not set to true.
         { withRef: true } should be set as the fourth argument to @connect`
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

  _renderReactApp() {
    this._containerEl = document.getElementById('veritone-react-app');
    if (!this._containerEl) {
      this._containerEl = document.createElement('div');
      this._containerEl.setAttribute('id', 'veritone-react-app');
      document.body.appendChild(this._containerEl);
    }

    ReactDOM.render(
      <Provider store={this._store}>
        <Sagas middleware={this._store.sagaMiddleware}>
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
                <w.Component
                  {...w.props}
                  // bind is OK because this isn't a component -- only renders
                  // when mount() is called.
                  // eslint-disable-next-line
                  ref={this.setWidgetRef.bind(this, w)}
                />,
                document.getElementById(w._elId)
              );
            }
          })}
        </div>
        </Sagas>
      </Provider>,
      this._containerEl
    );
  }
}

let _appSingleton;
export default function VeritoneApp(config, { _isWidget } = {}) {
  // client calls this on init to configure the app:
  // import VeritoneApp from 'veritone-widgets';
  // VeritoneApp({ ...myConfig })
  if (!_appSingleton) {
    if (_isWidget) {
      console.warn(
        `A widget was registered to an app which hasn't yet been authenticated. import VeritoneApp first and call login().`
      );
      return;
    }

    _appSingleton = new _VeritoneApp(config);
  }

  return _appSingleton;
}
