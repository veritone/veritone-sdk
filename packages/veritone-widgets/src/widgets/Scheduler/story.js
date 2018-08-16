import React from 'react';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../shared/VeritoneApp';
import { SchedulerWidget } from '.';

class Story extends React.Component {
  state = { lastResult: {} };

  componentDidMount() {
    this._scheduler = new SchedulerWidget({
      elId: 'scheduler-widget',
      initialValues: {
        scheduleType: 'Recurring',
        repeatEvery: {
          number: '2',
          period: 'day'
        }
      }
    });
  }

  componentWillUnmount() {
    this._scheduler.destroy();
  }

  handleSubmit = vals => {
    this.setState({
      lastResult: vals
    });
  };

  submitForm = () => {
    this._scheduler.submit(vals => {
      this.handleSubmit(vals);
      console.log('Form Submitted:', vals);
    });
  };

  render() {
    return (
      <div>
        <span id="scheduler-widget"/>
        <button type="button" onClick={this.submitForm}>
          Submit
        </button>
        <div>
          Last result:
          <pre>{JSON.stringify(this.state.lastResult, null, '\t')}</pre>
        </div>
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('Scheduler', module).add('Base', () => {
  return <Story store={app._store}/>;
});
