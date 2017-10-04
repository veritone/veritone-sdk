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

    const existingApp = document.getElementById('veritone-react-app');
    if (existingApp) {
      // todo: should this be an error?
      console.warn(
        'The DOM element from a VeritoneApp instance already exists on this page. Deleting it.'
      );

      document.removeChild(existingApp);
    }
  }

  _renderReactApp() {
    ReactDOM.render(
      <VeritoneRootComponent store={this._store} widgets={this._widgets} />,
      this._containerEl
    );
  }

  mount() {
    this._containerEl = document.createElement('div');
    this._containerEl.setAttribute('id', 'veritone-react-app');
    document.body.appendChild(this._containerEl);

    this._widgets.forEach(w => w.init());
    this._renderReactApp();
  }
}

class VeritoneRootComponent extends React.Component {
  render() {
    const components = this.props.widgets.map(w => w.getComponent());

    return (
      <Provider store={this.props.store}>
        <div>
          This is the veritone app
          {this.props.widgets.map(w =>
            w.el && ReactDOM.createPortal(React.createElement(w.getComponent()), w.el)
          )}
        </div>
      </Provider>
    );
  }
}
