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
export const SHOW_MODAL_SAVE_TEMPLATE = `${namespace}_SHOW_MODAL_SAVE_TEMPLATE`;
export const HIDE_MODAL_SAVE_TEMPLATE = `${namespace}_HIDE_MODAL_SAVE_TEMPLATE`;
export const SAVE_TEMPLATE_REQUEST = `${namespace}_SAVE_TEMPLATE_REQUEST`;
export const SAVE_TEMPLATE_SUCCESS = `${namespace}_SAVE_TEMPLATE_SUCCESS`;
export const SAVE_TEMPLATE_FAILURE = `${namespace}_SAVE_TEMPLATE_FAILURE`;
export const FETCH_TEMPLATES_SUCCESS = `${namespace}_FETCH_TEMPLATES_SUCCESS`;
export const FETCH_TEMPLATES_FAILURE = `${namespace}_FETCH_TEMPLATES_FAILURE`;
export const CHANGE_TEMPLATE = `${namespace}_CHANGE_TEMPLATE`;
export const ON_CLICK_ENGINE_CATEGORY = `${namespace}_ON_CLICK_ENGINE_CATEGORY`;
export const FETCH_CONTENT_TEMPLATES_REQUEST = `${namespace}_FETCH_CONTENT_TEMPLATES_REQUEST`;
export const FETCH_CONTENT_TEMPLATES_SUCCESS = `${namespace}_FETCH_CONTENT_TEMPLATES_SUCCESS`;
export const FETCH_CONTENT_TEMPLATES_FAILURE = `${namespace}_FETCH_CONTENT_TEMPLATES_FAILURE`;
export const ADD_CONTENT_TEMPLATE = `${namespace}_ADD_CONTENT_TEMPLATE`;
export const REMOVE_CONTENT_TEMPLATE = `${namespace}_REMOVE_CONTENT_TEMPLATE`;
export const ON_CHANGE_FORM_CONTENT_TEMPLATE = `${namespace}_ON_CHANGE_FORM_CONTENT_TEMPLATE`;
export const SELECT_FOLDER = `${namespace}_SELECT_FOLDER`;
export const ADD_TAGS_CUSTOMIZE = `${namespace}_ADD_TAGS_CUSTOMIZE`;
export const REMOVE_TAGS_CUSTOMIZE = `${namespace}_REMOVE_TAGS_CUSTOMIZE`;
export const FETCH_CREATE_TDO_REQUEST = `${namespace}_FETCH_CREATE_TDO_REQUEST`;
export const FETCH_CREATE_TDO_SUCCESS = `${namespace}_FETCH_CREATE_TDO_SUCCESS`;
export const FETCH_CREATE_TDO_FAILURE = `${namespace}_FETCH_CREATE_TDO_FAILURE`;
export const FETCH_CREATE_JOB_REQUEST = `${namespace}_FETCH_CREATE_JOB_REQUEST`;
export const FETCH_CREATE_JOB_SUCCESS = `${namespace}_FETCH_CREATE_JOB_SUCCESS`;
export const FETCH_CREATE_JOB_FAILURE = `${namespace}_FETCH_CREATE_JOB_FAILURE`;
export const ON_CHANGE_LIBRARIES = `${namespace}_ON_CHANGE_LIBRARIES`;
export const ON_CHANGE_FORM_ENGINE_SELECTED = `${namespace}_ON_CHANGE_FORM_ENGINE_SELECTED`;
export const ON_CHANGE_LIBRARIES_ENGINE_SELECTED = `${namespace}_ON_CHANGE_LIBRARIES_ENGINE_SELECTED`;
export const ON_CLOSE_MODAL_UPLOAD_FILE = `${namespace}_ON_CLOSE_MODAL_UPLOAD_FILE`;
export const ON_CHANGE_EXPAND = `${namespace}_ON_CHANGE_EXPAND`;
export const ON_CHANGE_FILE_NAME_EDIT = `${namespace}_ON_CHANGE_FILE_NAME_EDIT`;
export const ON_CHANGE_DATE_TIME_EDIT = `${namespace}_ON_CHANGE_DATE_TIME_EDIT`;
export const SAVE_EDIT_FILE_UPLOAD = `${namespace}_SAVE_EDIT_FILE_UPLOAD`;
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
export const pick = (id, type) => ({
    type: PICK_START,
    meta: { id, type }
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

export const showModalSaveTemplate = (id, value) => ({
    type: SHOW_MODAL_SAVE_TEMPLATE,
    payload: { id, value }
})
export const hideModalSaveTemplate = (id, value) => ({
    type: HIDE_MODAL_SAVE_TEMPLATE,
    payload: { id, value }
})

export const saveTemplate = (id, value) => ({
    type: SAVE_TEMPLATE_REQUEST,
    payload: { id, value }
})
export const saveTemplateSuccess = (id) => ({
    type: SAVE_TEMPLATE_SUCCESS,
    payload: { id }
})
export const saveTemplateFailure = (id) => ({
    type: SAVE_TEMPLATE_FAILURE,
    payload: { id }
})

export const fetchTemplatesSuccess = (id, templates) => ({
    type: FETCH_TEMPLATES_SUCCESS,
    payload: { id, templates }
})
export const fetchTemplatesFailure = (id) => ({
    type: FETCH_TEMPLATES_FAILURE,
    payload: { id }
})

export const onChangeTemplate = (id, templateId) => ({
    type: CHANGE_TEMPLATE,
    payload: { id, templateId }
})

export const onClickEngineCategory = (id, engineCategoryId) => ({
    type: ON_CLICK_ENGINE_CATEGORY,
    payload: { id, engineCategoryId }
})

export const fetchContentTemplates = (id) => ({
    type: FETCH_CONTENT_TEMPLATES_REQUEST,
    payload: { id }
})
export const fetchContentTemplatesSuccess = (id, contentTemplates) => ({
    type: FETCH_CONTENT_TEMPLATES_SUCCESS,
    payload: { id, contentTemplates }
})
export const fetchContentTemplatesFailure = (id) => ({
    type: FETCH_CONTENT_TEMPLATES_SUCCESS,
    payload: { id }
})

export const addContentTemplate = (id, contentTemplateId) => ({
    type: ADD_CONTENT_TEMPLATE,
    payload: { id, contentTemplateId }
})
export const removeContentTemplate = (id, contentTemplateId) => ({
    type: REMOVE_CONTENT_TEMPLATE,
    payload: { id, contentTemplateId}
})

export const onChangeFormContentTemplate = (id, contentTemplateId, name, value) => ({
    type: ON_CHANGE_FORM_CONTENT_TEMPLATE,
    payload: { id, contentTemplateId, name, value }
})

export const selectFolder = (id, selectedFolder) => ({
    type: SELECT_FOLDER,
    payload: { id, selectedFolder }
})

export const addTagsCustomize = (id, value) => ({
    type: ADD_TAGS_CUSTOMIZE,
    payload: { id, value }
})

export const removeTagsCustomize = (id, value) => ({
    type: REMOVE_TAGS_CUSTOMIZE,
    payload: { id, value }
})

export const fetchCreateTdo = (id) => ({
    type: FETCH_CREATE_TDO_REQUEST,
    payload: { id }
})
export const fetchCreateTdoSuccess = (id, tdoId, jobConfig, key) => ({
    type: FETCH_CREATE_TDO_SUCCESS,
    payload: { id, tdoId, jobConfig, key }
})
export const fetchCreateTdoFailure = (id) => ({
    type: FETCH_CREATE_TDO_FAILURE,
    payload: { id }
})

export const fetchCreateJobSuccess = (id, records, key) => ({
    type: FETCH_CREATE_JOB_SUCCESS,
    payload: { id, records, key }
})
export const fetchCreateJobFailure = (id) => ({
    type: FETCH_CREATE_TDO_FAILURE,
    payload: { id }
})
export const onChangeLibraries = (id, categoryId, value) => ({
    type: ON_CHANGE_LIBRARIES,
    payload: { id, categoryId, value}
})
export const onChangeFormEngineSelected = (id, engineId, name, value) => ({
    type: ON_CHANGE_FORM_ENGINE_SELECTED,
    payload: { id, engineId, name, value }
})
export const onChangeLibrariesEngineSelected = (id, engineId, value) => ({
    type: ON_CHANGE_LIBRARIES_ENGINE_SELECTED, 
    payload: { id, engineId, value }
})
export const onCloseModalUploadFile = (id) => ({
    type: ON_CLOSE_MODAL_UPLOAD_FILE,
    payload: { id }
})
export const onChangeExpand = (id, categoryId, engineId, expand) => ({
    type: ON_CHANGE_EXPAND,
    payload: { id, categoryId, engineId, expand }
})
export const onChangeFileNameEdit = (id, value) => ({
    type: ON_CHANGE_FILE_NAME_EDIT,
    payload: { id, value }
})

export const onChangeDateTimeEdit = (id, value) => ({
    type: ON_CHANGE_DATE_TIME_EDIT,
    payload: { id, value }
})

export const saveEditFileUpload = (id) => ({
    type: SAVE_EDIT_FILE_UPLOAD,
    payload: { id }
})