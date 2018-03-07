import React from 'react';
import { bool, string } from 'prop-types';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import VeritoneApp from '../../shared/VeritoneApp';
import SchedulerWidget from './';

class Story extends React.Component {
  static propTypes = {
    userIsAuthenticated: bool,
    fetchUserFailed: bool,
    sessionToken: string
  };

  componentDidMount() {
    this._scheduler = new SchedulerWidget({
      elId: 'scheduler-widget'
    });
  }

  componentWillUnmount() {
    this._scheduler.destroy();
  }

  render() {
    return (
      <div>
        <span id="scheduler-widget" />
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('Scheduler', module).add('Base', () => {
  return <Story store={app._store} />;
});
