/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import {
  string,
  bool,
  arrayOf,
  shape,
  number,
  func
} from 'prop-types';
import { connect } from 'react-redux';
import {
  FolderTree as Folder,
  SearchBox
} from 'veritone-react-common';
import _ from 'lodash';
import * as folderModule from '../../redux/modules/folder';
import * as folderSelector from '../../redux/modules/folder/selector';
import widget from '../../shared/widget';
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

const foldersDataDefault = {
  rootIds: [],
  allId: [],
  byId: {}
}

function FolderTreeWrapper({
  type,
  state,
  initFolder,
  expandFolder,
  foldersData,
  onSelectFolder,
  onSelectMenuItem = _.noop,
  selectable = false,
  isEnableShowContent = false,
  folderAction = folderActionDefault,
  selectedFolder = {},
  fetchingFolderStatus,
  fetchedFolderStatus,
  errorStatus
}) {
  // const [selectedFolder, setSelectedFolder] = useState({});
  // const [foldersData, setFoldersData] = useState(foldersDataDefault);
  // const onMenuClick = (item, type) => {
  //   console.log(item, type);
  // }

  useEffect(() => {
    initFolder('cms', false);
  }, [])
  console.log(foldersData);
  const onChange = selectedfolder => {
    console.log(selectedfolder);
    // setSelectedFolder(selectedfolder);
  }
  const onExpand = folderId => {
    console.log(folderId);
    expandFolder(folderId);

    // if (_.includes(foldersData.rootIds, folderId)) {
    //   return;
    // }
    // const dataAfterCallAPI = {
    //   127: {
    //     id: 127,
    //     parentId: 6,
    //     contentType: 'collection',
    //     name: 'Content 7',
    //   },
    // }
    // setFoldersData(foldersData => ({
    //   ...foldersData,
    //   allId: [...foldersData.allId, ...Object.keys(dataAfterCallAPI)],
    //   byId: {
    //     ...foldersData.byId,
    //     ...dataAfterCallAPI
    //   }
    // }))
    // if (selectedFolder[folderId]) {
    //   const additionSelected = Object.keys(dataAfterCallAPI).reduce((accum, currentData) => {
    //     return {
    //       ...accum,
    //       [currentData]: true
    //     };
    //   }, {})
    //   setSelectedFolder({ ...selectedFolder, ...additionSelected })
    // }
  }
  return (
    <div style={{
      width: 260,
      height: '100%'
    }}>
      <SearchBox />
      <Folder
        selectable={selectable}
        loading={fetchingFolderStatus}
        errorStatus={errorStatus}
        loaded={fetchedFolderStatus}
        selected={selectedFolder}
        foldersData={foldersData}
        onChange={onChange}
        onExpand={onExpand}
        isEnableShowContent={isEnableShowContent}
        folderAction={folderAction}
        onMenuClick={onSelectMenuItem}
      />
    </div>
  )
}

FolderTreeWrapper.propTypes = {
  state: shape(Object),
  type: string,
  onSelectFolder: func,
  onSelectMenuItem: func,
  selectable: bool,
  isEnableShowContent: bool,
  folderAction: arrayOf(shape({
    id: number,
    type: string,
    name: string
  })),
  foldersData: shape(Object),
  selectedFolder: shape(Object),
  initFolder: func,
  expandFolder: func,
  fetchingFolderStatus: bool,
  fetchedFolderStatus: bool,
  errorStatus: bool
}

const FolderTree = connect(
  state => ({
    foldersData: folderSelector.foldersDataSelector(state),
    fetchingFolderStatus: folderSelector.folderFetchingStatus(state),
    fetchedFolderStatus: folderSelector.folderFetchedStatus(state),
    errorStatus: folderSelector.folderErrorStatus(state)
  }),
  {
    initFolder: folderModule.initFolder,
    expandFolder: folderModule.expandFolder
  },
  null,
  { withRef: true }
)(FolderTreeWrapper);

const FolderTreeWidget = widget(FolderTree);
export { FolderTree as default, FolderTreeWidget, Folder };
