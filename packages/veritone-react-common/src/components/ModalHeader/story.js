import React from 'react';
import { storiesOf } from '@storybook/react';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import ModalHeader from './';

storiesOf('ModalHeader', module).add('Base', () => (
  <ModalHeader
    title={'Fullscreen'}
    closeButton
    icons={[
      <IconButton aria-label="help" key={1} color="inherit">
        <Icon className={'icon-help2'} />
      </IconButton>,
      <IconButton aria-label="menu" key={2} color="inherit">
        <Icon className={'icon-more_vert'} />
      </IconButton>,
      <IconButton aria-label="trash" key={3} color="inherit">
        <Icon className={'icon-trash'} />
      </IconButton>
    ]}
  />
));
