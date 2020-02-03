/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import Dialog from './index';

function StoryComponent() {
  const parentFolder = {
    id: 4,
    name: 'Folder 4',
    contentType: 'folder',
    hasContent: true,
    childs: [126],
    parentId: 1,
    subfolders: [],
    subcontents: [126]
  }

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = folderName => {
    console.log('submit', folderName)
  };

  const handleOpen = () => {
    setOpen(true);
  }

  return (
    <div>
      <Dialog
        open={open}
        parentFolder={parentFolder}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
      <button onClick={handleOpen}>
        open
    </button>
    </div>

  )
}

storiesOf('FolderTree', module)
  .add('new folder dialog', () => {
    return (
      <div style={{
        padding: 20,
        width: 500,
        height: '100vh'
      }}>
        <StoryComponent />
      </div>
    );
  });
