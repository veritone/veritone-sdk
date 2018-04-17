import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider, connect } from 'react-redux';
import { reducer as formReducer, submit } from 'redux-form';
import { combineReducers, createStore } from 'redux';

import { createLogger } from 'redux-logger';
import { applyMiddleware, compose } from 'redux';

import Scheduler from './';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({
    form: formReducer
  }),
  composeEnhancers(
    applyMiddleware(
      createLogger({
        collapsed: true
      })
    )
  )
);

@connect(
  state => ({
    form: state.form.scheduler
  }),
  { submit }
)
class DisplayState extends React.Component {
  /* eslint-disable react/prop-types */
  /* eslint-disable react/jsx-no-bind */
  submit = () => {
    this.props.submit('scheduler');
  };

  render() {
    return (
      <div>
        <button type="button" onClick={this.submit}>
          Submit
        </button>
        <div style={{ display: 'flex' }}>
          <div>
            <h3>Raw form values:</h3>
            <pre>{JSON.stringify(this.props.form.values, null, '\t')}</pre>
          </div>
          <div>
            <h3>relevant values only (via Scheduler.prepareResultData):</h3>
            <pre>
              {JSON.stringify(
                Scheduler.prepareResultData(this.props.form.values),
                null,
                '\t'
              )}
            </pre>
          </div>
        </div>
      </div>
    );
  }
}

storiesOf('Scheduler', module).add('Base', () => (
  <Provider store={store}>
    <div>
      <Scheduler
        initialValues={{
          scheduleType: 'Recurring'
        }}
        onSubmit={result => console.log(result)}
      />
      <DisplayState />
    </div>
  </Provider>
));
