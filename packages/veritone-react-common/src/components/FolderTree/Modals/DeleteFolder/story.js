/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import Dialog from './index';

function StoryComponent({
  currentFolder
}) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = folderName => {
    console.log('submit', folderName)
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const onExpand = item => {
    console.log('onExpand', item);
  };

  return (
    <div>
      <Dialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        onExpand={onExpand}
        folder={currentFolder}
      />
      <button onClick={handleOpen}>
        open
    </button>
    </div>

  )
}

storiesOf('FolderTree', module)
  .add('delete folder dialog', () => {
    const currentFolder = {
      id: 7,
      name: 'Folder 7',
      contentType: 'folder',
      hasContent: true,
      childs: [9, 128],
      parentId: 3,
      subfolders: [9],
      subcontents: [128]
    }
    return (
      <div style={{
        padding: 20,
        width: 500,
        height: '100vh'
      }}>
        <StoryComponent currentFolder={currentFolder} />
      </div>
    );
  })
  .add('delete folder no content dialog', () => {
    const currentFolder = {
      id: 7,
      name: 'Folder 7',
      contentType: 'folder',
      hasContent: false,
      childs: [9, 128],
      parentId: 3,
      subfolders: [9],
      subcontents: [128]
    }
    return (
      <div style={{
        padding: 20,
        width: 500,
        height: '100vh'
      }}>
        <StoryComponent currentFolder={currentFolder} />
      </div>
    );
  });
