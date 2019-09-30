import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import FolderTree from './FolderTree';

function StoryComponent() {
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

  const [selectedFolder, setSelectedFolder] = useState([]);


  return (<FolderTree folders={foldersData} contents={contentsData} />)
}

storiesOf('FolderTree', module).add('Folder Tree', () => {
  /* eslint-disable react/jsx-no-bind */
  const foldersData = {
    rootIds: [1],
    allId: [1, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    byId: {
      1: {
        id: 1,
        name: 'RootFolder',
        contentType: 'folder',
        childs: [2, 3, 4, 5, 6, 121, 122, 123],
        subfolders: [2, 3, 4, 5, 6],
        subcontents: [121, 122, 123]
      },
      2: {
        id: 2,
        name: 'Folder 2',
        contentType: 'folder',
        childs: [124],
        parentId: 1,
        subfolders: [],
        subcontents: [124]
      },
      3: {
        id: 3,
        name: 'Folder 3',
        contentType: 'folder',
        childs: [7, 8, 125],
        parentId: 1,
        subfolders: [7, 8],
        subcontents: [125]
      },
      4: {
        id: 4,
        name: 'Folder 4',
        contentType: 'folder',
        childs: [126],
        parentId: 1,
        subfolders: [],
        subcontents: [126]
      },
      5: {
        id: 5,
        name: 'Folder 5',
        contentType: 'folder',
        childs: [],
        parentId: 1,
        subfolders: [],
        subcontents: []
      },
      6: {
        id: 6,
        name: 'Folder 6',
        contentType: 'folder',
        childs: [127],
        parentId: 1,
        subfolders: [],
        subcontents: [127]
      },
      7: {
        id: 7,
        name: 'Folder 7',
        contentType: 'folder',
        childs: [9, 128],
        parentId: 3,
        subfolders: [9],
        subcontents: [128]
      },
      8: {
        id: 8,
        name: 'Folder 8',
        contentType: 'folder',
        childs: [129],
        parentId: 3,
        subfolders: [],
        subcontents: [129]
      },
      9: {
        id: 9,
        name: 'Folder 9',
        contentType: 'folder',
        childs: [10, 11],
        parentId: 7,
        subfolders: [10, 11],
        subcontents: []
      },
      10: {
        id: 10,
        name: 'Folder 10',
        contentType: 'folder',
        childs: [],
        parentId: 9,
        subfolders: [],
        subcontents: []
      },
      11: {
        id: 11,
        name: 'Folder 11',
        contentType: 'folder',
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
      127: {
        id: 127,
        parentId: 6,
        contentType: 'collection',
        name: 'Content 7',
      },
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
  return (
    <div style={{
      width: 500,
      height: 500
    }}>
      <FolderTree folders={foldersData} />
    </div>
  );
});
