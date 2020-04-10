/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { storiesOf } from '@storybook/react';
import BaseStory from '../../shared/BaseStory';
import { FolderTreeWidget } from './';

function StoryComponent() {
  const actionConfig = {
    new: 'action/newfolder',
    modify: 'action/modifyfolder',
    delete: 'action/delete',
    select: 'action/select',
    initWithSelect: 'action/initselect',
    unSelectCurrent: 'action/unSelectCurrent'
  };
  const folderActionDefault = [
    {
      id: 1,
      type: 'move',
      name: 'Move'
    },
    {
      id: 2,
      type: 'delete',
      name: 'Delete'
    },
    {
      id: 3,
      type: 'edit',
      name: 'Edit'
    }
  ]
  const subjectObservable = {}
  const props = {
    type: 'collection',
    actionConfig,
    isEnableShowContent: false,
    selectable: false,
    isEnableSearch: true,
    isEnableShowRootFolder: true,
    showingType: ['org'],
    isEnableSelectRoot: true,
    folderAction: folderActionDefault,
    subjectObservable: subjectObservable,
    onSelectMenuItem: (type, item) => console.log(type, item),
    handleSelectedFoler: (selectedFolder) => console.log(selectedFolder),
    initSuccess: (data) => console.log(data)
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <div style={{
        height: '100vh',
        width: '100%'
      }}>
        <BaseStory
          widget={FolderTreeWidget}
          widgetProps={{ ...props, title: 'AppBar Widget', workSpace: 'a' }}
        />
      </div>
    </div>

  )
}

storiesOf('FolderTree', module).add('Base', () => {
  return (
    <StoryComponent />
  );
});
