import React from 'react';
import {Scheduler as LibScheduler } from 'veritone-react-common';
import widget from '../../shared/widget';

import { object } from 'prop-types';

import { Provider, connect } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { combineReducers, createStore } from 'redux';

import { createLogger } from 'redux-logger';
import { applyMiddleware, compose } from 'redux';

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

@connect(state => ({
  form: state.form && state.form.schedule
}),
null,
null,
{ withRef: true })
class Scheduler extends React.Component {
  static propTypes = {
    initialValues: object
  };

  render() {
    console.log("Widget props", this.props);
    return (
    <Provider store={store}>
      <div>
      <LibScheduler
      form="scheduler"
      initialValues={ this.props.initialValues }/>
      </div>
    </Provider>)
  }
}

export default widget(Scheduler);
