import React from 'react';
import { storiesOf } from '@storybook/react';

import ModalSubtitle from '.'

storiesOf('ModalSubtitle', module).add('default', () => {
  return (
    <ModalSubtitle>
      Hello world
    </ModalSubtitle>
  );
})
