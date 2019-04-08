import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import BaseStory from '../../shared/BaseStory';
import UserProfile, { UserProfileWidget } from './';

storiesOf('UserProfile', module).add('Base', () => {
  const sharedProps = {
    passwordUpdatedDateTime: '2017-04-07T22:10:30.230Z', // fixme
    open: boolean('open', false)
  };

  return (
    <BaseStory
      widget={UserProfileWidget}
      widgetProps={sharedProps}
      widgetInstanceMethods={{
        open: instance => instance.open()
      }}
      componentClass={UserProfile}
      componentProps={sharedProps}
    />
  );
});
