import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Scheduler from './';

storiesOf('Scheduler', module)
  .add('Empty Scheduler', () => <Scheduler/>);
