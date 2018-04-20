import React from 'react';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../shared/VeritoneApp';
import SchedulerWidget from '.';

class Story extends React.Component {
  componentDidMount() {
    this._scheduler = new SchedulerWidget({
      elId: 'scheduler-widget'
      // initialValues: {
      //   scheduleType: 'recurring',
      //   start: new Date(),
      //   end: new Date(),
      //   maxSegment: {
      //     number: '5',
      //     period: 'week'
      //   },
      //   repeatEvery: {
      //     number: '1',
      //     period: 'day'
      //   }
      // }
    });
  }

  componentWillUnmount() {
    this._scheduler.destroy();
  }

  submitForm = () => {
    this._scheduler.submit(vals => {
      console.log('Form Submitted:');
      console.log('Raw form values:', vals);
      console.log(
        'Prepared form values:',
        this._scheduler.prepareResultData(vals)
      );
    });
  };

  render() {
    return (
      <div>
        <span id="scheduler-widget" />
        <button type="button" onClick={this.submitForm}>
          Submit
        </button>
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('Scheduler', module).add('Base', () => {
  return <Story store={app._store} />;
});
