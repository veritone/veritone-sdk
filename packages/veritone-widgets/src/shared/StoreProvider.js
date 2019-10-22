import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '../redux/configureStore';
import { util } from 'veritone-redux-common';
// import { VeritoneSDKThemeProvider } from 'veritone-react-common';

const Sagas = util.reactReduxSaga.Sagas;

export default function inVeritoneApp(Component) {
  return class StoreProvider extends React.Component {
    _store = configureStore();
    // _theme = this.props.config && this.props.config.theme;

    render() {
      return (
        // <VeritoneSDKThemeProvider theme={this._theme} >
          <Sagas middleware={this._store.sagaMiddleware}>
            <Provider store={this._store}>
              <Component {...this.props} />
            </Provider>
          </Sagas>
        // </VeritoneSDKThemeProvider>
      )
    }
  }
}
