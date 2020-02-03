import React from 'react';
import { storiesOf } from '@storybook/react';

import ModalSubtitle from './index';

storiesOf('ModalSubtitle', module).add('default', () => (
  <ModalSubtitle>Hello world</ModalSubtitle>
));
