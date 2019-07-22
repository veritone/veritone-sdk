import {
  get,
  isEmpty
} from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
const { createReducer, fetchGraphQLApi } = helpers;
const { selectSessionToken, selectOAuthToken } = modules.auth;
const { getConfig } = modules.config;


export const namespace  = 'folderSelectionDialog';
export const FETCH_ROOT_FOLDER  = `vtn/${namespace}/FETCH_ROOT_FOLDER`;
export const SELECTED_FOLDER  = `vtn/${namespace}/SELECTED_FOLDER`;
export const FETCH_SUB_FOLDERS  = `vtn/${namespace}/FETCH_SUB_FOLDERS`;
export const ROOT_FOLDERS_LOADING = `vtn/${namespace}/ROOT_FOLDERS_LOADING`;
export const SUB_FOLDERS_LOADING = `vtn/${namespace}/SUB_FOLDERS_LOADING`;


const defaultState = {
  selectedFolder: {},
  subFolderList: {},
  rootFolder: {},
  loaderRoot: false,
  loaderSubFolder: false
};

export const rootFolder = (state) => {
  return get(local(state), 'rootFolder');
};

export const selectedFolder = (state) => {
  return get(local(state), 'selectedFolder');
};

export const subFolderList = (state) => {
  return get(local(state), 'subFolderList')
};

export const loaderRoot = (state) => {
  return get(local(state), 'loaderRoot')
};

export const loaderSubFolder = (state) => {
  return get(local(state), 'loaderSubFolder')
};

const reducer  = createReducer(defaultState, {
  [FETCH_ROOT_FOLDER](state, action){
    const folder = get(action, 'payload');
    return {
      ...state,
      rootFolder: folder
    }
  },

  [SELECTED_FOLDER](state, action){
    const selected = get(action, 'selected');
    return {
      ...state,
      selectedFolder: selected
    }
  },

  [FETCH_SUB_FOLDERS](state, action){
    let folders = get(action, 'payload')
    let previousFolders = get(state, 'subFolderList');
    let newSubfolderList = {...previousFolders, ...folders};
    return {
      ...state,
      subFolderList: newSubfolderList
    }
  },

  [ROOT_FOLDERS_LOADING](state, action){
    let loading = get(action, 'payload')
    return {
      ...state,
      loaderRoot: loading
    }
  },

  [SUB_FOLDERS_LOADING](state, action){
    let loading = get(action, 'payload')
    return {
      ...state,
      loaderSubFolder: loading
    }
  },

});

export default reducer;

function local(state) {
  return state[namespace];
}



export const selectFolder = (folder) => {
  return {
    type: SELECTED_FOLDER,
    selected: folder
  };
};


export function getFolders() {
  return async function action(dispatch, getState) {
    dispatch({
      type: ROOT_FOLDERS_LOADING,
      payload: true
    });

    let rootFolderType = "cms";

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
          childTDOs {
            count
            records{
              id
            }
          }
          childFolders {
            count
          }
        }
      }
    `;

    const config = getConfig(getState());
    const { apiRoot, graphQLEndpoint } = config;
    const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;

    try {
      const response = await fetchGraphQLApi({
        endpoint: graphQLUrl,
        query,
        variables: {
          rootFolderType,
        },
        token: selectSessionToken(getState()) || selectOAuthToken(getState())
      });

      if (!isEmpty(response.errors)){
        throw response.errors;
      }

      const folder = get(response, 'data.createRootFolders[0]');
      
      dispatch({
        type: FETCH_ROOT_FOLDER,
        payload: folder
      });

      dispatch({
        type: ROOT_FOLDERS_LOADING,
        payload: false
      });

      dispatch(getAllSubFolders(folder));

    } catch (err) {
        dispatch({
          type: ROOT_FOLDERS_LOADING,
          payload: false
        });
      console.log(err)
    }
  };
}



// A function that accepts a folder object and fetches all childFolders until the records returned is
  // less than the CHILD_FOLDER_LIMIT


export function getAllSubFolders(folder) {
  const childFolders = get(folder, 'childFolders.records', []);
  const limit  = 30;
 
  return getMoreSubFolders(
    {
      folderId: folder.treeObjectId,
      limit: limit,
      offset: childFolders.length
    },
    childFolders
  );
}






export function getMoreSubFolders( variables, accumulator = []) {

  return async function action(dispatch, getState) {
    dispatch({
      type: SUB_FOLDERS_LOADING,
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
    const { apiRoot, graphQLEndpoint } = config;
    const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
    let folderList;
    try {
      const res = await fetchGraphQLApi({
        endpoint: graphQLUrl,
        query,
        variables,
        token: selectSessionToken(getState()) || selectOAuthToken(getState())
      })

      const newChildFolders = get(res, 'data.folder.childFolders.records', []);

      if (get(res, 'data.folder.childFolders.count') < variables.limit) {
        folderList = accumulator.concat(newChildFolders)
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

        })
        let key = variables.folderId;

        const subfolders = {
          [key] : folderList
        };

        dispatch({
          type: FETCH_SUB_FOLDERS,
          payload: subfolders,
        });

        dispatch({
          type: SUB_FOLDERS_LOADING,
          payload: false
        });
      } else {

        dispatch(getMoreSubFolders(
          {
            ...variables,
            offset: newChildFolders.length + accumulator.length
          },
          accumulator.concat(newChildFolders)
        ));
      }
    } catch (err) {
        dispatch({
          type: SUB_FOLDERS_LOADING,
          payload: false
        });
      console.log(err)
    }
  };
}

export function createFolder(name, description, parentId, orderIndex, appType, folder) {
  return async function action(dispatch, getState) {

    let variables  = {
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
    const { apiRoot, graphQLEndpoint } = config;
    const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;

    try {
      await fetchGraphQLApi({
        endpoint: graphQLUrl,
        query,
        variables,
        token: selectSessionToken(getState()) || selectOAuthToken(getState())
      });

      if (folder.parent) {
        let parentFolder = {
          treeObjectId: folder.parent.treeObjectId,
          childFolders: {}
        }
        dispatch(getAllSubFolders(parentFolder))
      }

      dispatch(getAllSubFolders(folder))

    } catch (err) {
      // dispatch({
      //   type: FETCH_ENGINES_FAILURE,
      //   payload: err,
      //   meta: { filters }
      // });
      console.log(err)
    }
  };
}

