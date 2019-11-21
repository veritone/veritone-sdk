/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Subject } from 'rxjs';
import BaseStory from '../../shared/BaseStory';
import { FolderTreeWidget } from './';
import { Button } from '@material-ui/core';

function StoryComponent() {
  const [selected] = React.useState({});
  const actionConfig = {
    new: 'action/newfolder',
    modify: 'action/modifyfolder',
    delete: 'action/delete',
    select: 'action/select'
  }
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
  const subjectObservable = new Subject();
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
    folderSelectedFromApp: selected,
    subjectObservable: subjectObservable,
    onSelectMenuItem: (type, item) => console.log(type, item),
    handleSelectedFoler: (selectedFolder) => console.log(selectedFolder),
  };

  const onClickButton = () => {
    console.log('onClicknew');
    subjectObservable.next(actionConfig.new);
  }
  const onSelectPathList = () => {
    subjectObservable.next(`${actionConfig.select} 96b52061-cd01-435a-a7dc-c1d44bfd3e24`);
  }
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <div style={{
        height: '100vh'
      }}>
        <Button onClick={onClickButton}>New</Button>
        <Button onClick={onSelectPathList}>Pathlist</Button>
        <BaseStory
          widget={FolderTreeWidget}
          widgetProps={{ ...props, title: 'AppBar Widget', workSpace: 'a'}}
        />
      </div>
      <div style={{
        height: '100vh'
      }}>
        <BaseStory
          widget={FolderTreeWidget}
          widgetProps={{ ...props, title: 'AppBar Widget',  workSpace: 'b' }}
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
