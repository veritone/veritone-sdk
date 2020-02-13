import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './';

storiesOf('Popper Button', module).add('button multi actions', () => {
  const actionsDefaut = [
    {
      id: 2,
      name: 'Folder',
      icon: "icon-folder-closed",
      actionClick: () => console.log('click action 2')
    },
    {
      id: 1,
      name: 'Collection',
      icon: "icon-watchlist",
      actionClick: () => console.log('click action 1')
    },
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
}).add('button one actions', () => {
  const actionsDefaut = [
    {
      id: 1,
      name: 'Action 1',
      icon: "icon-watchlist",
      actionClick: () => console.log('click action 1')
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