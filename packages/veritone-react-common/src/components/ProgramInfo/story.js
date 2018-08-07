import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider, connect } from 'react-redux';
import { reducer as formReducer, submit } from 'redux-form';
import { combineReducers, createStore } from 'redux';

import { createLogger } from 'redux-logger';
import { applyMiddleware, compose } from 'redux';

import ProgramInfo from './';

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
    form: state.form.programInfo
  }),
  { submit }
)
class Story extends React.Component {
  /* eslint-disable react/prop-types */
  state = { lastResult: {} };
  submit = () => {
    this.props.submit('programInfo');
  };

  handleSubmit = values => {
    this.setState({
      lastResult: values
    });
  };

  render() {
    return (
      <div>
        <Provider store={store}>
          <div>
            <ProgramInfo
              initialValues={{
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

storiesOf('Program Info', module).add('Base', () => <Story store={store} />);
