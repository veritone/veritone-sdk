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
class FullDataStory extends React.Component {
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
              canShare={true}
              canEditAffiliates={true}
              program={{
                id: '12345',
                name: 'Test program',
                imageUri: '',
                liveImageUri: '',
                description: 'This is a test program data with description',
                website: 'www.veritone.com',
                format: 'live',
                language: 'en',
                isNational: true,
                acls: [],
                isPublic: true,
                affiliates: []
              }}
              programFormats={[{
                  id: 'live',
                  name: 'Live'
                }, {
                  id: 'recorded',
                  name: 'Recorded'
                }]}
              acls={[]}
              affiliates={[]}
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

@connect(
  state => ({
    form: state.form.programInfo
  }),
  { submit }
)
class NoProgramDataStory extends React.Component {
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
              canShare={true}
              canEditAffiliates={true}
              programFormats={[{
                id: 'live',
                name: 'Live'
              }, {
                id: 'recorded',
                name: 'Recorded'
              }]}
              acls={[]}
              affiliates={[]}
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

@connect(
  state => ({
    form: state.form.programInfo
  }),
  { submit }
)
class BaseStory extends React.Component {
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

storiesOf('Program Info', module).add('Full data', () => <FullDataStory store={store} />);
storiesOf('Program Info', module).add('No program data', () => <NoProgramDataStory store={store} />);
storiesOf('Program Info', module).add('Base', () => <BaseStory store={store} />);
