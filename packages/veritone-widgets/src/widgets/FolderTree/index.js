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
import { get } from 'lodash';
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
  CreateFolder,
  EditFolder
} from 'veritone-react-common';
import styles from './styles.scss';

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
  processingFolder,
  folderById,
  rootFolderIds,
  createFolder,
  deleteFolder,
  editFolder
}) {

  const [openNew, setOpeningNew] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
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
    switch (action) {
      case 'edit':
        setOpenEdit(true);
        break;
      case 'delete':
        setOpenDelete(true);
        break;
      case 'move': 
        setOpenModify(true);
        break;
      default:
        break;
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
  
  //new folder
  const handleSubmitNewFolder = (data) => {
    const parentFolder = getFolderSeleted();
    const parentFolderId = get(parentFolder, 'id');
    const folderName = data;
    createFolder(folderName, parentFolderId);
    handleCloseNewFolder();
  };

  const handleCloseNewFolder = () => {
    setOpeningNew(false);
  }

  //modify folder
  const handleSubmitModify = (selectedFolder, folderName) => {
    const currentFolderId = currentFolderForAction.id;
    const newParentId = Object.keys(selectedFolder)[0];
    editFolder(currentFolderId, folderName, newParentId);
    handleCloseModify();
  }

  const handleCloseModify = () => {
    setOpenModify(false);
  }
  //edit folder
  const handleCloseEditFolder = () => {
    setOpenEdit(false);
  }

  const handleSubmitEditFolder = (folderName, currentEditFolder) => {
    if (folderName === currentEditFolder.name) {
      setOpenEdit(false);
      return;
    }
    editFolder(currentEditFolder.id, folderName);
    setOpenEdit(false);
  }

  //delete folder
  const handleSubmitDeleteFolder = (data) => {
    deleteFolder(data.id);
    handleCloseDeleteFolder();
  };

  const handleCloseDeleteFolder = () => {
    setOpenDelete(false);
  }

  const getFolderSeleted = () => {
    const selectedFolderId = Object.keys(selectedFolder);
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
    <div className={styles['container']}>
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
        processingFolder={processingFolder}
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
      <EditFolder
        open={openEdit}
        currentFolder={currentFolderForAction}
        handleClose={handleCloseEditFolder}
        handleSubmit={handleSubmitEditFolder}
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
  processingFolder: arrayOf(string),
  subjectObservable: shape(Object),
  folderById: func,
  rootFolderIds: arrayOf(string),
  createFolder: func,
  deleteFolder: func,
  editFolder: func
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
    processingFolder: folderSelector.processingFolderSelector(state)
  }),
  {
    expandFolder: folderModule.fetchMore,
    onSelectFolder: folderModule.selectFolder,
    onSelectAllFolder: folderModule.selectAllFolder,
    initFolder: folderModule.initFolder,
    createFolder: folderModule.createFolder,
    deleteFolder: folderModule.deleteFolder,
    editFolder: folderModule.modifyFolder
  },
  null,
  { forwardRef: true }
)(FolderTreeWrapper);

const FolderTreeWidget = widget(FolderTree);
export { FolderTree as default, FolderTreeWidget, Folder };
