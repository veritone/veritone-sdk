import 'babel-polyfill'; // fixme

import React from 'react';
import ReactDOM from 'react-dom';
// import { Sagas } from 'react-redux-saga'; // fixme -- need to fork this and make compatible with react16
import { Provider } from 'react-redux';
import { object, arrayOf } from 'prop-types';

import { modules } from 'veritone-redux-common';
const { user: userModule, config: configModule } = modules;

import appConfig from '../../config.json';
import configureStore from '../redux/configureStore';

export default class VeritoneApp {
  _store = configureStore();
  _containerEl = null;
  _token = null;

  constructor(...widgets) {
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

  _renderReactApp() {
    ReactDOM.render(
      <Provider store={this._store}>
        <VeritoneRootComponent store={this._store} widgets={this._widgets} />
      </Provider>,
      this._containerEl
    );
  }
}

// todo:
// @connect VeritoneRootComponent to provide auth info/dispatch auth/boot actions.

function VeritoneRootComponent({ widgets }) {
  return (
    <div>
      {widgets.map(w =>
        ReactDOM.createPortal(<w.Component {...w.props} />, w.el)
      )}
    </div>
  );
}

VeritoneRootComponent.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  store: object.isRequired, // redux store
  widgets: arrayOf(object)
};
