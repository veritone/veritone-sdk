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
  orgEnableUploads: false
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
      [id]: {
        ...state[id],
        folderData: {
          ...state[id].folderData,
          rootItem: {
            ...payload,
            nodeItems: [],
            leafItems: []
          },
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
    return diveAndSetNodeProps(state, id, 'isLoading', { $set: true });
  },
  [LOADED_PAGE](
    state,
    {
      payload: {
        nodeItems = [],
        leafItems = [],
        nodeOffset = 0,
        leafOffset = 0
      },
      meta: { id }
    }
  ) {
    // Dive into the tree structure, append pagination results, and update offsets
    let newState = diveAndSetNodeProps(state, id, 'nodeItems', { $push: nodeItems });
    newState = diveAndSetNodeProps(newState, id, 'nodeOffset', { $set: nodeOffset });
    newState = diveAndSetNodeProps(newState, id, 'leafItems', { $push: leafItems });
    newState = diveAndSetNodeProps(newState, id, 'leafOffset', { $set: leafOffset });
    return newState;
  }
});

// This dives into the tree structure and sets the key & value provided.
// Returns the original state reference (immutability version)
function diveAndSetNodeProps(state, id, key, value) {
  const pickerType = get(state, [id, 'currentPickerType']);

  if (!id || !key || !value || !get(state, [id, `${pickerType}Data`])) {
    return state;
  }

  const currentPath = get(state, [id, `${pickerType}Data`, 'currentPath'], []);
  const updatePayload = {};
  let innerRef = updatePayload;
  currentPath.forEach(id => {
    innerRef[id] = {};
    innerRef = innerRef[id];
  });
  innerRef[key] = value;
  return update(state, {
    [id]: {
      [`${pickerType}Data`]: {
        rootItem: updatePayload
      }
    }
  });
}

const local = state => state[namespace];

export const isOpen = (state, id) => get(local(state), [id, 'open']);
export const orgEnableFolders = (state) => get(local(state), 'orgEnableFolders');
export const orgEnableUploads = (state) => get(local(state), 'orgEnableUploads');
export const currentPickerType = (state, id) => get(local(state), [id, 'currentPickerType']);

// Map the path array of ids with the container names
export const currentPath = (state, id) => {
  const pickerType = currentPickerType(state, id);
  const viewPath = get(local(state), [id, `${pickerType}Data`, 'currentPath'], []);
  let treeItems = get(local(state), [id, `${pickerType}Data`, 'rootItem']);
  // We have the array of ids and need to resolve the node names
  const nodePath = [];
  viewPath.forEach(id => {
    const match = treeItems.find(item => item.id === id);
    if (match) {
      nodePath.push(loPick(match, ['id', 'name']));
      treeItems = match.nodeItems;
    }
  });
  return nodePath;
};

export const getCurrentNode = (state, id) => {
  const pickerType = get(local(state), [id, 'currentPickerType']);
  const curPath = get(local(state), [id, `${pickerType}Data`, 'currentPath'], []);
  let treeItems = get(local(state), [id, `${pickerType}Data`, 'rootItem']);
  curPath.forEach(id => {
    const node = treeItems.find(item => item.id === id);
    if (node) {
      if (index !== curPath.length - 1) {
        treeItems = node.nodeItems || [];
      } else {
        treeItems = node;
      }
    }
  });
  return treeItems;
};

// Traverse the current pickerType dataspaces' treeItems and get the current folders contents
export const currentDirectoryItems = (state, id) => {
  const currentNode = getCurrentNode(state, id);
  const nodeItems = get(currentNode, 'nodeItems', []).map(item => loPick(item, ITEM_PICK_PROPS));
  const leafItems = get(currentNode, 'leafItems', []).map(item => loPick(item, ITEM_PICK_PROPS));
  return nodeItems.concat(leafItems);
};

export const currentDirectoryPaginationState = (state, id) => {
  const currentNode = getCurrentNode(state, id);
  return {
    nodeOffset: 0,
    leafOffset: 0,
    ...loPick(currentNode, ['nodeOffset', 'leafOffset', 'isLoading'])
  }
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
})

