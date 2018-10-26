export const namespace = 'face-engine-output';

export const FETCH_ENTITIES = `vtn/${namespace}/FETCH_ENTITIES`;
export const FETCH_ENTITIES_SUCCESS = `vtn/${namespace}/FETCH_ENTITIES_SUCCESS`;
export const FETCH_ENTITIES_FAILURE = `vtn/${namespace}/FETCH_ENTITIES_FAILURE`;

export const FETCH_LIBRARIES = `vtn/${namespace}/FETCH_LIBRARIES`;
export const FETCH_LIBRARIES_SUCCESS = `vtn/${namespace}/FETCH_LIBRARIES_SUCCESS`;
export const FETCH_LIBRARIES_FAILURE = `vtn/${namespace}/FETCH_LIBRARIES_FAILURE`;
export const CREATE_LIBRARY = `vtn/${namespace}/CREATE_LIBRARY`;
export const CREATE_LIBRARY_SUCCESS = `vtn/${namespace}/CREATE_LIBRARY_SUCCESS`;
export const CREATE_LIBRARY_FAILURE = `vtn/${namespace}/CREATE_LIBRARY_FAILURE`;
export const FETCH_UPLOAD_URL = `vtn/${namespace}/FETCH_UPLOAD_URL`;
export const FETCH_UPLOAD_URL_SUCCESS = `vtn/${namespace}/FETCH_UPLOAD_URL_SUCCESS`;
export const FETCH_UPLOAD_URL_FAILURE = `vtn/${namespace}/FETCH_UPLOAD_URL_FAILURE`;

export const CREATE_ENTITY = `vtn/${namespace}/CREATE_ENTITY`;
export const CREATE_ENTITY_SUCCESS = `vtn/${namespace}/CREATE_ENTITY_SUCCESS`;
export const CREATE_ENTITY_FAILURE = `vtn/${namespace}/CREATE_ENTITY_FAILURE`;

export const SEARCH_ENTITIES = `vtn/${namespace}/SEARCH_ENTITIES`;
export const SEARCHING_ENTITIES = `vtn/${namespace}/SEARCHING_ENTITIES`;
export const SEARCH_ENTITIES_SUCCESS = `vtn/${namespace}/SEARCH_ENTITIES_SUCCESS`;
export const SEARCH_ENTITIES_FAILURE = `vtn/${namespace}/SEARCH_ENTITIES_FAILURE`;

export const CLOSE_ADD_ENTITY_DIALOG = `vtn/${namespace}/CLOSE_ADD_ENTITY_DIALOG`;
export const OPEN_ADD_ENTITY_DIALOG = `vtn/${namespace}/OPEN_ADD_ENTITY_DIALOG`;
export const OPEN_ADD_TO_EXISTING_ENTITY_DIALOG = `vtn/${namespace}/OPEN_ADD_TO_EXISTING_ENTITY_DIALOG`;
export const CLOSE_ADD_TO_EXISTING_ENTITY_DIALOG = `vtn/${namespace}/CLOSE_ADD_TO_EXISTING_ENTITY_DIALOG`;

export const ADD_DETECTED_FACE = `vtn/${namespace}/ADD_DETECTED_FACE`;
export const REMOVE_FACES = `vtn/${namespace}/REMOVE_FACES`;
export const CANCEL_FACE_EDITS = `vtn/${namespace}/CANCEL_FACE_EDITS`;
export const PROCESS_REMOVED_FACES = `vtn/${namespace}/PROCESS_REMOVED_FACES`;
export const PROCESS_ADDED_FACES = `vtn/${namespace}/PROCESS_ADDED_FACES`;

export const OPEN_CONFIRMATION_DIALOG = `vtn/${namespace}/OPEN_CONFIRMATION_DIALOG`;
export const CLOSE_CONFIRMATION_DIALOG = `vtn/${namespace}/CLOSE_CONFIMATION_DIALOG`;

export const FACE_EDIT_BUTTON_CLICKED = `vtn/${namespace}/FACE_EDIT_BUTTON_CLICKED`;

export const SAVE_FACE_EDITS = `vtn/${namespace}/SAVE_FACE_EDITS`;
export const SAVE_FACE_EDITS_SUCCESS = `vtn/${namespace}/SAVE_FACE_EDITS_SUCCESS`;
export const SAVE_FACE_EDITS_FAILURE = `vtn/${namespace}/SAVE_FACE_EDITS_FAILURE`;

export const CLOSE_ERROR_SNACKBAR = `vtn/${namespace}/CLOSE_ERROR_SNACKBAR`;

export const TOGGLE_EDIT_MODE = `vtn/${namespace}/TOGGLE_EDIT_MODE`;

export const SELECT_FACE_OBJECTS = `vtn/${namespace}/SELECT_FACE_OBJECTS`;
export const REMOVE_SELECTED_FACE_OBJECTS = `vtn/${namespace}/REMOVE_SELECTED_FACE_OBJECTS`;

export const SET_ACTIVE_TAB = `vtn/${namespace}/SET_ACTIVE_TAB`;

import {
  get,
  map,
  find,
  keyBy,
  isEmpty,
  flatten,
  reduce,
  cloneDeep,
  forEach,
  omit,
  uniqBy,
  differenceBy
} from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
import { createSelector } from 'reselect';
import { saveAsset, removeAwsSignatureParams } from '../../../../shared/asset';
import * as gqlQuery from './queries';

const { createReducer, callGraphQLApi } = helpers;
const { engineResults: engineResultsModule } = modules;

const defaultState = {
  entities: {},
  libraries: {},
  creatingLibrary: false,
  uploadingLibraryImage: false,
  fetchingUploadUrl: false,
  entitySearchResults: [],
  isFetchingEntities: false,
  creatingEntity: false,
  isFetchingLibraries: false,
  isSearchingEntities: false,
  facesEditedByUser: {},
  facesRemovedByUser: {},
  pendingFaceEdits: {},
  showConfirmationDialog: false,
  displayUserEdited: false,
  savingFaceEdits: false,
  editModeEnabled: false,
  error: null,
  bulkEditActionItems: {
    faceRecognition: [],
    faceDetection: []
  },
  activeTab: 'faceRecognition',
  addNewEntityDialogOpen: false,
  addToExistingEntityDialogOpen: false,
  currentlyEditedFaces: [] // selected unrecognized face objects from which to create a new 'entity'
};

const reducer = createReducer(defaultState, {
  [FETCH_ENTITIES](state, action) {
    return {
      ...state,
      isFetchingEntities: true
    };
  },
  [FETCH_ENTITIES_SUCCESS](state, action) {
    if (action.payload.errors) {
      return this[FETCH_ENTITIES_FAILURE](state, action);
    }

    const { entities } = action.payload;

    return {
      ...state,
      entities: [...state.entities, ...entities],
      isFetchingEntities: false
    };
  },
  [FETCH_ENTITIES_FAILURE](state, action) {
    return {
      ...state,
      isFetchingEntities: false
    };
  },
  [FETCH_LIBRARIES](state, action) {
    return {
      ...state,
      isFetchingLibraries: true
    };
  },
  [FETCH_LIBRARIES_SUCCESS](state, action) {
    if (action.payload.errors) {
      return this[FETCH_LIBRARIES_FAILURE](state, action);
    }

    const libraries = keyBy(get(action, 'payload.libraries.records', []), 'id');

    return {
      ...state,
      libraries: {
        ...state.libraries,
        ...libraries
      },
      isFetchingLibraries: false
    };
  },
  [FETCH_LIBRARIES_FAILURE](state, action) {
    return {
      ...state,
      isFetchingLibraries: false
    };
  },
  [CREATE_LIBRARY](state) {
    return {
      ...state,
      createNewLibrary: true
    };
  },
  [CREATE_LIBRARY_SUCCESS](
    state,
    {
      payload: { createLibrary }
    }
  ) {
    return {
      ...state,
      createNewLibrary: false,
      libraries: {
        ...state.libraries,
        [createLibrary.id]: createLibrary
      }
    };
  },
  [CREATE_LIBRARY_FAILURE](state) {
    return {
      ...state,
      createNewLibrary: false
    };
  },
  [CREATE_ENTITY](state) {
    return {
      ...state,
      creatingEntity: true
    };
  },
  [CREATE_ENTITY_SUCCESS](state, action) {
    if (action.errors) {
      return this[CREATE_ENTITY_FAILURE](state, action);
    }

    return {
      ...state,
      creatingEntity: false
    };
  },
  [CREATE_ENTITY_FAILURE](state, action) {
    return {
      ...state,
      creatingEntity: false
    };
  },
  [SEARCHING_ENTITIES](state, action) {
    return {
      ...state,
      isSearchingEntities: true
    };
  },
  [SEARCH_ENTITIES_SUCCESS](state, action) {
    if (action.payload.errors) {
      return this[SEARCH_ENTITIES_FAILURE](state, action);
    }

    const entitySearchResults = [];

    get(action.payload.data, 'libraries.records', []).forEach(
      libraryEntities => {
        if (libraryEntities.entities.records.length) {
          entitySearchResults.push(libraryEntities.entities.records);
        }
      }
    );

    return {
      ...state,
      entitySearchResults: flatten(entitySearchResults),
      isSearchingEntities: false
    };
  },
  [SEARCH_ENTITIES_FAILURE](state, action) {
    return {
      ...state,
      isSearchingEntities: false
    };
  },
  [ADD_DETECTED_FACE](state, action) {
    const { faceObjects, selectedEngineId, entity } = action.payload;

    return {
      ...state,
      pendingFaceEdits: {
        ...state.pendingFaceEdits,
        [selectedEngineId]: [
          ...(state.pendingFaceEdits[selectedEngineId] || []),
          ...faceObjects.map(face => {
            return {
              ...face,
              editAction: 'Added'
            };
          })
        ]
      },
      entities: uniqBy([...state.entities, entity], 'id')
    };
  },
  [PROCESS_ADDED_FACES](state, action) {
    const { faceObjects, selectedEngineId, entity } = action.payload;

    return {
      ...state,
      pendingFaceEdits: {
        ...state.pendingFaceEdits,
        [selectedEngineId]: state.pendingFaceEdits[selectedEngineId].filter(
          faceEdit => {
            return !find(faceObjects, { guid: faceEdit.guid });
          }
        )
      },
      facesEditedByUser: {
        ...state.facesEditedByUser,
        [selectedEngineId]: uniqBy(
          [
            ...faceObjects.map(face => ({
              ...face,
              object: {
                ...face.object,
                entityId: entity.id,
                libraryId: entity.libraryId
              }
            })),
            ...(state.facesEditedByUser[selectedEngineId] || [])
          ],
          'guid'
        )
      },
      currentlyEditedFaces: state.currentlyEditedFaces.filter(edit => {
        return !find(faceObjects, { guid: edit.guid });
      }),
      bulkEditActionItems: {
        ...state.bulkEditActionItems,
        [state.activeTab]: [
          ...differenceBy(
            state.bulkEditActionItems[state.activeTab],
            faceObjects,
            'guid'
          )
        ]
      }
    };
  },
  [REMOVE_FACES](state, action) {
    const { faceObjects, selectedEngineId } = action.payload;

    return {
      ...state,
      pendingFaceEdits: {
        ...state.pendingFaceEdits,
        [selectedEngineId]: [
          ...(state.pendingFaceEdits[selectedEngineId] || []),
          ...faceObjects.map(face => {
            return {
              ...face,
              editAction: 'Deleted'
            };
          })
        ]
      }
    };
  },
  [PROCESS_REMOVED_FACES](state, action) {
    const { faceObjects, selectedEngineId } = action.payload;

    let removedFaces = [],
      editedFaces = [];
    if (state.activeTab === 'faceDetection') {
      removedFaces = faceObjects.map(face => omit(face, ['editAction']));
    } else if (state.activeTab === 'faceRecognition') {
      editedFaces = faceObjects.map(face =>
        omit(
          {
            ...face,
            object: omit(face.object, [
              'entityId',
              'libraryId',
              'confidence',
              'label'
            ])
          },
          ['editAction']
        )
      );
    }
    return {
      ...state,
      pendingFaceEdits: {
        ...state.pendingFaceEdits,
        [selectedEngineId]: state.pendingFaceEdits[selectedEngineId].filter(
          faceEdit => {
            return !find(faceObjects, { guid: faceEdit.guid });
          }
        )
      },
      facesRemovedByUser: {
        ...state.facesRemovedByUser,
        [selectedEngineId]: [
          ...(state.facesRemovedByUser[selectedEngineId] || []),
          ...removedFaces
        ]
      },
      facesEditedByUser: {
        ...state.facesEditedByUser,
        [selectedEngineId]: uniqBy(
          [
            ...editedFaces,
            ...(state.facesEditedByUser[selectedEngineId] || [])
          ],
          'guid'
        )
      },
      bulkEditActionItems: {
        ...state.bulkEditActionItems,
        [state.activeTab]: [
          ...differenceBy(
            state.bulkEditActionItems[state.activeTab],
            faceObjects,
            'guid'
          )
        ]
      }
    };
  },
  [CANCEL_FACE_EDITS](state, action) {
    return {
      ...state,
      facesEditedByUser: {},
      facesRemovedByUser: {},
      bulkEditActionItems: {
        faceRecognition: [],
        faceDetection: []
      }
    };
  },
  [OPEN_CONFIRMATION_DIALOG](state) {
    return {
      ...state,
      showConfirmationDialog: true
    };
  },
  [CLOSE_CONFIRMATION_DIALOG](state) {
    return {
      ...state,
      showConfirmationDialog: false
    };
  },
  [SAVE_FACE_EDITS](state) {
    return {
      ...state,
      savingFaceEdits: true
    };
  },
  [SAVE_FACE_EDITS_SUCCESS](state) {
    return {
      ...state,
      error: null,
      savingFaceEdits: false,
      bulkEditActionItems: {
        faceRecognition: [],
        faceDetection: []
      }
    };
  },
  [SAVE_FACE_EDITS_FAILURE](
    state,
    {
      payload: { error }
    }
  ) {
    return {
      ...state,
      error,
      savingFaceEdits: false
    };
  },
  [CLOSE_ERROR_SNACKBAR](state) {
    return {
      ...state,
      error: null
    };
  },
  [TOGGLE_EDIT_MODE](state) {
    return {
      ...state,
      editModeEnabled: !state.editModeEnabled,
      bulkEditActionItems: {
        faceRecognition: [],
        faceDetection: []
      }
    };
  },
  [SELECT_FACE_OBJECTS](
    state,
    {
      payload: { activeTab, faces }
    }
  ) {
    return {
      ...state,
      bulkEditActionItems: {
        ...state.bulkEditActionItems,
        [state.activeTab]: [
          ...state.bulkEditActionItems[state.activeTab],
          ...faces
        ]
      }
    };
  },
  [REMOVE_SELECTED_FACE_OBJECTS](
    state,
    {
      payload: { faces }
    }
  ) {
    return {
      ...state,
      bulkEditActionItems: {
        ...state.bulkEditActionItems,
        [state.activeTab]: [
          ...differenceBy(
            state.bulkEditActionItems[state.activeTab],
            faces,
            'guid'
          )
        ]
      }
    };
  },
  [SET_ACTIVE_TAB](
    state,
    {
      payload: { activeTab }
    }
  ) {
    return {
      ...state,
      activeTab
    };
  },
  [OPEN_ADD_ENTITY_DIALOG](
    state,
    {
      payload: { faces }
    }
  ) {
    return {
      ...state,
      addNewEntityDialogOpen: true,
      currentlyEditedFaces: [...faces]
    };
  },
  [CLOSE_ADD_ENTITY_DIALOG](state) {
    return {
      ...state,
      addNewEntityDialogOpen: false,
      currentlyEditedFaces: []
    };
  },
  [OPEN_ADD_TO_EXISTING_ENTITY_DIALOG](
    state,
    {
      payload: { faces }
    }
  ) {
    return {
      ...state,
      addToExistingEntityDialogOpen: true,
      currentlyEditedFaces: [...faces]
    };
  },
  [CLOSE_ADD_TO_EXISTING_ENTITY_DIALOG](state) {
    return {
      ...state,
      addToExistingEntityDialogOpen: false,
      currentlyEditedFaces: []
    };
  }
});
export default reducer;

function local(state) {
  return state[namespace];
}

export const getFaceDataByEngine = (state, engineId, tdoId) => {
  return engineResultsModule.engineResultsByEngineId(state, tdoId, engineId);
};

export const getUserEditedFaces = (state, engineId) =>
  get(local(state), ['facesEditedByUser', engineId]);

export const getUserRemovedFaces = (state, engineId) =>
  get(local(state), ['facesRemovedByUser', engineId]);

export const getPendingFaceEdits = (state, engineId) =>
  get(local(state), ['pendingFaceEdits', engineId]);

export const getSavingFaceEdits = state => get(local(state), 'savingFaceEdits');

export const pendingUserEdits = (state, engineId) =>
  !isEmpty(getUserEditedFaces(state, engineId)) ||
  !isEmpty(getUserRemovedFaces(state, engineId));

export const getError = state => get(local(state), 'error');
export const getEditModeEnabled = state => get(local(state), 'editModeEnabled');

export const closeErrorSnackbar = () => ({
  type: CLOSE_ERROR_SNACKBAR
});

export const toggleEditMode = () => ({
  type: TOGGLE_EDIT_MODE
});

export const getActiveTab = state => get(local(state), 'activeTab');
export const setActiveTab = activeTab => ({
  type: SET_ACTIVE_TAB,
  payload: {
    activeTab
  }
});

/* BULK FACE EDITS */
export const getBulkEditActionItems = state =>
  get(local(state), 'bulkEditActionItems');

export const selectFaceObjects = faces => ({
  type: SELECT_FACE_OBJECTS,
  payload: {
    faces
  }
});

export const removeSelectedFaceObjects = faces => ({
  type: REMOVE_SELECTED_FACE_OBJECTS,
  payload: {
    faces
  }
});

/* ENTITIES */
export const fetchingEntities = meta => ({
  type: FETCH_ENTITIES,
  meta
});
export const fetchEntitiesSuccess = (payload, meta) => ({
  type: FETCH_ENTITIES_SUCCESS,
  payload: {
    entities: get(payload, 'entities.records', [])
  },
  meta
});
export const fetchEntitiesFailure = (error, meta) => ({
  type: FETCH_ENTITIES_FAILURE,
  error,
  meta
});

export const fetchingEntitySearchResults = () => ({
  type: SEARCHING_ENTITIES
});
export const fetchEntitySearchResults = (libraryType, searchText) => ({
  type: SEARCH_ENTITIES,
  payload: {
    libraryType,
    searchText
  }
});
export const fetchEntitySearchResultsSuccess = (payload, meta) => ({
  type: SEARCH_ENTITIES_SUCCESS,
  payload,
  meta
});
export const fetchEntitySearchResultsFailure = (payload, meta) => ({
  type: SEARCH_ENTITIES_FAILURE,
  payload,
  meta
});
export const openAddEntityDialog = faces => {
  return {
    type: OPEN_ADD_ENTITY_DIALOG,
    payload: {
      faces
    }
  };
};
export const closeAddEntityDialog = () => ({
  type: CLOSE_ADD_ENTITY_DIALOG
});

export const openAddToExistingEntityDialog = faces => {
  return {
    type: OPEN_ADD_TO_EXISTING_ENTITY_DIALOG,
    payload: {
      faces
    }
  };
};
export const closeAddToExistingEntityDialog = () => ({
  type: CLOSE_ADD_TO_EXISTING_ENTITY_DIALOG
});

export function isFetchingEntities(state) {
  return local(state).isFetchingEntities;
}

export function isSearchingEntities(state) {
  return local(state).isSearchingEntities;
}

export const getEntities = state =>
  Object.values(get(local(state), 'entities', []));

export function getEntitySearchResults(state) {
  return get(local(state), 'entitySearchResults', []);
}

export const getAddNewEntityDialogOpen = state =>
  get(local(state), 'addNewEntityDialogOpen');

export const getAddToExistingEntityDialogOpen = state =>
  get(local(state), 'addToExistingEntityDialogOpen');

export const getCurrentlyEditedFaces = state =>
  get(local(state), 'currentlyEditedFaces');

export const createEntity = input => async (dispatch, getState) => {
  return await callGraphQLApi({
    actionTypes: [CREATE_ENTITY, CREATE_ENTITY_SUCCESS, CREATE_ENTITY_FAILURE],
    query: gqlQuery.createEntity,
    variables: { input },
    dispatch,
    getState
  });
};

/* LIBRARIES */
export function isFetchingLibraries(state) {
  return local(state).isFetchingLibraries;
}

export function getLibraries(state) {
  return Object.values(local(state).libraries);
}

export const fetchLibraries = ({ libraryType }) => async (
  dispatch,
  getState
) => {
  return await callGraphQLApi({
    actionTypes: [
      FETCH_LIBRARIES,
      FETCH_LIBRARIES_SUCCESS,
      FETCH_LIBRARIES_FAILURE
    ],
    query: gqlQuery.getLibrariesByType,
    variables: { libraryType },
    dispatch,
    getState
  });
};

const uploadCoverImage = (url, file) => {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject('Error uploading image');
      }
    });
    xhr.addEventListener('error', () => {
      reject('Error uploading image');
    });
    xhr.open('PUT', url);
    xhr.send(file);
  });
};

export const createNewLibrary = ({
  libraryName,
  libraryTypeId,
  coverImage,
  description
}) => async (dispatch, getState) => {
  let signedImageUrl;
  if (coverImage) {
    const getSignedWriteableUrlQuery = `
      query {
        getSignedWritableUrl {
          url
          key
          bucket
          expiresInSeconds
          getUrl
          unsignedUrl
        }
      }
    `;
    let signedUrlResponse;
    try {
      signedUrlResponse = await callGraphQLApi({
        actionTypes: [
          FETCH_UPLOAD_URL,
          FETCH_UPLOAD_URL_SUCCESS,
          FETCH_UPLOAD_URL_FAILURE
        ],
        query: getSignedWriteableUrlQuery,
        dispatch,
        getState
      });
    } catch (e) {
      dispatch({
        type: CREATE_LIBRARY_FAILURE,
        payload: {
          error: 'Could not get url to upload image.'
        }
      });
      return Promise.reject('Could not get url to upload image.');
    }

    try {
      await uploadCoverImage(
        get(signedUrlResponse, 'getSignedWritableUrl.url'),
        coverImage
      ).then(res => {
        //TODO: sending an unsigned url doesn't work
        signedImageUrl = get(signedUrlResponse, 'getSignedWritableUrl.getUrl');
        return res;
      });
    } catch (e) {
      dispatch({
        type: CREATE_LIBRARY_FAILURE,
        payload: {
          error: 'Could not upload cover image.'
        }
      });
      return Promise.reject('Could not upload cover image.');
    }
  }

  return await callGraphQLApi({
    actionTypes: [
      CREATE_LIBRARY,
      CREATE_LIBRARY_SUCCESS,
      CREATE_LIBRARY_FAILURE
    ],
    query: gqlQuery.createLibrary,
    variables: {
      input: {
        name: libraryName,
        libraryTypeId,
        description,
        coverImageUrl: signedImageUrl
      }
    },
    dispatch,
    getState
  });
};

/* USER DETECTED FACES */
export const addDetectedFace = (selectedEngineId, faceObjects, entity) => ({
  type: ADD_DETECTED_FACE,
  payload: {
    selectedEngineId,
    faceObjects,
    entity
  }
});

export const removeFaces = (selectedEngineId, faceObjects) => ({
  type: REMOVE_FACES,
  payload: {
    selectedEngineId,
    faceObjects
  }
});

export const processRemovedFaces = (selectedEngineId, faceObjects) => ({
  type: PROCESS_REMOVED_FACES,
  payload: {
    selectedEngineId,
    faceObjects
  }
});

export const processAddedFaces = (selectedEngineId, faceObjects, entity) => ({
  type: PROCESS_ADDED_FACES,
  payload: {
    selectedEngineId,
    faceObjects,
    entity
  }
});

export const cancelFaceEdits = () => ({
  type: CANCEL_FACE_EDITS
});

/* CONFIRMATION DIALOG */
export const openConfirmationDialog = () => {
  return {
    type: OPEN_CONFIRMATION_DIALOG
  };
};

export const closeConfirmationDialog = () => ({
  type: CLOSE_CONFIRMATION_DIALOG
});

export const editFaceButtonClick = () => {
  return {
    type: FACE_EDIT_BUTTON_CLICKED
  };
};

export const showConfirmationDialog = state =>
  get(local(state), 'showConfirmationDialog');

/* SELECTORS */
export const getFaces = createSelector(
  [
    getFaceDataByEngine,
    getUserEditedFaces,
    getUserRemovedFaces,
    getEntities,
    getPendingFaceEdits
  ],
  (
    faceData,
    userDetectedFaces,
    userRemovedFaces,
    entities,
    pendingFaceEdits
  ) => {
    const faceEntities = {
      unrecognizedFaces: [],
      recognizedFaces: {}
    };

    // flatten data series for currently selected engine
    const faceSeries = addUserDetectedFaces(
      faceData,
      userDetectedFaces,
      userRemovedFaces,
      pendingFaceEdits
    ).reduce((accumulator, faceSeries) => {
      if (!isEmpty(faceSeries.series)) {
        return [...accumulator, ...faceSeries.series];
      }
      return accumulator;
    }, []);

    faceSeries.forEach(faceObj => {
      // for each face object
      // locate entity that the face object belongs to
      const entity = find(entities, { id: faceObj.object.entityId });

      if (
        !faceObj.object.entityId ||
        !entities.length ||
        !entity ||
        !entity.name
      ) {
        // face not recognized
        faceEntities.unrecognizedFaces.push(faceObj);
      } else if (faceEntities.recognizedFaces[faceObj.object.entityId]) {
        faceEntities.recognizedFaces[faceObj.object.entityId].push(faceObj);
      } else {
        faceEntities.recognizedFaces[faceObj.object.entityId] = [faceObj];
      }
    });

    return faceEntities;
  }
);

/* HELPERS */
export const getFaceEngineAssetData = (state, tdoId, engineId) => {
  const engineResults = cloneDeep(getFaceDataByEngine(state, engineId, tdoId));
  const userDetectedFaces =
    cloneDeep(getUserEditedFaces(state, engineId)) || [];
  const userRemovedFaces =
    cloneDeep(getUserRemovedFaces(state, engineId)) || [];

  const allJsonData = addUserDetectedFaces(
    engineResults,
    userDetectedFaces,
    userRemovedFaces
  ).reduce((accumulator, engineResult) => {
    const userEdited = {};
    if (engineResult.sourceEngineName) {
      userEdited.sourceEngineName = engineResult.sourceEngineName;
    }
    return [
      ...accumulator,
      {
        ...userEdited,
        ...engineResult
      }
    ];
  }, []);

  return allJsonData;
};

function addUserDetectedFaces(
  engineResults,
  userDetectedFaces,
  userRemovedFaces,
  pendingFaceEdits = []
) {
  return map(engineResults, data => ({
    taskId: data.taskId,
    assetId: data.assetId,
    sourceEngineId: data.sourceEngineId,
    series: reduce(
      data.series,
      (accumulator, originalFaceObj) => {
        if (find(userRemovedFaces, { guid: originalFaceObj.guid })) {
          return accumulator;
        }
        return [
          ...accumulator,
          find(pendingFaceEdits, { guid: originalFaceObj.guid }) ||
            find(userDetectedFaces, { guid: originalFaceObj.guid }) ||
            originalFaceObj
        ];
      },
      []
    )
  }));
}

export const saveFaceEdits = (tdoId, selectedEngineId) => {
  return async function action(dispatch, getState) {
    dispatch({
      type: SAVE_FACE_EDITS
    });
    const assetData = getFaceEngineAssetData(
      getState(),
      tdoId,
      selectedEngineId
    );
    const contentType = 'application/json';
    const type = 'vtn-standard';
    const createAssetCalls = [];
    forEach(assetData, jsonData => {
      if (get(jsonData, 'series.length')) {
        forEach(jsonData.series, asset => {
          if (get(asset, 'object.uri')) {
            asset.object.uri = removeAwsSignatureParams(
              get(asset, 'object.uri')
            );
          }
          delete asset.guid;
        });
      }
      // process vtn-standard asset
      const sourceData = {
        name: jsonData.sourceEngineName,
        engineId: jsonData.sourceEngineId,
        assetId: jsonData.assetId,
        taskId: jsonData.taskId
      };
      createAssetCalls.push(
        saveAsset(
          {
            tdoId,
            contentType,
            type,
            sourceData,
            isUserEdited: true
          },
          jsonData,
          dispatch,
          getState
        )
      );
    });
    return await Promise.all(createAssetCalls)
      .then(values => {
        dispatch({
          type: SAVE_FACE_EDITS_SUCCESS
        });
        return values;
      })
      .catch(() => {
        dispatch({
          type: SAVE_FACE_EDITS_FAILURE,
          payload: {
            error: 'Failed to save face edits.'
          }
        });
      });
  };
};
