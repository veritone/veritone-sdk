/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Subject } from 'rxjs';
import BaseStory from '../../shared/BaseStory';
import { FolderTreeWidget } from './';
import { Button } from '@material-ui/core';

function StoryComponent() {
  const actionConfig = {
    new: 'action/newfolder',
    modify: 'action/modifyfolder',
    delete: 'action/delete'
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
    type: 'cms',
    actionConfig,
    isEnableShowContent: false,
    selectable: false,
    enableSearchbox: false,
    isEnableShowRootFolder: true,
    folderAction: folderActionDefault,
    subjectObservable: subjectObservable,
    onSelectMenuItem: (type, item) => console.log(type, item),
    handleSelectedFoler: (selectedFolder) => console.log(selectedFolder),
  };


  const onClickButton = () => {
    console.log('onClicknew');
    subjectObservable.next(actionConfig.new);
  }
  return (
    <div style={{
      height: '100vh'
    }}>
      <Button onClick={onClickButton}>New</Button>
      <BaseStory
        widget={FolderTreeWidget}
        widgetProps={{ ...props, title: 'AppBar Widget' }}
      />
    </div>
  )
}

storiesOf('FolderTree', module).add('Base', () => {
  return (
    <StoryComponent />
  );
});
