import React from 'react';
import { storiesOf } from '@storybook/react';

import ModalSubtitle from '.'
import { boolean, object } from '@storybook/addon-knobs';

storiesOf('ModalSubtitle', module).add('default', () => {
  return (
    <ModalSubtitle>
      Hello world
    </ModalSubtitle>
  );
})
