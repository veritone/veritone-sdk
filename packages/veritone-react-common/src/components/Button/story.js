import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Add from "@material-ui/icons/AddCircle";


import Button from './';

storiesOf('Popper Button', module).add('button multi actions', () => {
  const actionsDefaut = [
    {
      id: 1,
      name: 'Action 1',
      icon: Add,
      actionClick: () => console.log('click action 1')
    },
    {
      id: 2,
      name: 'Action 2',
      icon: Add,
      actionClick: () => console.log('click action 2')
    }
  ]
  /* eslint-disable react/jsx-no-bind */
  return (
    <div style={{
      width: 500,
      height: 500
    }}>
      <Button actions={actionsDefaut} />
    </div>
  );
});
