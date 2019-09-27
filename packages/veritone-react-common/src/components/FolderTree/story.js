import React from 'react';
import { storiesOf } from '@storybook/react';

import FolderItem from './FolderItem';
import RootFolderItem from './RootFolder';
import FolderTree from './FolderTree';

storiesOf('FolderTree', module).add('Folder Item', () => {
  /* eslint-disable react/jsx-no-bind */
  return (
    <div style={{
      width: 500,
      height: 500
    }}>
      <FolderItem opening hasContent folderName="Collection folder" />
    </div>
  );
}).add('Root Folder Item', () => {
  /* eslint-disable react/jsx-no-bind */
  return (
    <div style={{
      width: 500,
      height: 500
    }}>
      <RootFolderItem selecting={false} folderName="My Organization" />
    </div>
  );
}).add('Folder Tree', () => {
  /* eslint-disable react/jsx-no-bind */
  const foldersData = {
    rootIds: [1],
    allId: [1, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    byId: {
      1: {
        id: 1,
        name: 'RootFolder',
        subfolders: [2, 3, 4, 5, 6],
        subcontents: [1, 2, 3]
      },
      2: {
        id: 2,
        name: 'Folder 2',
        subfolders: [],
        subcontents: [4]
      },
      3: {
        id: 3,
        name: 'Folder 3',
        subfolders: [7, 8],
        subcontents: [5]
      },
      4: {
        id: 4,
        name: 'Folder 4',
        subfolders: [],
        subcontents: [6]
      },
      5: {
        id: 5,
        name: 'Folder 5',
        subfolders: [],
        subcontents: []
      },
      6: {
        id: 6,
        name: 'Folder 6',
        subfolders: [],
        subcontents: [7]
      },
      7: {
        id: 7,
        name: 'Folder 7',
        subfolders: [9],
        subcontents: [8]
      },
      8: {
        id: 8,
        name: 'Folder 8',
        subfolders: [],
        subcontents: [9]
      },
      9: {
        id: 9,
        name: 'Folder 9',
        subfolders: [10, 11],
        subcontents: []
      },
      10: {
        id: 10,
        name: 'Folder 10',
        subfolders: [],
        subcontents: []
      },
      11: {
        id: 11,
        name: 'Folder 11',
        subfolders: [],
        subcontents: []
      }
    }

  }

  const contentsData = {
    allId: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    byId: {
      1: {
        id: 121,
        name: 'Content 1',
      },
      2: {
        id: 122,
        name: 'Content 2',
      },
      3: {
        id: 123,
        name: 'Content 3',
      },
      4: {
        id: 124,
        name: 'Content 4',
      },
      5: {
        id: 125,
        name: 'Content 5',
      },
      6: {
        id: 126,
        name: 'Content 6',
      },
      7: {
        id: 127,
        name: 'Content 7',
      },
      8: {
        id: 128,
        name: 'Content 8',
      },
      9: {
        id: 129,
        name: 'Content 9',
      },
      10: {
        id: 1210,
        name: 'Content 10',
      }
    }
  }
  return (
    <div style={{
      width: 500,
      height: 500
    }}>
      <FolderTree folders={foldersData} contents={contentsData} />
    </div>
  );
});
