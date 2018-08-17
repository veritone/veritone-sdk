import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import VeritoneApp from '../../shared/VeritoneApp';
import { SchedulerWidget } from '.';

class Story extends React.Component {
  state = {
    lastResult: {}
  };

  handleSubmit = vals => {
    this.setState({
      lastResult: vals
    });
  };

  render() {
    return (
      <div>
        <div>
          Last result:
          <pre>{JSON.stringify(this.state.lastResult, null, '\t')}</pre>
        </div>

        <BaseStory
          widget={SchedulerWidget}
          widgetProps={{
            initialValues: {
              scheduleType: 'Recurring',
              repeatEvery: {
                number: '2',
                period: 'day'
              }
            }
          }}
          widgetInstanceMethods={{
            submit: instance =>
              instance.submit(vals => {
                this.handleSubmit(vals);
              })
          }}
        />
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('Scheduler', module).add('Base', () => {
  return <Story store={app._store} />;
});
