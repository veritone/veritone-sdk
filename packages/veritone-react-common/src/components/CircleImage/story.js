import React from 'react';
import { storiesOf } from '@storybook/react';

import CircleImage from './';

storiesOf('CircleImage', module)
  .add('Base', () => (
    <CircleImage height={'100px'} width={'100px'} image={'https://image.flaticon.com/icons/svg/25/25305.svg'} />
  ))