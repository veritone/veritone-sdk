import { clamp } from 'lodash';
export const namespace = 'uploadFile';
export const PICK_START = `${namespace}_PICK_START`;
export const PICK_END = `${namespace}_PICK_END`;
export const RETRY_REQUEST = `${namespace}_RETRY_REQUEST`;
export const RETRY_DONE = `${namespace}_RETRY_DONE`;
export const ABORT_REQUEST = `${namespace}_ABORT_REQUEST`;
export const UPLOAD_REQUEST = `${namespace}_UPLOAD_REQUEST`;
export const UPLOAD_PROGRESS = `${namespace}_UPLOAD_PROGRESS`;
export const UPLOAD_COMPLETE = `${namespace}_UPLOAD_COMPLETE`;
export const CLEAR_FILEPICKER_DATA = `${namespace}_CLEAR_FILEPICKER_DATA`;
export const ON_SELECTION_CHANGE = `${namespace}_ON_SELECTION_CHANGE`;
export const REMOVE_FILE_UPLOAD = `${namespace}_REMOVE_FILE_UPLOAD`;
export const SHOW_EDIT_FILE_UPLOAD = `${namespace}_SHOW_EDIT_FILE_UPLOAD`;
export const HIDE_EDIT_FILE_UPLOAD = `${namespace}_HIDE_EDIT_FILE_UPLOAD`;
export const FETCH_ENGINE_CATEGORIES_REQUEST = `${namespace}_FETCH_ENGINE_CATEGORIES_REQUEST`;
export const FETCH_ENGINE_CATEGORIES_SUCCESS = `${namespace}_FETCH_ENGINE_CATEGORIES_SUCCESS`;
export const FETCH_ENGINE_CATEGORIES_FAILURE = `${namespace}_FETCH_ENGINE_CATEGORIES_FAILURE`;
export const FETCH_LIBRARIES_REQUEST = `${namespace}_FETCH_LIBRARIES_REQUEST`;
export const FETCH_LIBRARIES_SUCCESS = `${namespace}_FETCH_LIBRARIES_SUCCESS`;
export const FETCH_LIBRARIES_FAILURE = `${namespace}_FETCH_LIBRARIES_FAILURE`;
export const FETCH_ENGINES_REQUEST = `${namespace}_FETCH_ENGINES_REQUEST`;
export const FETCH_ENGINES_SUCCESS = `${namespace}_FETCH_ENGINES_SUCCESS`;
export const FETCH_ENGINES_FAILURE = `${namespace}_FETCH_ENGINES_FAILURE`;
export const ADD_ENGINE = `${namespace}_ADD_ENGINE`;
export const REMOVE_ENGINE = `${namespace}_REMOVE_ENGINE`;
export const CHANGE_ENGINE = `${namespace}_CHANGE_ENGINE`;
export const CATEGORY_IDS_TO_EXCLUDE = [
    '4fef6040-3fb6-4757-9aae-4044e8b46bc9', // Search
    '4be1a1b2-653d-4eaa-ba18-747a265305d8', // Ingestion
    'c1e5f177-ca10-433a-a155-bb5e4872cf9a', // Intercategory
    '925e8039-5246-4ced-9f2b-b456d0b57ea1', // Intracategory
    '988c1bbe-a537-46b5-80ce-415f39cc0e4d', // Media Aggregator
    'ffd8b41b-b28d-48fb-8acd-df0fdfd085b0', // Output Aggregator
    '4b150c85-82d0-4a18-b7fb-63e4a58dfcce', // Media (Pull)
    '0b10da6b-3485-496c-a2cb-aabf59a6352d', // Media (Push)
    'f951fbf9-aa69-47a2-87c8-12dfb51a1f18' // Cognition Utility
  ];
export const pick = id => ({
    type: PICK_START,
    meta: { id }
});

export const endPick = (id, type) => ({
    type: PICK_END,
    payload: { type },
    meta: { id }
});

export const retryRequest = (id, callback) => ({
    type: RETRY_REQUEST,
    payload: { callback },
    meta: { id }
});

export const abortRequest = (id, fileKey) => ({
    type: ABORT_REQUEST,
    meta: { id, fileKey }
});

export const retryDone = (id, callback) => ({
    type: RETRY_DONE,
    payload: { callback },
    meta: { id }
});

export const uploadRequest = (id, files, callback) => ({
    type: UPLOAD_REQUEST,
    payload: { files, callback },
    meta: { id }
});

export const uploadProgress = (id, fileKey, data, percent) => ({
    type: UPLOAD_PROGRESS,
    payload: {
        ...data,
        percent: clamp(Math.round(data.percent), 100)
    },
    meta: { fileKey, id }
});

export const uploadComplete = (id, result, { warning, error }) => ({
    type: UPLOAD_COMPLETE,
    payload: result,
    meta: { warning, error, id }
});

export const onSelectionChange = (id, value, type) => ({
    type: ON_SELECTION_CHANGE,
    payload: { id, value, type }
})

export const removeFileUpload = (id, value) => ({
    type: REMOVE_FILE_UPLOAD,
    payload: { id, value }
})

export const showEditFileUpload = id => ({
    type: SHOW_EDIT_FILE_UPLOAD,
    payload: { id }
})

export const hideEditFileUpload = id => ({
    type: HIDE_EDIT_FILE_UPLOAD,
    payload: { id }
})

export const fetchEngineCategories = id => ({
    type: FETCH_ENGINE_CATEGORIES_REQUEST,
    meta: { id }
})
export const fetchEngineCategoriesSuccess = (id, engineCategories) => ({
    type: FETCH_ENGINE_CATEGORIES_SUCCESS,
    payload: { id, engineCategories }
})
export const fetchEngineCategoriesFailure = id => ({
    type: FETCH_ENGINE_CATEGORIES_FAILURE,
    payload: { id }
})

export const fetchLibraries = id => ({
    type: FETCH_LIBRARIES_REQUEST,
    meta: { id }
})
export const fetchLibrariesSuccess = (id, libraries) => ({
    type: FETCH_LIBRARIES_SUCCESS,
    payload: { id, libraries }
})
export const fetchLibrariesFailure = id => ({
    type: FETCH_LIBRARIES_FAILURE,
    payload: { id }
})

export const fetchEngines = id => ({
    type: FETCH_ENGINES_REQUEST,
    meta: { id }
})
export const fetchEnginesSuccess = (id, engines) => ({
    type: FETCH_ENGINES_SUCCESS,
    payload: { id, engines }
})
export const fetchEnginesFailure = id => ({
    type: FETCH_ENGINES_FAILURE,
    payload: { id }
})

export const addEngine = (id, engineId) => ({
    type: ADD_ENGINE,
    payload: { id, engineId }
})

export const onChangeEngine = (id, engineId) => ({
    type: CHANGE_ENGINE,
    payload: { id, engineId }
})

export const removeEngine = (id, engineId) => ({
    type: REMOVE_ENGINE,
    payload: { id, engineId }
})