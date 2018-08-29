import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import BaseStory from '../../shared/BaseStory';
import UserProfile from './';

storiesOf('UserProfile', module).add('Base', () => (
  <BaseStory
    componentClass={UserProfile}
    componentProps={{
      firstName: 'brian',
      lastName: 'gilkey',
      email: 'bgilkey@veritone.com',
      passwordUpdatedDateTime: '2017-04-07T22:10:30.230Z',
      open: boolean('open', true)
    }}
  />
));
