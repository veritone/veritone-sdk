import {
  get,
  uniqWith,
  isEqual
} from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
const { createReducer, fetchGraphQLApi } = helpers;
const { selectSessionToken, selectOAuthToken } = modules.auth;
const { getConfig } = modules.config;


export const namespace  = 'folderSelectionDialog';
export const FETCH_ROOT_FOLDER  = `vtn/${namespace}/FETCH_ROOT_FOLDER`;
export const SELECTED_FOLDER  = `vtn/${namespace}/SELECTED_FOLDER`;
export const FETCH_FOLDERS  = `vtn/${namespace}/FETCH_FOLDERS`;
export const FETCH_SUB_FOLDERS  = `vtn/${namespace}/FETCH_SUB_FOLDERS`;

const defaultState = {
  selectedFolder: "",
  folderList: [],
  subFolderList: [],
  rootFolder: {}
};

export const rootFolder = (state) => {
  return get(local(state), 'rootFolder');
};

export const selectedFolder = (state) => {
  return get(local(state), 'selectedFolder');
};

export const folderList = (state) => {
  return get(local(state), 'folderList')
};


export const subFolderList = (state) => {
  return get(local(state), 'subFolderList')
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

  [FETCH_FOLDERS](state, action){
    let folders = get(action, 'payload')
    return {
      ...state,
      folderList: folders
    }
  },

  [FETCH_SUB_FOLDERS](state, action){
    let folders = get(action, 'payload')
    let previousFolders = get(state, 'subFolderList');
    let newFolders = previousFolders.concat(folders);
    newFolders = uniqWith(newFolders, isEqual)
    return {
      ...state,
      subFolderList: newFolders
    }
  }

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

      // if (!isEmpty(response.errors) && isEmpty(response.data.engines)) {
      //   throw response.errors;
      // }

      const folder = get(response, 'data.createRootFolders[0]');
      
      dispatch({
        type: FETCH_ROOT_FOLDER,
        payload: folder
      });
        
      dispatch(getAllChildFolders(folder));

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



// A function that accepts a folder object and fetches all childFolders until the records returned is
  // less than the CHILD_FOLDER_LIMIT
export function getAllChildFolders(folder) {
  const childFolders = get(folder, 'childFolders.records', []);
  const limit  = 30;
 
  return getMoreChildFolders(
    {
      folderId: folder.id,
      limit: limit,
      offset: childFolders.length
    },
    childFolders
  );
}

export function getAllSubFolders(folder) {
  const childFolders = get(folder, 'childFolders.records', []);
  const limit  = 30;
 
  return getMoreSubFolders(
    {
      folderId: folder.id,
      limit: limit,
      offset: childFolders.length
    },
    childFolders
  );
}




export function getMoreChildFolders( variables, accumulator = []) {

  return async function action(dispatch, getState) {
    //dispatch({ type: FETCH_ENGINES });

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
          
        } else {
          dispatch(getMoreChildFolders(
            {
              ...variables,
              offset: newChildFolders.length + accumulator.length
            },
            accumulator.concat(newChildFolders)
          ));
        }
    
        dispatch({
          type: FETCH_FOLDERS,
          payload: folderList,
        });
      
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

export function getMoreSubFolders( variables, accumulator = []) {

  return async function action(dispatch, getState) {

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
      console.log("this was run also")
      const res = await fetchGraphQLApi({
        endpoint: graphQLUrl,
        query,
        variables,
        token: selectSessionToken(getState()) || selectOAuthToken(getState())
      })
      const newChildFolders = get(res, 'data.folder.childFolders.records', []);
        if (get(res, 'data.folder.childFolders.count') < variables.limit) {
          folderList = accumulator.concat(newChildFolders)
          
        } else {
          dispatch(getMoreSubFolders(
            {
              ...variables,
              offset: newChildFolders.length + accumulator.length
            },
            accumulator.concat(newChildFolders)
          ));
        }

        console.log("folderList", folderList)
   
      
    
        dispatch({
          type: FETCH_SUB_FOLDERS,
          payload: folderList,
        });
      
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

