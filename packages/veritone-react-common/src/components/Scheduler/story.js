import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Scheduler from './';

function updateSchedule(sched) {
  console.log(sched);
  schedule = sched;
}

var schedule = {};

storiesOf('Scheduler', module)
  .add('Empty Scheduler', () => <Scheduler schedule={schedule} updateSchedule={updateSchedule}/>);
