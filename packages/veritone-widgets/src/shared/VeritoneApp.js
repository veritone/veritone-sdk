import 'babel-polyfill'; // fixme

// new VeritoneApp([...widgets])
import React from 'react';
import ReactDOM from 'react-dom';
// import { Sagas } from 'react-redux-saga'; // fixme -- need to fork this and make compatible with react16
import { Provider } from 'react-redux';

import configureStore from './redux/configureStore';

export default class VeritoneApp {
  constructor(...widgets) {
    this._widgets = widgets;
    this._store = configureStore();
    this._containerEl = null;
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
      } catch (e) {}
    }
  }

  _renderReactApp() {
    return ReactDOM.render(
      <VeritoneRootComponent store={this._store} widgets={this._widgets} />,
      this._containerEl
    );
  }
}

import { AppBar } from 'veritone-react-common';

function VeritoneRootComponent({store, widgets }) {
  return (
    <Provider store={store}>
      <div>
        {widgets.map(w =>
          ReactDOM.createPortal(<w.Component {...w.props}/>, w.el)
        )}
      </div>
    </Provider>
  );
}
