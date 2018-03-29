import React from 'react';
import { storiesOf } from '@storybook/react';

import OAuthLoginButton from './';

storiesOf('OAuthLoginButton', module)
  .add('With text', () => {
    return <OAuthLoginButton />;
  })
  .add('Logo icon only', () => {
    return <OAuthLoginButton iconOnly />;
  });
