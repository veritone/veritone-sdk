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
class Story extends React.Component {
  /* eslint-disable react/prop-types */
  state = { lastResult: {} };
  submit = () => {
    this.props.submit('scheduler');
  };

  handleSubmit = vals => {
    this.setState({
      lastResult: vals
    });
  };

  render() {
    return (
      <div>
        <Provider store={store}>
          <div>
            <Scheduler
              initialValues={{
                scheduleType: 'Recurring',
                start: '2018-04-14T19:48:25.147Z',
                end: '2018-04-17T19:48:25.147Z',
                repeatEvery: {
                  number: '1',
                  period: 'day'
                },
                weekly: {
                  Thursday: [
                    {
                      start: '12:33',
                      end: '03:21'
                    }
                  ]
                }
              }}
              onSubmit={this.handleSubmit}
            />
            <button type="button" onClick={this.submit}>
              Submit
            </button>
            <div>
              Last result:
              <pre>{JSON.stringify(this.state.lastResult, null, '\t')}</pre>
            </div>
          </div>
        </Provider>
      </div>
    );
  }
}

storiesOf('Scheduler', module).add('Base', () => <Story store={store} />);
