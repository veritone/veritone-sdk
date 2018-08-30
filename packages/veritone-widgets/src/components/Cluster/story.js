import React from 'react';
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react';
import ClusterSplashScreen from './splash-screen';
import ClusterWizardDetails from './ClusterWizard/form/details'
import ClusterWizardNodes from './ClusterWizard/form/nodes'
import ClusterWizard from './ClusterWizard/cluster-wizard';
// import createReducer from '../../redux/rootReducer';
import { modules } from 'veritone-redux-common';
const { engine: { reducer: engineReducer, namespace: engineNamespace } } = modules;
import engineSelectionReducer, { namespace } from '../../redux/modules/engineSelection';


const rootReducer = combineReducers({
  form: formReducer,
  [engineNamespace]: engineReducer,
  [namespace]: engineSelectionReducer
});

const store = createStore(rootReducer);

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
    return (
      <Provider store={store}>
        <ClusterWizard />
      </Provider>
    );
  });
