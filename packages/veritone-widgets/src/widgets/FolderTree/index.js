/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react';
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
import {
  DeleteFolder,
  ModifyFolder,
  CreateFolder
} from 'veritone-react-common';

function FolderTreeWrapper({
  type = 'watchlist',
  isEnableShowContent = false,
  isEnableSearch,
  isEnableShowRootFolder,
  subjectObservable,
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
  folderById,
  rootFolderIds
}) {

  const [openNew, setOpeningNew] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentFolderForAction, setCurrentFolderForAction] = useState({});

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

  const onSelectMenu = (item, action) => {
    setCurrentFolderForAction(item);
    if (action === 'edit') {
      setOpenModify(true);
    }
    if (action === 'delete') {
      setOpenDelete(true);
    }
  }

  const onChange = selectedfolder => {
    onSelectFolder(selectedfolder);
  };

  const onExpand = folderId => {
    expandFolder(folderId);
  };

  const onSearch = (data) => {
  };

  const handleSubmitNewFolder = (data) => {
  };

  const handleCloseNewFolder = () => {
    setOpeningNew(false);
  }

  const handleSubmitModify = (data1, data2) => {
  }

  const handleCloseModify = () => {
    setOpenModify(false);
  }

  const handleSubmitDeleteFolder = (data) => {
  };

  const handleCloseDeleteFolder = () => {
    setOpenDelete(false);
  }

  const getFolderSeleted = () => {
    const selectedFolderId = Object.keys(selectedFolder);
    console.log(selectedFolderId);
    const data = folderById(selectedFolderId[0]) || folderById(rootFolderIds[0]) || {};
    return data;
  }

  const processEvent = event => {
    setOpeningNew(true);
  }

  subjectObservable.subscribe({
    next: v => processEvent(v)
  })

  return (
    <div style={{
      width: '100%'
    }}>
      {isEnableSearch && (
        <SearchBox onSearch={onSearch} />
      )}
      {fetchingFolderStatus && <LoadingState />}
      {fetchedFolderStatus && foldersData.allId.length === 0 && (
        <FolderNullState
          message={errorStatus ? 'Something wrong' : 'No content in this org'}
        />
      )}
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
        onMenuClick={onSelectMenu}
        processingFolder={expandingFolderIds}
        isEnableShowRootFolder={isEnableShowRootFolder}
      />
      <DeleteFolder
        open={openDelete}
        folder={currentFolderForAction}
        handleClose={handleCloseDeleteFolder}
        handleSubmit={handleSubmitDeleteFolder}
      />
      <ModifyFolder
        open={openModify}
        handleClose={handleCloseModify}
        handleSubmit={handleSubmitModify}
        foldersData={foldersData}
        onExpand={onExpand}
        selected={selectedFolder}
        defaultOpening={rootFolderIds}
        currentFolder={currentFolderForAction}
      />
      <CreateFolder
        open={openNew}
        parentFolder={getFolderSeleted() || {}}
        handleClose={handleCloseNewFolder}
        handleSubmit={handleSubmitNewFolder}
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
  expandingFolderIds: arrayOf(string),
  subjectObservable: shape(Object),
  folderById: func,
  rootFolderIds: arrayOf(string)
}

const FolderTree = connect(
  state => ({
    foldersData: folderSelector.foldersDataSelector(state),
    fetchingFolderStatus: folderSelector.folderFetchingStatus(state),
    fetchedFolderStatus: folderSelector.folderFetchedStatus(state),
    errorStatus: folderSelector.folderErrorStatus(state),
    selectedFolder: folderSelector.selectedFolder(state),
    folderById: folderSelector.folderById(state),
    rootFolderIds: folderSelector.rootFolderIds(state),
    expandingFolderIds: folderSelector.expandingFolderIdsSelector(state)
  }),
  {
    expandFolder: folderModule.fetchMore,
    onSelectFolder: folderModule.selectFolder,
    onSelectAllFolder: folderModule.selectAllFolder,
    initFolder: folderModule.initFolder
  },
  null,
  { forwardRef: true }
)(FolderTreeWrapper);

const FolderTreeWidget = widget(FolderTree);
export { FolderTree as default, FolderTreeWidget, Folder };
