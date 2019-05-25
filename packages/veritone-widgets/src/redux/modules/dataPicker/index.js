import { helpers } from 'veritone-redux-common';
import { get, isArray, pick as loPick } from 'lodash';
import update from 'immutability-helper';
const { createReducer } = helpers;

export const namespace = 'dataPicker';
export const PICK_START = `${namespace}_PICK_START`;
export const PICK_END = `${namespace}_PICK_END`;
export const INIT_ORG_CONFIG = `${namespace}_INIT_ORG_CONFIG`;
export const INIT_PICKER_TYPE = `${namespace}_INIT_PICKER_TYPE`;
export const INIT_FOLDER = `${namespace}_INIT_FOLDER`;
export const INIT_UPLOAD = `${namespace}_INIT_UPLOAD`;
export const FETCH_PAGE = `${namespace}_FETCH_PAGE`;
export const LOADED_PAGE = `${namespace}_LOADED_PAGE`;
export const SELECT_NODES = `${namespace}_SELECT_NODES`;
export const SELECT_CRUMB = `${namespace}_SELECT_CRUMB`;

const ITEM_PICK_PROPS = [
  'id',
  'type',
  'name',
  'createdDateTime',
  'modifiedDateTime',
  'primaryAsset',
  'streams'
];

const defaultState = {
  orgEnableFolders: false,
  orgEnableUploads: false,
  itemData: {}
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
  [INIT_ORG_CONFIG](
    state,
    {
      payload: {
        orgEnableFolders,
        orgDisableUploads
      }
    }
  ) {
    return {
      ...state,
      orgEnableFolders,
      orgEnableUploads: !orgDisableUploads
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
        currentPickerType: payload
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
        uploadData: {
          files: []
        }
      }
    }
  },
  [FETCH_PAGE](
    state,
    { meta: { id } }
  ) {
    // Dive into the tree structure and update the loading flag for that nodeItem
    const itemData = get(state, 'itemData');
    const pickerType = get(state, [id, 'currentPickerType']);

    if (
      !id ||
      !get(state, [id, `${pickerType}Data`])
    ) {
      return state;
    }

    let currentNodeType = pickerType, currentNodeId = 'root';
    const currentPath = get(state, [id, `${pickerType}Data`, 'currentPath'], []);
    if (currentPath.length) {
      const curDir = currentPath.slice(-1)[0];
      currentNodeId = curDir.id;
      currentNodeType = curDir.type;
    }
    const currentNodeKey = `${currentNodeType}:${currentNodeId}`
    return update(state, {
      itemData: {
        [currentNodeKey]: {
          isLoading: { $set: true }
        }
      }
    });
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

    let currentNodeType = pickerType, currentNodeId = 'root';
    const currentPath = get(state, [id, `${pickerType}Data`, 'currentPath'], []);
    if (currentPath.length) {
      const curDir = currentPath.slice(-1)[0];
      currentNodeId = curDir.id;
      currentNodeType = curDir.type;
    }
    let itemDataSetter = Object.keys(itemData).reduce((acc, key) => {
      acc[key] = { $set: itemData[key] };
      return acc;
    }, {});
    itemDataSetter[`${currentNodeType}:${currentNodeId}`] = {
      nodeIds: { $push: nodeIds },
      leafIds: { $push: leafIds },
      nodeOffset: { $set: nodeOffset },
      leafOffset: { $set: leafOffset },
      isLoading: { $set: false }
    };
    const newState = update(state, {
      itemData: itemDataSetter
    });

    return newState;
  },
  [SELECT_NODES](
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
  }
});

const local = state => state[namespace];

export const isOpen = (state, id) => get(local(state), [id, 'open']);
export const orgEnableFolders = (state) => get(local(state), 'orgEnableFolders');
export const orgEnableUploads = (state) => get(local(state), 'orgEnableUploads');
export const currentPickerType = (state, id) => get(local(state), [id, 'currentPickerType']);

// Map the path array of ids with the container names
export const currentPath = (state, id) => {
  const itemData = get(local(state), 'itemData', {});
  const pickerType = currentPickerType(state, id);
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

export const getCurrentNode = (state, id) => {
  const itemData = get(local(state), 'itemData', {});
  const pickerType = get(local(state), [id, 'currentPickerType']);
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
  const itemData = get(local(state), 'itemData', {});
  let currentNodeId = 'root', currentNodeType = pickerType;
  const curPath = get(local(state), [id, `${pickerType}Data`, 'currentPath'], []);
  if (curPath.length) {
    const curDir = curPath.slice(-1)[0];
    currentNodeId = curDir.id;
    currentNodeType = curDir.type;
  }
  const currentNode = itemData[`${currentNodeType}:${currentNodeId}`];
  const nodeItems = get(currentNode, 'nodeIds', [])
    .map(id => itemData[`${pickerType}:${id}`])
    .map(item => loPick(item, ITEM_PICK_PROPS));
  const leafItems = get(currentNode, 'leafIds', [])
    .map(id => itemData[`tdo:${id}`])
    .map(item => loPick(item, ITEM_PICK_PROPS));
  return nodeItems.concat(leafItems);
};

export const currentDirectoryLoadingState = (state, id) => {
  const currentNode = getCurrentNode(state, id);
  return pick(currentNode, ['isLoading', 'nodeOffset', 'leafOffset']);
};

// ACTIONS
export const pick = id => ({
  type: PICK_START,
  meta: { id }
});
export const endPick = id => ({
  type: PICK_END,
  meta: { id }
});
export const fetchPage = id => ({
  type: FETCH_PAGE,
  meta: { id }
});
export const selectNodes = (id, items) => ({
  type: SELECT_NODES,
  meta: { id },
  payload: items
});
export const selectCrumb = (id, index) => ({
  type: SELECT_CRUMB,
  meta: { id },
  payload: index
});