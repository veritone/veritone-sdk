import React from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { noop } from 'lodash';
import ClusterWizardDetails from './ClusterWizard/form/details';
import ClusterWizardNodes from './ClusterWizard/form/nodes';
import { ClusterWizardWidget } from './ClusterWizard';
import ClusterList from './ClusterList';
import { modules } from 'veritone-redux-common';
import wizardConfig from './ClusterWizard/wizard-config';

const {
  user: { reducer: userReducer, namespace: userNamespace },
  config: { reducer: configReducer, namespace: configNamespace },
  auth: { reducer: authReducer, namespace: authNamespace },
  engine: { reducer: engineReducer, namespace: engineNamespace }
} = modules;
import engineSelectionReducer, {
  namespace as engineSelectionNamespace
} from '../../redux/modules/engineSelection';
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
  applyMiddleware(...getBaseMiddlewares(), ...getDevOnlyMiddlewares())
);

const store = createStore(rootReducer, {}, enhancer);
const clusters = [
  {
    name: 'On-Premise Cluster 1',
    status: 'pending',
    createdDateTime: '2018-09-10T18:17:20.675Z',
    modifiedDateTime: '2015-90-10T18:17:20.675Z',
    mgt: [{}],
    svc: [{}],
    db: [{}],
    eng: [{}]
  }
];

storiesOf('Cluster', module)
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
    const props = {
      config: wizardConfig,
      onClose: noop,
      onSubmit: noop,
      headerProps: {
        backgroundColor: 'teal',
        color: '#FAFAFA',
        height: 70
      }
    };

    return (
      <BaseStory
        widget={ClusterWizardWidget}
        widgetProps={{ ...props, title: 'Cluster Wizard Widget' }}
        componentProps={{ ...props, title: 'Cluster Wizard Component' }}
      />
    );
  })
  .add('Cluster List', () => {
    return <ClusterList clusters={clusters} />;
  });
