import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import BackButton from './';

storiesOf('BackButton', module)
  .add('Basic', () => <BackButton onClick={action('onBack')} />)
