import React from 'react';
import { storiesOf } from '@storybook/react';

import Scheduler from './';

function updateSchedule(sched) {
  console.log(sched);
  schedule = sched;
}

let schedule = {};

storiesOf('Scheduler', module).add('Empty Scheduler', () => (
  <Scheduler schedule={schedule} updateSchedule={updateSchedule} />
));
