import { get, isEmpty, uniqWith, isEqual } from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
const { createReducer, fetchGraphQLApi } = helpers;
const { getExtraHeaders } = modules;
const { selectSessionToken, selectOAuthToken } = modules.auth;
const { getConfig } = modules.config;

export const namespace = 'folderSelectionDialog';
export const FETCH_ROOT_FOLDER = `vtn/${namespace}/FETCH_ROOT_FOLDER`;
export const SELECTED_FOLDER = `vtn/${namespace}/SELECTED_FOLDER`;
export const FETCH_SUB_FOLDERS = `vtn/${namespace}/FETCH_SUB_FOLDERS`;
export const LOADING = `vtn/${namespace}/LOADING`;
export const NEW_FOLDER = `vtn/${namespace}/NEW_FOLDER`;

const defaultState = {
  selectedFolder: {},
  subFolderList: {},
  rootFolder: {},
  loading: false,
  newFolder: {
    loading: false,
    error: false,
    errorMessage: '',
    folder: null
  }
};

export const rootFolder = state => {
  return get(local(state), 'rootFolder');
};

export const selectedFolder = state => {
  return get(local(state), 'selectedFolder');
};

export const subFolderList = state => {
  return get(local(state), 'subFolderList');
};

export const loading = state => {
  return get(local(state), 'loading');
};

export const newFolder = state => {
  return get(local(state), 'newFolder');
};

const reducer = createReducer(defaultState, {
  [FETCH_ROOT_FOLDER](state, action) {
    const folder = get(action, 'payload');
    return {
      ...state,
      rootFolder: folder
    };
  },

  [SELECTED_FOLDER](state, action) {
    const selected = get(action, 'payload');
    return {
      ...state,
      selectedFolder: selected
    };
  },

  [FETCH_SUB_FOLDERS](state, action) {
    let folders = get(action, 'payload');
    let previousFolders = get(state, 'subFolderList');
    let newSubfolderList = { ...previousFolders, ...folders };
    return {
      ...state,
      subFolderList: newSubfolderList
    };
  },

  [LOADING](state, action) {
    let loading = get(action, 'payload');
    return {
      ...state,
      loading: loading
    };
  },

  [NEW_FOLDER](state, action) {
    let updatedInfo = get(action, 'payload');
    let previous = get(state, 'newFolder');
    let folderInfo = { ...previous, ...updatedInfo };
    return {
      ...state,
      newFolder: folderInfo
    };
  }
});

export default reducer;

function local(state) {
  return state[namespace];
}

export const selectFolder = folder => {
  return {
    type: SELECTED_FOLDER,
    payload: folder
  };
};

// fetch the root folder and childfolder count - if there is a count - it will be a number that is > 0 up to the limits set in graphql - not the total count
export function getFolders(rootFolderType) {
  return async function action(dispatch, getState) {
    dispatch({
      type: LOADING,
      payload: true
    });

    //let rootFolderType = rootFolderType;

    const query = `
      mutation createRootFolders($rootFolderType: RootFolderType ){
        createRootFolders(rootFolderType: $rootFolderType) {
          id,
          name,
          treeObjectId,
          organizationId,
          ownerId,
          typeId,
          orderIndex,
          childFolders {
            count
          }
        }
      }
    `;

    const config = getConfig(getState());
    const extraHeaders = getExtraHeaders(getState());
    const { apiRoot, graphQLEndpoint } = config;
    const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;

    try {
      const response = await fetchGraphQLApi({
        endpoint: graphQLUrl,
        query,
        variables: {
          rootFolderType
        },
        extraHeaders,
        token: selectSessionToken(getState()) || selectOAuthToken(getState())
      });

      //throw err
      if (!isEmpty(response.errors)) {
        throw response.errors;
      }

      const folder = get(response, 'data.createRootFolders[0]');

      // set the value for the root folder
      dispatch({
        type: FETCH_ROOT_FOLDER,
        payload: folder
      });

      dispatch({
        type: LOADING,
        payload: false
      });

      //get the subfolders for the root folder
      dispatch(getAllSubFolders(folder));
    } catch (err) {
      dispatch({
        type: LOADING,
        payload: false
      });
      console.log(err);
    }
  };
}

// A function that accepts a folder object and fetches all childFolders until the records returned is
// less than the CHILD_FOLDER_LIMIT

export function getAllSubFolders(folder) {
  const childFolders = get(folder, 'childFolders.records', []);
  const limit = 30;

  return getMoreSubFolders(
    {
      folderId: folder.treeObjectId,
      limit: limit,
      offset: childFolders.length
    },
    childFolders
  );
}

export function getMoreSubFolders(variables, accumulator = []) {
  return async function action(dispatch, getState) {
    dispatch({
      type: LOADING,
      payload: true
    });

    const query = `
      query getChildFolders($folderId: ID!, $limit: Int, $offset: Int) {
        folder(id: $folderId) {
          childFolders(limit: $limit, offset: $offset) {
            count
            limit
            offset
            records {
              id,
              treeObjectId,
              orderIndex,
              name,
              description,
              modifiedDateTime,
              status,
              typeId,
              parent {
                treeObjectId
              }
              childFolders {
                count
              }
            }
          }
        }
      }
    `;

    const config = getConfig(getState());
    const extraHeaders = getExtraHeaders(getState());
    const { apiRoot, graphQLEndpoint } = config;
    const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
    let folderList;
    try {
      const res = await fetchGraphQLApi({
        endpoint: graphQLUrl,
        query,
        variables,
        extraHeaders,
        token: selectSessionToken(getState()) || selectOAuthToken(getState())
      });

      const newChildFolders = get(res, 'data.folder.childFolders.records', []);
      // check if data returned is complete set for this folder - if not bump the offset up
      // if data is complete - sort the list by name and dedupe the list
      // we are sorting alphabetically
      if (get(res, 'data.folder.childFolders.count') < variables.limit) {
        folderList = accumulator.concat(newChildFolders);
        //sort the list
        folderList.sort((a, b) => {
          let nameA = a.name.toUpperCase();
          let nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        // set id for folder list
        let key = variables.folderId;
        //dedupe the subfolders
        const subfolders = {
          [key]: uniqWith(folderList, isEqual)
        };

        dispatch({
          type: FETCH_SUB_FOLDERS,
          payload: subfolders
        });

        dispatch({
          type: LOADING,
          payload: false
        });
      } else {
        // get additional subfolders to complete set
        dispatch(
          getMoreSubFolders(
            {
              ...variables,
              offset: newChildFolders.length + accumulator.length
            },
            accumulator.concat(newChildFolders)
          )
        );
      }
    } catch (err) {
      dispatch({
        type: LOADING,
        payload: false
      });
      console.log(err);
    }
  };
}

//create a new folder in the folder tree
export function createFolder(
  name,
  description,
  parentId,
  orderIndex,
  appType,
  folder
) {
  return async function action(dispatch, getState) {
    dispatch({
      type: NEW_FOLDER,
      payload: { loading: true }
    });
    let variables = {
      name: name,
      description: description,
      parentId: parentId,
      orderIndex: orderIndex,
      rootFolderType: appType
    };

    const query = `
      mutation {
        createFolder(input: {
          name: "${name}",
          description: "${description}",
          parentId: "${parentId}",
          orderIndex: ${orderIndex},
          rootFolderType: ${appType}
        }) {
          id,
          treeObjectId,
          orderIndex,
          name,
          description,
          modifiedDateTime,
          status,
          parent {
            treeObjectId
          }
          childFolders {
            count
          }
        }
      }
    `;

    const config = getConfig(getState());
    const extraHeaders = getExtraHeaders(getState());
    const { apiRoot, graphQLEndpoint } = config;
    const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;

    try {
      let response = await fetchGraphQLApi({
        endpoint: graphQLUrl,
        query,
        variables,
        extraHeaders,
        token: selectSessionToken(getState()) || selectOAuthToken(getState())
      });

      if (!isEmpty(response.errors)) {
        throw response.errors;
      }

      let newFolder = response.data.createFolder;
      // if the folder where this new folder is being created within  has a parent folder
      // and it originally did not have any child folders -
      // we also need to refetch the parent folders subfolders or the DOM won't update correctly
      if (folder.parent && folder.childFolders.count === 0) {
        let parentFolder = {
          treeObjectId: folder.parent.treeObjectId,
          childFolders: {}
        };
        dispatch(getAllSubFolders(parentFolder));
      }
      dispatch({
        type: NEW_FOLDER,
        payload: {
          loading: false,
          folder: newFolder
        }
      });
      // also get the folders children which will reflect the new folder added
      dispatch(getAllSubFolders(folder));
    } catch (err) {
      dispatch({
        type: NEW_FOLDER,
        payload: {
          loading: false,
          error: true,
          errorMessage: err[0].message
            ? err[0].message
            : 'Something went wrong. Could not create new folder'
        }
      });
      return err;
    }
  };
}

// function to reset NewFolder to default state reset to default state or whatever you need
export function resetNewFolder(loading, error, errorMessage, folder) {
  return function action(dispatch, getState) {
    dispatch({
      type: NEW_FOLDER,
      payload: {
        loading: false || loading,
        error: false || error,
        errorMessage: '' || errorMessage,
        folder: null || folder
      }
    });
  };
}
