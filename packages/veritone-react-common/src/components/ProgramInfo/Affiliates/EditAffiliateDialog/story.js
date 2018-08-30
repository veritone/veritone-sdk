import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider, connect } from 'react-redux';
import { reducer as formReducer, submit } from 'redux-form';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { action } from '@storybook/addon-actions';

import EditAffiliateDialog from './';

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
    form: state.form.affiliate
  }),
  { submit }
)
class FullDataStory extends React.Component {
  /* eslint-disable react/prop-types */
  state = { lastResult: {} };
  submit = () => {
    this.props.submit('affiliate');
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
            <EditAffiliateDialog
              affiliate={{
                id: 'stationId',
                name: 'Affiliate Station 1',
                schedule: {
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
                }
              }}
              onSave={this.handleSubmit}
              onClose={action('onClose')}
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

storiesOf('Edit Affiliate Dialog', module).add('Base', () => (
  <FullDataStory store={store} />
));
