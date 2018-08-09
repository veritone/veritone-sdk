export const namespace = 'veritoneFolderWidget';

export const INITIALIZE_WIDGET = namespace + '::INITIALIZE_WIDGET';

export const LOAD_SCHEMAS = namespace + '::LOAD_SCHEMAS';
export const LOAD_SCHEMAS_COMPLETE = namespace + '::LOAD_SCHEMAS_COMPLETE';

export const LOAD_FOLDER = namespace + '::LOAD_FOLDER';
export const LOAD_FOLDER_COMPLETE = namespace + '::LOAD_FOLDER_COMPLETE';

export const CREATE_FOLDER = namespace + '::CREATE_FOLDER';
export const CREATE_FOLDER_COMPLETE = namespace + '::CREATE_FOLDER_COMPLETE';

export const UPDATE_FOLDER = namespace + '::UPDATE_FOLDER';
export const UPDATE_FOLDER_COMPLETE = namespace + '::UPDATE_FOLDER_COMPLETE';

export const CREATE_CONTENT_TEMPLATE = namespace + '::CREATE_CONTENT_TEMPLATE';
export const CREATE_CONTENT_TEMPLATE_COMPLETE = namespace + '::CREATE_CONTENT_TEMPLATE_COMPLETE';

export const UPDATE_CONTENT_TEMPLATE = namespace + '::UPDATE_CONTENT_TEMPLATE';
export const UPDATE_CONTENT_TEMPLATE_COMPLETE = namespace + '::UPDATE_CONTENT_TEMPLATE_COMPLETE';

//----Init Action----
export const initializeWidget = () => ({
  type: INITIALIZE_WIDGET
});

//----Schema Actions----
export const loadSchemas = () => ({
  type: LOAD_SCHEMAS
});

export const loadSchemasComplete = (result, error) => ({
  type: LOAD_SCHEMAS_COMPLETE, 
  payload: result,
  error: error
});

//----Load Existing Folder Actions----
export const loadFolder = (folderId) => ({
  type: LOAD_FOLDER,
  payload: folderId
});

export const loadFolderComplete = (result, error) => ({
  type: LOAD_FOLDER_COMPLETE,
  payload: result,
  error: error
});

//----Create Folder Actions----
export const createFolder = (name, description, orderIndex, parentId, rootFolderType, contentTemplate) => ({
  type: CREATE_FOLDER,
  payload: {
    name: name,
    description: description,
    orderIndex: orderIndex,
    parentId: parentId,
    rootFolderType: rootFolderType,
    contentTemplate: contentTemplate
  }
});

export const createFolderComplete = (result, error) => ({
  type: CREATE_FOLDER_COMPLETE,
  payload: result,
  error: error
});

export const createContentTemplate = (folderId, sdoId, schemaId, data) => ({
  type: CREATE_CONTENT_TEMPLATE,
  payload: {
    folderId: folderId,
    sdoId: sdoId,
    schemaId: schemaId,
    data: data
  }
});

export const createContentTemplateComplete = (result, error) => ({
  type: CREATE_CONTENT_TEMPLATE_COMPLETE,
  payload: result,
  error: error
});

//----Update Folder Actions----
export const updateFolder = (folderId, name, description, contentTemplate) => ({
  type: UPDATE_FOLDER,
  payload: {
    folderId: folderId,
    name: name,
    description: description,
    contentTemplate: contentTemplate
  }
});

export const updateFolderComplete = (result, error) => ({
  type: UPDATE_FOLDER_COMPLETE,
  payload: result,
  error: error
});

export const updateContentTemplate = (templateId, folderId, sdoId, schemaId, data) => ({
  type: UPDATE_CONTENT_TEMPLATE,
  payload: {
    templateId: templateId,
    folderId: folderId,
    sdoId: sdoId,
    schemaId: schemaId,
    data: data
  }
});

export const updateContentTemplateComplete = (result, error) => ({
  type: UPDATE_CONTENT_TEMPLATE_COMPLETE,
  payload: result,
  error: error
});