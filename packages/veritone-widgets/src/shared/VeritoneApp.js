import React from 'react';
import ReactDOM from 'react-dom';
import { isFunction, isObject } from 'lodash';
// import { Sagas } from 'react-redux-saga'; // fixme -- need to fork this and make compatible with react16
import { Provider } from 'react-redux';

import { modules } from 'veritone-redux-common';
const { user: userModule, config: configModule } = modules;

import appConfig from '../../config.json';
import configureStore from '../redux/configureStore';

export default class VeritoneApp {
  _store = configureStore();
  _containerEl = null;
  _token = null;
  _refs = {};

  constructor(widgets) {
    this._widgets = widgets;

    this._store.dispatch(configModule.setConfig(appConfig));
  }

  // auth can follow two paths:
  // 1. internal apps, make /current-user api call with appInstance.login().
  //    this can happen automatically.
  // 2. oauth apps, popup window flow. must be initiated by user action (clicking a button).
  //    oauth apps must add an OAuthLoginButtonWidget and do not need to call login()
  login({ token } = {}) {
    // new VeritoneApp(...widgets)
    //   .login() // try to use an existing cookie
    // or
    //   .login({ token }); // use provided token in header

    // todo: handle promise result
    // make sure it rejects on bad auth
    if (token) {
      this._token = token;
      return this._store
        .dispatch(userModule.fetchUser({ token }))
        .then(this._handleLoginResponse);
    } else {
      return this._store
        .dispatch(userModule.fetchUser())
        .then(this._handleLoginResponse);
    }
  }

  _handleLoginResponse(action) {
    return action.error ? Promise.reject(action) : action;
  }

  mount() {
    const existingApp = document.getElementById('veritone-react-app');
    if (existingApp) {
      // todo: should this be an error?
      return console.warn(
        'The DOM element from a VeritoneApp instance already exists on this page. ' +
          'Destroy it before mounting a new one.'
      );
    }

    this._containerEl = document.createElement('div');
    this._containerEl.setAttribute('id', 'veritone-react-app');
    document.body.appendChild(this._containerEl);

    this._widgets.forEach(w => w.init());
    this._renderReactApp();

    return this;
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

  getWidget(widgetOrId) {
    const id = isObject(widgetOrId) ? widgetOrId.id : widgetOrId;
    return this._refs[id];
  }

  setWidgetRef = (id, ref) => {
    if (!ref) {
      // protect against errors when destroying the app
      return;
    }

    if (isFunction(ref.getWrappedInstance) && !ref.wrappedInstance) {
      return console.warn(
        `Warning: widget with id "${id}" looks like it's wrapped with a
         @connect decorator, but the withRef option is not set to true.
         { withRef: true } should be set as the fourth argument to @connect`
      );
    }

    // try to get at the base component for @connected widgets.
    // fixme: generic solution (hoisting specified instance methods?)
    // https://github.com/elado/hoist-non-react-methods
    this._refs[id] = isFunction(ref.getWrappedInstance)
      ? ref.getWrappedInstance()
      : ref;
  };

  _renderReactApp() {
    ReactDOM.render(
      <Provider store={this._store}>
        <div>
          {this._widgets.map(w =>
            ReactDOM.createPortal(
              <w.Component
                {...w.props}
                // bind is OK because this isn't a component -- only renders
                // when mount() is called.
                // eslint-disable-next-line
                ref={this.setWidgetRef.bind(this, w.id)}
              />,
              w.el
            )
          )}
        </div>
      </Provider>,
      this._containerEl
    );
  }
}
