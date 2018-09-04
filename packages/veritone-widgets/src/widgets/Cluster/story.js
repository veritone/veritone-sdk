import React from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as formReducer } from 'redux-form'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react';
import ClusterSplashScreen from './splash-screen';
import ClusterWizardDetails from './ClusterWizard/form/details'
import ClusterWizardNodes from './ClusterWizard/form/nodes'
import { ClusterWizardWidget } from './ClusterWizard';
// import createReducer from '../../redux/rootReducer';
import { modules } from 'veritone-redux-common';
const {
  user: { reducer: userReducer, namespace: userNamespace },
  config: { reducer: configReducer, namespace: configNamespace },
  auth: { reducer: authReducer, namespace: authNamespace },
  engine: { reducer: engineReducer, namespace: engineNamespace }
} = modules;
import engineSelectionReducer, { namespace as engineSelectionNamespace } from '../../redux/modules/engineSelection';
import { getBaseMiddlewares, getDevOnlyMiddlewares } from '../../redux/store';
import BaseStory from '../../shared/BaseStory';

const rootReducer = combineReducers({
  form: formReducer,
  [engineNamespace]: engineReducer,
  [engineSelectionNamespace]: engineSelectionReducer,
  [configNamespace]: configReducer,
  [userNamespace]: userReducer,
  [authNamespace]: authReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    stateSanitizer: state => ({
      ...state,
      veritoneApp: '(omitted)'
    })
  })
  : compose;

const enhancer = composeEnhancers(
  applyMiddleware(
    ...getBaseMiddlewares(),
    ...getDevOnlyMiddlewares()
  )
);

const store = createStore(rootReducer, {}, enhancer);

storiesOf('Cluster', module)
  .add('Splash Screen', () => {
    return <ClusterSplashScreen />;
  })
  .add('Wizard - Details', () => {
    return (
      <Provider store={store}>
        <ClusterWizardDetails
          fields={{
            name: 'clusterName',
            metrics: 'metrics'
          }}
          metrics={['logging', 'usageData', 'health']}
        />
      </Provider>
    );
  })
  .add('Wizard - Nodes', () => {
    return (
      <Provider store={store}>
        <ClusterWizardNodes
          fields={{
            nodes: 'nodes'
          }}
        />
      </Provider>
    );
  })
  .add('Wizard', () => {
    // return (
    //   <Provider store={store}>
    //     <ClusterWizard />
    //   </Provider>
    // );
    return (
      <BaseStory
        widget={ClusterWizardWidget}
        // componentClass={AppBar}
        // componentProps={{ ...props, title: 'AppBar Component' }}
      />
    );
  });
