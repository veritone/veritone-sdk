/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react';
import { string, bool, arrayOf, shape, number, func } from 'prop-types';
import { connect } from 'react-redux';
import {
  FolderTree as Folder,
  SearchBox,
  FolderNullState,
  LoadingState
} from 'veritone-react-common';
import { DeleteFolder, CreateFolder, EditFolder } from 'veritone-react-common';
import { isEmpty, isNil, flattenDeep, get } from 'lodash';
import * as folderModule from '../../redux/modules/folder';
import * as folderSelector from '../../redux/modules/folder/selector';
import widget from '../../shared/widget';

export const getAllParentId = (item, folderDataFlatten) => {
  if (isEmpty(item) || isNil(item)) {
    return [];
  } else {
    if (isNil(item.parentId)) {
      return [
        {
          id: item.id,
          name: item.name
        }
      ];
    } else {
      return [
        {
          id: item.id,
          name: item.name
        },
        ...getAllParentId(
          folderDataFlatten.byId[item.parentId],
          folderDataFlatten
        )
      ];
    }
  }
};

function FolderTreeWrapper({
  type = 'watchlist',
  workSpace = 'folderTree',
  isEnableShowContent = false,
  isEnableSearch,
  isEnableSelectRoot,
  isEnableShowRootFolder,
  subjectObservable,
  selectable = true,
  showingType = ['org'],
  onSelectMenuItem,
  folderAction,
  handleSelectedFoler,
  initFolder,
  expandFolder,
  foldersData,
  onSelectFolder,
  initSuccess,
  onSelectAllFolder,
  initialStatus,
  selectedFolders = {},
  fetchingFolderStatus,
  fetchedFolderStatus,
  errorStatus,
  processingFolder,
  folderById,
  rootFolderIds,
  createFolder,
  deleteFolder,
  editFolder,
  searchFolder,
  initFolderFromApp,
  unSelectFolder,
  unSelectAllFolder,
  unSelectCurrentFolder
}) {
  const [openNew, setOpenNew] = useState(false);
  const [selectedFolder, setSelected] = useState({});
  const [openModify, setOpenModify] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [fromNewButton, setStatus] = useState(false);
  const [modifyFromAction, setModifyFromAction] = useState(false);
  const [currentFolderForAction, setCurrentFolderForAction] = useState({});
  const [selectedInModify, setSelectedInModify] = useState({});
  const [defaultOpening, setDefaultOpening] = useState([]);
  const [folderSelectedFromApp, setFolderSelectedFromApp] = useState();
  const [subscribed, setSubscribed] = useState(false);
  const [folderInitFromApp, setFolderInitFromApp] = useState();

  useEffect(() => {
    if (initialStatus && !isEmpty(selectedFolders)) {
      const selectedWithSpace = get(selectedFolders, [workSpace], {});
      setSelected(selectedWithSpace);
    }
  }, [selectedFolders]);

  useEffect(() => {
    const config = {
      type,
      isEnableShowContent,
      selectable,
      showingType,
      workSpace
    };
    if (!initialStatus) {
      initFolder(config);
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(foldersData.byId) && !isNil(foldersData.byId)) {
      setDefaultOpening(foldersData.rootIds);
    }
  }, [foldersData]);

  useEffect(() => {
    if (isEnableSelectRoot) {
      if (initialStatus && isEmpty(selectedFolder)) {
        const rootFolder = foldersData.rootIds.length
          ? foldersData.rootIds[0]
          : [];
        if (!selectable) {
          onSelectFolder(workSpace, {
            [rootFolder]: true
          });
        } else {
          onSelectAllFolder(workSpace);
        }
      }
    }
  }, [initialStatus]);

  useEffect(() => {
    if (initialStatus && folderInitFromApp) {
      initFolderFromApp(folderInitFromApp);
    }
  }, [initialStatus, folderInitFromApp]);

  useEffect(() => {
    if (initialStatus) {
      initSuccess({
        foldersData
      });
    }
  }, [initialStatus]);

  useEffect(() => {
    const folder = get(foldersData, ['byId', folderInitFromApp]);
    if (folderInitFromApp && initialStatus && !isNil(folder)) {
      const parentId = getAllParentId(folder, foldersData)
        .map(item => item.id)
        .filter(item => item !== folderInitFromApp);
      setDefaultOpening(parentId);
    }
  }, [initialStatus, foldersData, folderInitFromApp]);

  useEffect(() => {
    const pathList = !selectable ? getPathList(selectedFolder) : [];
    const selectedFolderId = Object.keys(selectedFolder);
    const folder = !selectable
      ? get(foldersData, ['byId', selectedFolderId[0]])
      : {};
    handleSelectedFoler({
      selectedFolder,
      folder,
      pathList
    });
  }, [selectedFolder]);

  useEffect(() => {
    if (!isEmpty(folderSelectedFromApp) && !isNil(folderSelectedFromApp)) {
      onSelectFolder(workSpace, folderSelectedFromApp);
      const pathList = getPathList(folderSelectedFromApp);
      setDefaultOpening(pathList.map(item => item.id));
    }
  }, [folderSelectedFromApp]);

  useEffect(() => {
    let subscription;
    if (!subscribed) {
      subscription = subjectObservable.subscribe({
        next: v => processEvent(v)
      });
      setSubscribed(true);
    }
    return () => {
      subscription.unsubscribe();
      setSubscribed(false);
    };
  }, [subjectObservable]);

  const getPathList = selectedFolder => {
    if (selectable) {
      return [];
    }
    const folderId = Object.keys(selectedFolder);
    const folder = folderById(folderId[0]);
    return flattenDeep(getAllParentId(folder, foldersData)).reverse();
  };

  const onSelectMenu = (item, action) => {
    setCurrentFolderForAction(item);
    switch (action) {
      case 'edit':
        setOpenEdit(true);
        setOpenModify(true);
        break;
      case 'delete':
        setOpenDelete(true);
        break;
      case 'move':
        setOpenModify(true);
        setModifyFromAction(true);
        break;
      default:
        break;
    }
  };

  const onChange = selectedfolder => {
    onSelectFolder(workSpace, selectedfolder);
  };

  const onExpand = folderId => {
    expandFolder(folderId);
  };

  //search folder
  const onSearch = data => {
    searchFolder(data);
  };

  //new folder
  const handleSubmitNewFolder = (data, parentId) => {
    createFolder(data, parentId);
    handleCloseNewFolder();
  };

  const handleCloseNewFolder = () => {
    setOpenNew(false);
    setStatus(false);
  };

  //modify folder
  const handleSubmitModify = (selectedFolder = {}, folderName) => {
    const currentFolderId = currentFolderForAction.id;
    const newParentId = Object.keys(selectedFolder)[0];
    if (openEdit) {
      editFolder(currentFolderId, folderName, true, false);
    } else {
      editFolder(currentFolderId, folderName, false, true, newParentId);
    }
    handleCloseModify();
  };

  const handleCloseModify = () => {
    setOpenModify(false);
    setOpenEdit(false);
  };

  //delete folder
  const handleSubmitDeleteFolder = data => {
    deleteFolder(data.id, workSpace);
    handleCloseDeleteFolder();
  };

  const handleCloseDeleteFolder = () => {
    setOpenDelete(false);
  };

  const getFolderSeleted = selectedFolder => {
    const selectedFolderId = Object.keys(selectedFolder);
    const data =
      folderById(selectedFolderId[0]) || folderById(rootFolderIds[0]) || {};
    return data;
  };

  const newParentFolder = () => {
    return fromNewButton
      ? getFolderSeleted(selectedInModify)
      : getFolderSeleted(selectedFolder) || {};
  };

  const handerClickNewFolder = selectedfolder => {
    const setData = async () => {
      await setStatus(true);
      await setSelectedInModify(selectedfolder);
      await setOpenNew(true);
    };
    setData();
  };

  const handlerOpenFolder = () => {
    if (!selectable) {
      setStatus(false);
      setOpenNew(true);
    } else {
      setOpenModify(true);
      setModifyFromAction(false);
      setStatus(false);
    }
  };

  const initFolderSelectedFromApp = folderId => {
    setFolderInitFromApp(folderId);
  };

  const unSelectCurentFolderWrapper = () => {
    unSelectCurrentFolder(workSpace);
  };

  const processEvent = event => {
    const eventKey = event.split(' ')[0];
    const eventPayload = event.split(' ').length > 1 ? event.split(' ')[1] : '';
    switch (eventKey) {
      case 'action/newfolder':
        handlerOpenFolder();
        break;
      case 'action/select':
        setFolderSelectedFromApp({
          [eventPayload]: true
        });
        break;
      case 'action/initselect':
        initFolderSelectedFromApp(eventPayload);
        break;
      case 'action/unSelectCurrent':
        unSelectCurentFolderWrapper();
        break;
      default:
        break;
    }
  };

  const getModifyType = () => {
    if (openEdit) {
      return 3;
    }
    if (openModify && modifyFromAction) {
      return 2;
    }
    return 1;
  };
  return (
    <React.Fragment>
      {isEnableSearch && <SearchBox onSearch={onSearch} />}
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
        defaultOpening={defaultOpening}
        isEnableShowRootFolder={isEnableShowRootFolder}
      />
      <DeleteFolder
        open={openDelete}
        folder={currentFolderForAction}
        handleClose={handleCloseDeleteFolder}
        handleSubmit={handleSubmitDeleteFolder}
      />
      <EditFolder
        open={openModify}
        type={getModifyType()}
        isEnableEditName={!modifyFromAction || openEdit}
        isEnableEditFolder={!openEdit}
        isNewFolder={!modifyFromAction && !openEdit}
        handleClose={handleCloseModify}
        handleSubmit={handleSubmitModify}
        foldersData={foldersData}
        onExpand={onExpand}
        selected={selectedFolder}
        defaultOpening={rootFolderIds}
        currentFolder={currentFolderForAction}
        handerClickNewFolder={handerClickNewFolder}
      />
      <CreateFolder
        open={openNew}
        parentFolder={newParentFolder()}
        handleClose={handleCloseNewFolder}
        handleSubmit={handleSubmitNewFolder}
      />
    </React.Fragment>
  );
}

FolderTreeWrapper.propTypes = {
  type: string,
  workSpace: string,
  onSelectFolder: func,
  onSelectMenuItem: func,
  selectable: bool,
  isEnableShowContent: bool,
  isEnableSearch: bool,
  isEnableShowRootFolder: bool,
  isEnableSelectRoot: bool,
  showingType: arrayOf(string).isRequired,
  folderAction: arrayOf(
    shape({
      id: number,
      type: string,
      name: string
    })
  ),
  foldersData: shape(Object),
  selectedFolders: shape(Object),
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
  editFolder: func,
  searchFolder: func,
  onSelectAllFolder: func,
  initialStatus: bool,
  initFolderFromApp: func,
  initSuccess: func,
  unSelectFolder: func,
  unSelectCurrentFolder: func,
  unSelectAllFolder: func
};

const FolderTree = connect(
  state => ({
    foldersData: folderSelector.foldersDataSelector(state),
    fetchingFolderStatus: folderSelector.folderFetchingStatus(state),
    fetchedFolderStatus: folderSelector.folderFetchedStatus(state),
    errorStatus: folderSelector.folderErrorStatus(state),
    selectedFolders: folderSelector.selectedFolder(state),
    folderById: folderSelector.folderById(state),
    rootFolderIds: folderSelector.rootFolderIds(state),
    processingFolder: folderSelector.processingFolderSelector(state),
    initialStatus: folderSelector.getInitialStatus(state)
  }),
  {
    expandFolder: folderModule.fetchMore,
    onSelectFolder: folderModule.selectFolder,
    onSelectAllFolder: folderModule.selectAllFolder,
    initFolder: folderModule.initRootFolder,
    createFolder: folderModule.createFolder,
    deleteFolder: folderModule.deleteFolder,
    editFolder: folderModule.modifyFolder,
    searchFolder: folderModule.searchFolder,
    initFolderFromApp: folderModule.initFolderFromApp,
    unSelectAllFolder: folderModule.unSelectAllFolder,
    unSelectCurrentFolder: folderModule.unSelectCurrentFolder,
    unSelectFolder: folderModule.unSelectFolder
  },
  null,
  { forwardRef: true }
)(FolderTreeWrapper);

const FolderTreeWidget = widget(FolderTree);
export { FolderTree as default, FolderTreeWidget, Folder };
