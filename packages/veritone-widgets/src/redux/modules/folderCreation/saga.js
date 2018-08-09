import { fork, call, all, takeEvery, put, select } from 'redux-saga/effects';
import { get, has } from 'lodash';

import callGraphQLApi from '../../../shared/callGraphQLApi';
import * as Actions from './actionCreators';
import { modules } from 'veritone-redux-common';
const { auth: authModule, config: configModule } = modules;

let token;
let graphQLUrl;
function* callGraphQL (query, variables) {
  if (!token || !graphQLUrl) {
    const config = yield select(configModule.getConfig);
    const { apiRoot, graphQLEndpoint } = config;
    graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
    token = yield select(authModule.selectSessionToken);
  }

  let data;
  let error;
  try {
    const response = yield call(callGraphQLApi, {
      token: token,
      endpoint: graphQLUrl,
      query: query,
      variables: variables
    });

    if (response) {
      data = response.data;
      error = response.error;
    } else {
      error = 'unknown error: graphQL returns null';
    }
  } catch (e) {
    error = e;
  }

  return {data: data, error: error}
}

//--------Load Content Template Schemas--------
function* loadSchemas () {
  const loadSchemasQuery = `
  query {
    dataRegistries(filterByOwnership:mine) {
      records {
        name
        schemas (status:published) {
          records {
            id
            definition
          }
        }
      }
    }
  }`;
  
  let data;
  const response = yield* callGraphQL(loadSchemasQuery);
  if (!response.error) {
    const dataRecords = get(response, 'data.dataRegistries.records');
    if (dataRecords) {
      data = dataRecords.reduce((accumulator, value) => {
        value.schemas.records.forEach(schema => {
          if (has(schema.definition, 'properties')) {
            accumulator[schema.id] = {
              name: value.name,
              ...schema
            };
          }
        });
        return accumulator;
      }, {});
    } else {
      data = {};
    }
  } else {
    data = response.data
  }

  yield put(Actions.loadSchemasComplete(data, response.error));
}

function* watchSchemasLoadingRequest () {
  yield takeEvery(Actions.LOAD_SCHEMAS, function*(action) {
    yield call(loadSchemas, action.playload);
  });
}

//--------Load Folder Info--------
function* loadFolderInfo (folderId) {
  const loadFolderQuery = `
  query ($folderId: ID!) {
    folder(id: $folderId) {
      id
      name
      description
      orderIndex
      parent {
        id
        name
      }
      contentTemplates {
        id
        schemaId
        data
        sdo {
          id
          schemaId
          data
        }
      }
    }
  }`;

  const response = yield* callGraphQL(loadFolderQuery, {folderId: folderId});
  yield put(Actions.loadFolderComplete(response.data, response.error));
}

function* watchFolderLoadingRequest () {
  yield takeEvery(Actions.LOAD_FOLDER, function*(action) {
    yield call(loadFolderInfo, action.payload);
  });
}

//--------Create New Folder--------
function* createFolder (rootFolderType, parentId, name, description, orderIndex, sdoId, schemaId) {
  const createFolderQuery = `
  mutation ($rootFolderType: RootFolderType, $parentId: ID!, $name: String!, $description: String!, $orderIndex: Int) {
    createFolder(input: {parentId: $parentId, name: $name, description: $description, orderIndex: $orderIndex, rootFolderType: $rootFolderType}) {
      id
      name
      description
      orderIndex
      parent {
        id
        name
      }
    }
  }`;

  let folderVariables = {
    name: name,
    description: description,
    orderIndex: orderIndex,
    parentId: parentId,
    rootFolderType: rootFolderType
  }
  const response = yield* callGraphQL(createFolderQuery, folderVariables);
  yield put(Actions.createFolderComplete(response.data, response.error));
  if (!response.error) {
    //yield* createContentTemplate(sdoId, schemaId)
  }
}

function* watchCreateFolderRequest () {
  yield takeEvery(Actions.CREATE_FOLDER, function* (action) {
    yield call(createFolder, action.playload);
  });
}

//--------Update Existing Folder--------
function* updateFolder (folderId, folderName, folderDescription) {
  const updateFolderQuery = `
  mutation ($folderId: ID!, $folderName: String!) {
    updateFolder(input: {id: $folderId, name: $folderName}) {
      id
      name
      description
    }
  }`;

  //TODO: currently graphQL doesn't handle folder's description

  const folderVariables = {
    folderId: folderId,
    folderName: folderName
  };
  const response = yield* callGraphQL(updateFolderQuery, folderVariables);
  yield put(Actions.updateFolderComplete(response.data, response.error));
}

function* watchUpdateFolderRequest () {
  yield takeEvery(Actions.UPDATE_FOLDER, function* (action) {
    yield call(updateFolder,  action.playload);
  });
}

//--------Create New Content Template--------
function* createContentTemplate (folderId, sdoId, schemaId, data) {
  //TODO: GraphQL does not fully support "data" option
  const createContentTemplateQuery = `
  mutation ($folderId: ID!, $sdoId: ID!, $schemaId: ID!) {
    createFolderContentTempate(input: {folderId: $folderId, sdoId: $sdoId, schemaId: $schemaId}) {
      id
      folderId
      schemaId
      sdo {
        id
        data
        schemaId
      }
    }
  }`;

  const templateVariables = {
    folderId: folderId,
    sdoId: sdoId,
    schemaId: schemaId
  };
  const response = yield* callGraphQL(createContentTemplateQuery, templateVariables);
  yield put(Actions.createFolderComplete(response.data, response.error));
}

function* watchCreateContentTemplateRequest () {
  yield takeEvery(Actions.CREATE_CONTENT_TEMPLATE, function* (action) {
    yield call(createContentTemplate, action.playload);
  });
}

//--------Update Existing Content Template--------
function* updateContentTemplate (templateId, folderId, sdoId, schemaId, data) {
  //TODO: GraphQL does not fully support "data" option
  const updateContentTemplateQuery = `
  mutation ($templateId: ID!, $folderId: ID!, $sdoId: ID!, $schemaId: ID!) {
    updateFolderContentTempate(input: {id: $templateId, folderId: $folderId, sdoId: $sdoId, schemaId: $schemaId}) {
      id
      folderId
      schemaId
      sdo {
        id
        schemaId
        data
      }
    }
  }`;

  const templateVariables = {
    templateId: templateId,
    folderId: folderId,
    sdoId: sdoId,
    schemaId: schemaId
  };
  const response = yield* callGraphQL(updateContentTemplateQuery, templateVariables);
  yield put(Actions.updateContentTemplateComplete(response.data, response.error));
}

function* watchUpdateContentTemplateRequest () {
  yield takeEvery(Actions.UPDATE_CONTENT_TEMPLATE, function* (action) {
    yield call(updateContentTemplate, action.playload);
  });
}


export default function* root() {
  yield all([
    fork(watchSchemasLoadingRequest),
    fork(watchFolderLoadingRequest),
    fork(watchCreateFolderRequest),
    fork(watchUpdateFolderRequest),
    fork(watchCreateContentTemplateRequest),
    fork(watchUpdateContentTemplateRequest)
  ]);
}
