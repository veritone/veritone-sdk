import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AreaInterest from './';

storiesOf('AreaInterest', module)
    .add('Simple test', () => <AreaInterest />);

