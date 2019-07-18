import { helpers } from 'veritone-redux-common';
import { get, isArray, pick as loPick } from 'lodash';
import update from 'immutability-helper';
const { createReducer } = helpers;

export const namespace = 'dataPicker';
export const PICK_START = `${namespace}_PICK_START`;
export const ON_PICK = `${namespace}_ON_PICK`;
export const PICK_END = `${namespace}_PICK_END`;
export const INIT_PICKER_TYPE = `${namespace}_INIT_PICKER_TYPE`;
export const INIT_FOLDER = `${namespace}_INIT_FOLDER`;
export const INIT_UPLOAD = `${namespace}_INIT_UPLOAD`;
export const SET_PICKER_TYPE = `${namespace}_SET_PICKER_TYPE`;
export const FETCH_PAGE = `${namespace}_FETCH_PAGE`;
export const ERRORED_PAGE = `${namespace}_ERRORED_PAGE`;
export const LOADED_PAGE = `${namespace}_LOADED_PAGE`;
export const SELECT_NODE = `${namespace}_SELECT_NODE`;
export const SELECT_CRUMB = `${namespace}_SELECT_CRUMB`;
export const UPLOAD_TO_TDO = `${namespace}_UPLOAD_TO_TDO`;

export const RETRY_REQUEST = `${namespace}_RETRY_REQUEST`;
export const RETRY_DONE = `${namespace}_RETRY_DONE`;

export const SET_SEARCH_VALUE = `${namespace}_SET_SEARCH_VALUE`;
export const CLEAR_SEARCH = `${namespace}_CLEAR_SEARCH`;

const ITEM_PICK_PROPS = [
  'id',
  'type',
  'name',
  'createdDateTime',
  'modifiedDateTime',
  'startDateTime',
  'stopDateTime',
  'primaryAsset',
  'streams'
];

const defaultState = {
  itemData: {},
  searchData: {}
};

export default createReducer(defaultState, {
  [PICK_START](
    state,
    {
      meta: { id }
    }
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        open: true
      }
    }
  },
  [ON_PICK](
    state,
    {
      meta: { id },
      payload
    }
  ) {
    return state;
  },
  [PICK_END](
    state,
    {
      meta: { id }
    }
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        open: false
      }
    }
  },
  [INIT_PICKER_TYPE](
    state,
    {
      payload,
      meta: { id }
    }
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        ...payload,
        searchValue: ''
      }
    }
  },
  [INIT_FOLDER](
    state,
    {
      payload,
      meta: { id }
    }
  ) {
    return {
      ...state,
      itemData: {
        ...state.itemData,
        ...payload
      },
      [id]: {
        ...state[id],
        folderData: {
          ...state[id].folderData,
          currentPath: [],
        }
      }
    }
  },
  [INIT_UPLOAD](
    state,
    { meta: { id } }
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        uploadData: {}
      }
    }
  },
  [UPLOAD_TO_TDO](
    state,
    {
      meta: { id },
      payload
    }
  ) {
    return state;
  },
  [SET_PICKER_TYPE](
    state,
    { 
      payload,
      meta: { id }
    }
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        currentPickerType: payload
      }
    };
  },
  [FETCH_PAGE](
    state,
    { meta: { id } }
  ) {
    // Dive into the tree structure and update the loading flag for that nodeItem
    const pickerType = get(state, [id, 'currentPickerType']);
    const currentTypeInitialized = get(state, [id, `${pickerType}Data`]);
    if (!id || !currentTypeInitialized) {
      return state;
    }

    const {
      currentNodeId,
      currentNodeType
    } = getCurrentIdAndType(state, id);
    const currentNodeKey = `${currentNodeType}:${currentNodeId}`

    return update(state, {
      itemData: {
        [currentNodeKey]: {
          isLoading: { $set: true }
        }
      }
    });
  },
  [ERRORED_PAGE](
    state,
    {
      meta: { id },
      payload
    }
  ) {
    const {
      currentNodeId,
      currentNodeType
    } = getCurrentIdAndType(state, id);

    if (currentNodeId && currentNodeType && payload) {
      return update(state, {
        itemData: {
          [`${currentNodeType}:${currentNodeId}`]: {
            error: { $set: payload },
            isLoading: { $set: false }
          }
        }
      });
    }
    return state;
  },
  [LOADED_PAGE](
    state,
    {
      payload: {
        itemData = {},
        nodeIds = [],
        leafIds = [],
        nodeOffset = 0,
        leafOffset = 0
      },
      meta: { id }
    }
  ) {
    const pickerType = get(state, [id, 'currentPickerType']);

    if (
      !id ||
      !get(state, [id, `${pickerType}Data`])
    ) {
      return state;
    }

    const {
      currentNodeId,
      currentNodeType
    } = getCurrentIdAndType(state, id);
    const itemDataSetter = Object.keys(itemData).reduce((acc, key) => {
      acc[key] = { $set: itemData[key] };
      return acc;
    }, {});
    itemDataSetter[`${currentNodeType}:${currentNodeId}`] = {
      nodeIds: { $push: nodeIds },
      leafIds: { $push: leafIds },
      nodeOffset: { $set: nodeOffset },
      leafOffset: { $set: leafOffset },
      isLoading: { $set: false },
      isLoaded: { $set: true }
    };
    const newState = update(state, {
      itemData: itemDataSetter
    });

    return newState;
  },
  [SELECT_NODE](
    state,
    {
      meta: { id },
      payload
    }
  ) {
    let newState = state;
    if (id && isArray(payload)) {
      const pickerType = get(state, [id, 'currentPickerType']);
      newState = update(newState, {
        [id]: {
          [`${pickerType}Data`]: {
            currentPath: { $push: payload }
          }
        }
      })
    }
    return newState;
  },
  [SELECT_CRUMB] (
    state,
    {
      meta: { id },
      payload
    }
  ) {
    const pickerType = get(state, [id, 'currentPickerType']);
    const currentPath = get(state, [id, `${pickerType}Data`, 'currentPath'], []);
    let newState = state;
    if (payload < currentPath.length) {
      const newPath = currentPath.slice(0, payload);
      newState = update(newState, {
        [id]: {
          [`${pickerType}Data`]: {
            currentPath: { $set: newPath }
          }
        }
      });
    }
    return newState;
  },
  [SET_SEARCH_VALUE] (
    state,
    {
      meta: { id },
      payload
    }
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        searchValue: payload
      },
      searchData: {
        ...state.searchData,
        [payload]: {
          ...state.searchData[payload],
          results: [
            ...get(state, ['searchData', payload, 'results'], [])
          ],
          offset: get(state, ['searchData', payload, 'offset'], 0),
          isLoading: false
        }
      }
    };
  },
  [CLEAR_SEARCH] (
    state,
    {
      meta: { id }
    }
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        searchValue: ''
      }
    }
  }
});

// Gets the variables used to map to itemData
function getCurrentIdAndType(state, id) {
  const pickerType = get(state, [id, 'currentPickerType']);
  let currentNodeType = pickerType, currentNodeId = 'root';
  const currentPath = get(state, [id, `${pickerType}Data`, 'currentPath'], []);
  if (currentPath.length) {
    const curDir = currentPath.slice(-1)[0];
    currentNodeId = curDir.id;
    currentNodeType = curDir.type;
  }
  return {
    currentNodeId,
    currentNodeType
  };
}

const local = state => state[namespace];

export const isOpen = (state, id) => get(local(state), [id, 'open']);
export const availablePickerTypes = (state, id) => get(local(state), [id, 'availablePickerTypes'], []);
export const currentPickerType = (state, id) => get(local(state), [id, 'currentPickerType']);
export const searchValue = (state, id) => get(local(state), [id, 'searchValue'], '');

export const getItemByTypeAndId = state => (type, itemId) => {
  const item = get(local(state), ['itemData', `${type}:${itemId}`]);
  return item ? loPick(item, ITEM_PICK_PROPS) : undefined;
}

// Map the path array of ids with the container names
export const currentPath = (state, id) => {
  const availableTypes = availablePickerTypes(state, id);
  const itemData = get(local(state), 'itemData', {});
  let pickerType = currentPickerType(state, id);

  // Let users see what folder they're uploading to
  if (pickerType === 'upload' && availableTypes.includes('folder')) {
    pickerType = 'folder';
  }

  const curPath = get(local(state), [id, `${pickerType}Data`, 'currentPath'], []);
  // We have the array of ids and need to resolve the node names
  const nodePath = [];
  curPath.forEach(pathObj => {
    const match = itemData[`${pickerType}:${pathObj.id}`];
    if (match) {
      nodePath.push(loPick(match, ['id', 'type', 'name']));
    }
  });
  return nodePath;
};

// Get the directory we're currently in (used to make API calls)
export const getCurrentNode = (state, id) => {
  const availableTypes = availablePickerTypes(state, id);
  const itemData = get(local(state), 'itemData', {});
  let pickerType = get(local(state), [id, 'currentPickerType']);
  
  // Retain current folder to upload to
  if (pickerType === 'upload' && availableTypes.includes('folder')) {
    pickerType = 'folder';
  }

  const curPath = get(local(state), [id, `${pickerType}Data`, 'currentPath'], []);
  let currentNodeType = pickerType, currentNodeId = 'root';
  if (curPath.length) {
    const curDir = curPath.slice(-1)[0];
    currentNodeType = curDir.type;
    currentNodeId = curDir.id;
  }
  return itemData[`${currentNodeType}:${currentNodeId}`];
};

// Traverse the current pickerType dataspaces' treeItems and get the current folders contents
export const currentDirectoryItems = (state, id) => {
  const pickerType = get(local(state), [id, 'currentPickerType']);
  const searchValue = get(local(state), [id, 'searchValue'], '');
  const itemData = get(local(state), 'itemData', {});
  const searchData = get(local(state), 'searchData', {});
  let currentNodeId = 'root', currentNodeType = pickerType;
  const curPath = get(local(state), [id, `${pickerType}Data`, 'currentPath'], []);
  // If searchValue populated, display search results
  if (searchValue) {
    return get(searchData, [searchValue, 'results'], []);
  }
  if (curPath.length) {
    const curDir = curPath.slice(-1)[0];
    currentNodeId = curDir.id;
    currentNodeType = curDir.type;
  }
  const currentNode = itemData[`${currentNodeType}:${currentNodeId}`];
  const nodeItems = get(currentNode, 'nodeIds', []);
  const leafItems = get(currentNode, 'leafIds', []);
  return nodeItems.concat(leafItems);
};

export const currentDirectoryLoadingState = (state, id) => {
  const currentNode = getCurrentNode(state, id);
  return loPick(currentNode, [
    'isLoading',
    'isLoaded',
    'nodeOffset',
    'leafOffset',
    'error',
  ]);
};

// ACTIONS
export const pick = (id, configuration) => ({
  type: PICK_START,
  meta: { id },
  payload: configuration
});
export const onPick = (id, itemIds, callback) => ({
  type: ON_PICK,
  meta: { id },
  payload: {
    itemIds,
    callback
  }
});
export const endPick = id => ({
  type: PICK_END,
  meta: { id }
});
export const fetchPage = id => ({
  type: FETCH_PAGE,
  meta: { id }
});
export const selectNode = (id, items) => ({
  type: SELECT_NODE,
  meta: { id },
  payload: items
});
export const selectCrumb = (id, index) => ({
  type: SELECT_CRUMB,
  meta: { id },
  payload: index
});
export const setPickerType = (id, pickerType) => ({
  type: SET_PICKER_TYPE,
  meta: { id },
  payload: pickerType
});
export const uploadToTDO = (id, files, callback) => ({
  type: UPLOAD_TO_TDO,
  meta: { id },
  payload: {
    files,
    callback
  }
});

// These retry actions are wrappers around filepicker retries
export const retryRequest = (id, callback) => ({
  type: RETRY_REQUEST,
  payload: { callback },
  meta: { id }
});
export const retryDone = (id, callback) => ({
  type: RETRY_DONE,
  payload: { callback },
  meta: { id }
});

// Search Actions
export const setSearchValue = (id, searchValue) => ({
  type: SET_SEARCH_VALUE,
  meta: { id },
  payload: searchValue
});
export const clearSearch = id => ({
  type: CLEAR_SEARCH,
  meta: { id }
});
