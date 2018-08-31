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

const generateAcls = function(n, permission) {
  const acls = [];
  for (let i = 1; i <= n; i++) {
    acls.push({
      organizationId: 'orgId' + i,
      permission: permission
    });
  }
  return acls;
};

const generateOrganizations = function(n) {
  const organizations = [];
  for (let i = 1; i <= n; i++) {
    organizations.push({
      id: 'orgId' + i,
      name: 'Organization ' + i
    });
  }
  return organizations;
};

const generateAffiliates = function(n, setSchedule) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    const affiliate = {
      id: String(i),
      name: 'Affiliate Station ' + i
    };
    if (setSchedule) {
      affiliate.schedule = {
        scheduleType: 'Recurring',
        start: '2018-04-14T19:48:25.147Z',
        end: '2018-04-17T19:48:25.147Z',
        repeatEvery: {
          number: '1',
          period: 'week'
        },
        weekly: {
          Wednesday: [
            {
              start: '16:33',
              end: '17:21'
            }
          ],
          Thursday: [
            {
              start: '12:33',
              end: '03:21'
            },
            {
              start: '01:00',
              end: '01:00'
            }
          ],
          selectedDays: {
            Wednesday: true,
            Thursday: true
          }
        }
      };
    }
    result.push(affiliate);
  }
  return result;
};

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
              canShare
              canEditAffiliates
              canBulkAddAffiliates
              program={{
                id: '12345',
                name: 'Test program',
                programImage: '',
                programLiveImage: '',
                description: 'This is a test program data with description',
                website: 'www.veritone.com',
                format: 'live',
                language: 'en',
                isNational: true,
                acls: generateAcls(11, 'viewer'),
                isPublic: false,
                affiliates: generateAffiliates(11, true)
              }}
              programFormats={['live', 'recorded']}
              organizations={generateOrganizations(21)}
              affiliates={generateAffiliates(21)}
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
class FullDataReadOnlyStory extends React.Component {
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
              readOnly
              canShare
              canEditAffiliates
              canBulkAddAffiliates
              program={{
                id: '12345',
                name: 'Test program',
                programImage: '',
                programLiveImage: '',
                description: 'This is a test program data with description',
                website: 'www.veritone.com',
                format: 'live',
                language: 'en',
                isNational: true,
                acls: generateAcls(11, 'viewer'),
                isPublic: false,
                affiliates: generateAffiliates(11, true)
              }}
              programFormats={['live', 'recorded']}
              organizations={generateOrganizations(21)}
              affiliates={generateAffiliates(21)}
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
              canShare
              canEditAffiliates
              canBulkAddAffiliates
              programFormats={['live', 'recorded']}
              organizations={generateOrganizations(21)}
              affiliates={generateAffiliates(51)}
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
            <ProgramInfo onSubmit={this.handleSubmit} />
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

storiesOf('Program Info', module).add('Full data', () => (
  <FullDataStory store={store} />
));
storiesOf('Program Info', module).add('Full data readOnly', () => (
  <FullDataReadOnlyStory store={store} />
));
storiesOf('Program Info', module).add('No program data', () => (
  <NoProgramDataStory store={store} />
));
storiesOf('Program Info', module).add('Base', () => (
  <BaseStory store={store} />
));
