import { get } from 'lodash';
import { helpers } from 'veritone-redux-common';

const { callGraphQLApi } = helpers;

export const namespace = 'veritoneDatasetLibrary';

export const INITIALIZE_WIDGET = `${namespace}::INITIALIZE_WIDGET`;

export const RESET_LIBRARIES = `${namespace}::RESET_LIBRARIES`;
export const LOAD_LIBRARIES = `${namespace}::LOAD_LIBRARIES`;
export const LOAD_LIBRARIES_FAILURE = `${namespace}::LOAD_LIBRARIES_FAILURE`;
export const LOAD_LIBRARIES_COMPLETE = `${namespace}::LOAD_LIBRARIES_COMPLETE`;

export const LOAD_LIBRARY_TYPES = `${namespace}::LOAD_LIBRARY_TYPES`;
export const LOAD_LIBRARY_TYPES_FAILURE = `${namespace}::LOAD_LIBRARY_TYPES_FAILURE`;
export const LOAD_LIBRARY_TYPES_COMPLETE = `${namespace}::LOAD_LIBRARY_TYPES_COMPLETE`;


export const CREATE_LIBRARY = `${namespace}::CREATE_LIBRARY`;
export const CREATE_LIBRARY_FAILURE = `${namespace}::CREATE_LIBRARY_FAILURE`;
export const CREATE_LIBRARY_COMPLETE = `${namespace}::CREATE_LIBRARY_COMPLETE`;

export const RESET_TDOS = `${namespace}::RESET_TDOS`;
export const ADD_TDOS = `${namespace}::ADD_TDOS`;
export const ADD_TDOS_FAILURE = `${namespace}::ADD_TDOS_FAILURE`;
export const ADD_TDOS_COMPLETE = `${namespace}::ADD_TDOS_COMPLETE`;

export const GET_UPLOAD_URL = `${namespace}::GET_UPLOAD_URL`;
export const GET_UPLOAD_URL_COMPLETE = `${namespace}::GET_UPLOAD_URL_COMPLETE`;
export const GET_UPLOAD_URL_FAILURE = `${namespace}::GET_UPLOAD_URL_FAILURE`;

//----Init Action----
export const initializeWidget = () => ({
  type: INITIALIZE_WIDGET
});

//----TDO Actions----
export const resetTdos = () => ({
  type: RESET_TDOS
});

export const addTdos = (tdoIds, libraryId) => async(dispatch, getState) => {
  const query = `
  mutation ($tdoIds: [ID]!, $libraryId: ID!){
    addTdosToLibrary(
      tdoIds: $tdoIds
      libraryId: $libraryId
    ) {
      libraryId,
      tdoIds
    }
  }`;

  return await callGraphQLApi({
    actionTypes: [
      ADD_TDOS,
      ADD_TDOS_COMPLETE,
      ADD_TDOS_FAILURE
    ],
    query,
    variables: {
      tdoIds: tdoIds,
      libraryId: libraryId
    },
    dispatch,
    getState
  });
};

//----Library Type Actions----
export const loadLibraryTypes = () => async (dispatch, getState) => {
  const query = `
  {
    libraryTypes {
      records {
        id
        label
      }
    }
  }`;

  return await callGraphQLApi({
    actionTypes: [
      LOAD_LIBRARY_TYPES,
      LOAD_LIBRARY_TYPES_COMPLETE,
      LOAD_LIBRARY_TYPES_FAILURE
    ],
    query,
    dispatch,
    getState
  });
};

//----Library Actions----
export const resetLibraries = () => ({
  type: RESET_LIBRARIES
});

export const loadLibraries = () => async (dispatch, getState) => {
  const query = `
  {
    libraries(includeOwnedOnly: true, type: "dataset") {
      records {
        id
        name
      }
    }
  }`;

  return await callGraphQLApi({
    actionTypes: [
      LOAD_LIBRARIES,
      LOAD_LIBRARIES_COMPLETE,
      LOAD_LIBRARIES_FAILURE
    ],
    query,
    dispatch,
    getState
  });
};

export const createLibrary = (name, libraryTypeId, description, coverImage) => async (dispatch, getState) => {
  //----Get Upload URL----
  const getUploadUrlQuery = `query urls($name: String!){
    getSignedWritableUrl(key: $name) {
      url
      getUrl
    }
  }`;

  const signedUrlResponse = await callGraphQLApi({
    actionTypes: [
      GET_UPLOAD_URL,
      GET_UPLOAD_URL_COMPLETE,
      GET_UPLOAD_URL_FAILURE
    ],
    query: getUploadUrlQuery,
    variables: {
      name: coverImage.name
    },
    dispatch,
    getState
  });

  const { url, getUrl } = get(signedUrlResponse, 'getSignedWritableUrl');
  if (!url || !getUrl) {
    return {
      type: CREATE_LIBRARY_FAILURE,
      payload: 'fail to retrieve signed writable URL'
    } 
  }

  //----Upload Cover Image to S3----
  const uploadStatus = await fetch(url, {
    method: 'PUT',
    body: coverImage
  });

  const { ok, status } = uploadStatus;
  if (!ok || status !== 200) {
    return {
      type: CREATE_LIBRARY_FAILURE,
      payload: 'Fail to upload cover image'
    } 
  }

  //----Create New Library----
  const query = `
  mutation ($input: CreateLibrary!) {
    createLibrary(input: $input){
      id
      name
    }
  }`;
  return await callGraphQLApi({
    actionTypes: [
      CREATE_LIBRARY,
      CREATE_LIBRARY_COMPLETE,
      CREATE_LIBRARY_FAILURE
    ],
    query,
    variables: {
      input: {
        name: name,
        libraryTypeId: libraryTypeId,
        description: description,
        coverImageUrl: getUrl
      }
    },
    dispatch,
    getState
  });
};
