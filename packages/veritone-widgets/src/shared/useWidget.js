import React from 'react';
import { Provider } from 'react-redux';
import appConfig from '../../config.json';
import configureStore from '../redux/configureStore';
import { modules, util } from 'veritone-redux-common';
import { VeritoneSDKThemeProvider } from 'veritone-react-common';

const { config: configModule } = modules;

const Sagas = util.reactReduxSaga.Sagas;

export default function useWidget(Component) {
  return class WidgetComponent extends React.Component {
    constructor(props) {
      super(props);
      this.store = configureStore();
      this.store.dispatch(configModule.setConfig({
        ...appConfig,
        ...props.config
      }))
      this.theme = props.config && props.config.theme;
    }

    render() {
      return (
        <VeritoneSDKThemeProvider theme={this.theme}>
          <Sagas middleware={this.store.sagaMiddleware}>
            <Provider store={this.store}>
              <Component />
            </Provider>
          </Sagas>
        </VeritoneSDKThemeProvider>
      )
    }
  }
}
