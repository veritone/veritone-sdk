/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import Dialog from './index';

function StoryComponent() {

  const foldersDataDefault = {
    rootIds: [1],
    allId: [1, 11, '121aasd', 3, 4, 5, 6, 7, 8, 9, 10],
    byId: {
      1: {
        id: 1,
        name: 'RootFolder',
        contentType: 'folder',
        hasContent: true,
        childs: ['121aasd', 3, 4, 5, 6, 121, 122, 123],
        subfolders: ['121aasd', 3, 4, 5, 6],
        subcontents: [121, 122, 123]
      },
      '121aasd': {
        id: '121aasd',
        name: 'Folder 2',
        contentType: 'folder',
        hasContent: true,
        childs: [],
        parentId: 1
      },
      3: {
        id: 3,
        name: 'Folder 3',
        contentType: 'folder',
        hasContent: true,
        childs: [7, 8, 125],
        parentId: 1,
        subfolders: [7, 8],
        subcontents: [125]
      },
      4: {
        id: 4,
        name: 'Folder 4',
        contentType: 'folder',
        hasContent: true,
        childs: [126],
        parentId: 1,
        subfolders: [],
        subcontents: [126]
      },
      5: {
        id: 5,
        name: 'Folder 5',
        contentType: 'folder',
        hasContent: false,
        childs: [],
        parentId: 1,
        subfolders: [],
        subcontents: []
      },
      6: {
        id: 6,
        name: 'Folder 6',
        contentType: 'folder',
        hasContent: true,
        childs: [127],
        parentId: 1,
        subfolders: [],
        subcontents: [127]
      },
      7: {
        id: 7,
        name: 'Folder 7',
        contentType: 'folder',
        hasContent: true,
        childs: [9, 128],
        parentId: 3,
        subfolders: [9],
        subcontents: [128]
      },
      8: {
        id: 8,
        name: 'Folder 8',
        contentType: 'folder',
        hasContent: true,
        childs: [129],
        parentId: 3,
        subfolders: [],
        subcontents: [129]
      },
      9: {
        id: 9,
        name: 'Folder 9',
        contentType: 'folder',
        hasContent: true,
        childs: [10, 11],
        parentId: 7,
        subfolders: [10, 11],
        subcontents: []
      },
      10: {
        id: 10,
        name: 'Folder 10',
        contentType: 'folder',
        hasContent: false,
        childs: [],
        parentId: 9,
        subfolders: [],
        subcontents: []
      },
      11: {
        id: 11,
        name: 'Folder 11',
        contentType: 'folder',
        hasContent: false,
        childs: [],
        parentId: 9,
        subfolders: [],
        subcontents: []
      },
      121: {
        id: 121,
        parentId: 1,
        contentType: 'collection',
        name: 'Content 1',
      },
      122: {
        id: 122,
        parentId: 1,
        contentType: 'collection',
        name: 'Content 2',
      },
      123: {
        id: 123,
        parentId: 1,
        contentType: 'collection',
        name: 'Content 3',
      },
      124: {
        id: 124,
        parentId: 2,
        contentType: 'collection',
        name: 'Content 4',
      },
      125: {
        id: 125,
        parentId: 3,
        contentType: 'collection',
        name: 'Content 5',
      },
      126: {
        id: 126,
        parentId: 4,
        contentType: 'collection',
        name: 'Content 6',
      },
      // 127: {
      //   id: 127,
      //   parentId: 6,
      //   contentType: 'collection',
      //   name: 'Content 7',
      // },
      128: {
        id: 128,
        parentId: 7,
        contentType: 'collection',
        name: 'Content 8',
      },
      129: {
        id: 129,
        parentId: 8,
        contentType: 'collection',
        name: 'Content 9',
      },
      1210: {
        id: 1210,
        contentType: 'collection',
        name: 'Content 10',
      }
    }
  }

  const selected = {
    3: true
  }

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
        type={2}
        isEnableEditFolder
        isEnableEditName
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        foldersData={foldersDataDefault}
        onExpand={onExpand}
        selected={selected}
        defaultOpening={[1]}
        currentFolder={currentFolder}
        processingFolder={[]}
      />
      <button onClick={handleOpen}>
        open
    </button>
    </div>

  )
}

storiesOf('FolderTree', module)
  .add('modify folder dialog', () => {
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
