import generateHandler from './helper/generate-handler';
import { endpoints } from './config';

export default {
  getLibraryTypes: generateHandler(
    'GET',
    `${endpoints.libraries}/library-type`
  ),
  getLibraryType: generateHandler(
    'GET',
    `${endpoints.libraries}/library-type/:libraryTypeId`
  ),
  createLibraryType: generateHandler(
    'POST',
    `${endpoints.libraries}/library-type`
  ),
  updateLibraryType: generateHandler(
    'PUT',
    `${endpoints.libraries}/library-type/:libraryTypeId`
  ),

  getLibraries: generateHandler('GET', `${endpoints.libraries}/library`),
  getLibrary: generateHandler(
    'GET',
    `${endpoints.libraries}/library/:libraryId`
  ),
  createLibrary: generateHandler('POST', `${endpoints.libraries}/library`),
  updateLibrary: generateHandler(
    'PUT',
    `${endpoints.libraries}/library/:libraryId`
  ),
  deleteLibrary: generateHandler(
    'DELETE',
    `${endpoints.libraries}/library/:libraryId`
  ),
  publishLibraryChanges: generateHandler(
    'POST',
    `${endpoints.libraries}/library/:libraryId/version`
  ),

  getLibraryEngineModels: generateHandler(
    'GET',
    `${endpoints.libraries}/library/:libraryId/engine-model`
  ),
  getLibraryEngineModel: generateHandler(
    'GET',
    `${
      endpoints.libraries
    }/library/:libraryId/engine-model/:libraryEngineModelId`
  ),
  createLibraryEngineModel: generateHandler(
    'POST',
    `${endpoints.libraries}/library/:libraryId/engine-model`
  ),
  updateLibraryEngineModel: generateHandler(
    'PUT',
    `${
      endpoints.libraries
    }/library/:libraryId/engine-model/:libraryEngineModelId`
  ),
  deleteLibraryEngineModel: generateHandler(
    'DELETE',
    `${
      endpoints.libraries
    }/library/:libraryId/engine-model/:libraryEngineModelId`
  ),

  getLibraryCollaborators: generateHandler(
    'GET',
    `${endpoints.libraries}/library/:libraryId/collaborator`
  ),
  getLibraryCollaborator: generateHandler(
    'GET',
    `${endpoints.libraries}/library/:libraryId/collaborator/:collaboratorOrgId`
  ),
  createLibraryCollaborator: generateHandler(
    'POST',
    `${endpoints.libraries}/library/:libraryId/collaborator`
  ),
  updateLibraryCollaborator: generateHandler(
    'PUT',
    `${endpoints.libraries}/library/:libraryId/collaborator/:collaboratorOrgId`
  ),
  deleteLibraryCollaborator: generateHandler(
    'DELETE',
    `${endpoints.libraries}/library/:libraryId/collaborator/:collaboratorOrgId`
  ),

  getEntityIdentifierTypes: generateHandler(
    'GET',
    `${endpoints.libraries}/entity-identifier-type`
  ),
  getEntityIdentifierType: generateHandler(
    'GET',
    `${endpoints.libraries}/entity-identifier-type/:entityIdentifierTypeId`
  ),
  createEntityIdentifierType: generateHandler(
    'POST',
    `${endpoints.libraries}/entity-identifier-type`
  ),
  updateEntityIdentifierType: generateHandler(
    'PUT',
    `${endpoints.libraries}/entity-identifier-type/:entityIdentifierTypeId`
  ),

  getEntities: generateHandler(
    'GET',
    `${endpoints.libraries}/library/:libraryId/entity`
  ),
  getEntity: generateHandler(
    'GET',
    `${endpoints.libraries}/library/:libraryId/entity/:entityId`
  ),
  createEntity: generateHandler(
    'POST',
    `${endpoints.libraries}/library/:libraryId/entity`
  ),
  updateEntity: generateHandler(
    'PUT',
    `${endpoints.libraries}/library/:libraryId/entity/:entityId`
  ),
  uploadEntityProfileImage: generateHandler(
    'POST',
    `'${endpoints.libraries}/library/:libraryId/entity/:entityId/profile-image`,
    ['Content-Type']
  ),
  deleteEntity: generateHandler(
    'DELETE',
    `${endpoints.libraries}/library/:libraryId/entity/:entityId`
  ),
  entityLookup: generateHandler('POST', `${endpoints.libraries}/entity-lookup`),

  getEntityIdentifiers: generateHandler(
    'GET',
    `${endpoints.libraries}/library/:libraryId/entity/:entityId/identifier`
  ),
  getEntityIdentifier: generateHandler(
    'GET',
    `${
      endpoints.libraries
    }/library/:libraryId/entity/:entityId/identifier/:entityIdentifierId`
  ),
  createEntityIdentifier: generateHandler(
    'POST',
    `${endpoints.libraries}/library/:libraryId/entity/:entityId/identifier`
  ),
  updateEntityIdentifier: generateHandler(
    'PUT',
    `${
      endpoints.libraries
    }/library/:libraryId/entity/:entityId/identifier/:entityIdentifierId`
  ),
  uploadEntityIdentifier: generateHandler(
    'POST',
    `'${
      endpoints.libraries
    }/library/:libraryId/entity/:entityId/identifier/:entityIdentifierTypeId`,
    ['Content-Type']
  ),
  deleteEntityIdentifier: generateHandler(
    'DELETE',
    `'${
      endpoints.libraries
    }/library/:libraryId/entity/:entityId/identifier/:entityIdentifierId`
  )
};
