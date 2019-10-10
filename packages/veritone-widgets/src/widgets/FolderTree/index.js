/* eslint-disable react/jsx-no-bind */
import React, { useEffect } from 'react';
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
  SearchBox,
  FolderNullState,
  LoadingState
} from 'veritone-react-common';
import * as folderModule from '../../redux/modules/folder';
import * as folderSelector from '../../redux/modules/folder/selector';
import widget from '../../shared/widget';

function FolderTreeWrapper({
  type = 'watchlist',
  isEnableShowContent = false,
  isEnableSearch,
  isEnableShowRootFolder,
  selectable = true,
  onSelectMenuItem,
  folderAction,
  handleSelectedFoler,
  initFolder,
  expandFolder,
  foldersData,
  onSelectFolder,
  selectedFolder = {},
  fetchingFolderStatus,
  fetchedFolderStatus,
  errorStatus,
  expandingFolderIds,
}) {
  useEffect(() => {
    const config = {
      type,
      isEnableShowContent,
      selectable
    }
    initFolder(config);
  }, []);

  useEffect(() => {
    handleSelectedFoler(selectedFolder);
  }, [selectedFolder]);

  const onChange = selectedfolder => {
    onSelectFolder(selectedfolder);
  }
  const onExpand = folderId => {
    expandFolder(folderId);
  }

  if (fetchingFolderStatus) {
    return (
      <div>
        <SearchBox />
        <LoadingState />
      </div>
    );
  }

  if (fetchedFolderStatus && foldersData.allId.length === 0) {
    return (
      <div>
        <SearchBox />
        <FolderNullState
          message={errorStatus ? 'Something wrong' : 'No content in this org'}
        />
      </div>
    )
  }

  return (
    <div>
      <SearchBox />
      <Folder
        selectable={selectable}
        errorStatus={errorStatus}
        loaded={fetchedFolderStatus}
        selected={selectedFolder}
        foldersData={foldersData}
        onChange={onChange}
        onExpand={onExpand}
        isEnableShowContent={isEnableShowContent}
        folderAction={folderAction}
        onMenuClick={onSelectMenuItem}
        processingFolder={expandingFolderIds}
        isEnableShowRootFolder={isEnableShowRootFolder}
      />
    </div>
  )
}

FolderTreeWrapper.propTypes = {
  type: string,
  onSelectFolder: func,
  onSelectMenuItem: func,
  selectable: bool,
  isEnableShowContent: bool,
  isEnableSearch: bool,
  isEnableShowRootFolder: bool,
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
  errorStatus: bool,
  handleSelectedFoler: func,
  expandingFolderIds: arrayOf(string)
}

const FolderTree = connect(
  state => ({
    foldersData: folderSelector.foldersDataSelector(state),
    fetchingFolderStatus: folderSelector.folderFetchingStatus(state),
    fetchedFolderStatus: folderSelector.folderFetchedStatus(state),
    errorStatus: folderSelector.folderErrorStatus(state),
    selectedFolder: folderSelector.selectedFolder(state),
    expandingFolderIds: folderSelector.expandingFolderIdsSelector(state)
  }),
  {
    expandFolder: folderModule.fetchMore,
    onSelectFolder: folderModule.selectFolder,
    onSelectAllFolder: folderModule.selectAllFolder,
    initFolder: folderModule.initFolder
  },
  null,
  { withRef: true }
)(FolderTreeWrapper);

const FolderTreeWidget = widget(FolderTree);
export { FolderTree as default, FolderTreeWidget, Folder };
