import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';


import SubAppbar from './';

storiesOf('SubAppbar', module).add('Button multi actions and crumbs', () => {
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

  const pathList = [
    { id: 'first', name: 'Parent' },
    { id: 'second', name: 'Child' },
    { id: 'third', name: 'GrandChild' },
    { id: 'fourth', name: 'Super GrandChild' },
    { id: 'fifth', name: 'Ultra GrandChild' }
  ]

  const onCrumbClick = (crumb) => {
      console.log('onCrumbClick',crumb); 
  }
  /* eslint-disable react/jsx-no-bind */
  return (
    <div>
      <SubAppbar actions={actionsDefaut} pathList={pathList} onCrumbClick={onCrumbClick} />
    </div>
  );
}).add('button one action and crumbs', () => {
  const actionsDefaut = [
    {
      id: 1,
      name: 'Action 1',
      icon: "icon-watchlist",
      actionClick: () => console.log('click action 1')
    }
  ]

  const pathList = [
    { id: 'first', name: 'Parent' },
    { id: 'second', name: 'Child' },
    { id: 'third', name: 'GrandChild' },
    { id: 'fourth', name: 'Super GrandChild' },
  ]

  const onCrumbClick = (crumb) => {
      console.log('onCrumbClick',crumb); 
  }
  /* eslint-disable react/jsx-no-bind */
  return (
    <div>
      <SubAppbar actions={actionsDefaut} pathList={pathList} onCrumbClick={onCrumbClick} loading={boolean('loading', false)}/>
    </div>
  );
});
