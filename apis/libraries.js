import { endpoints } from './config';

module.exports = function init() {
	const generateHandler = require('./helper/generate-handler')(this, this._baseUri + endpoints.libraries);

	return {
		getLibraryTypes: generateHandler('GET', '/library-type'),
		getLibraryType: generateHandler('GET', '/library-type/:libraryTypeId'),
		createLibraryType: generateHandler('POST', '/library-type'),
		updateLibraryType: generateHandler('PUT', '/library-type/:libraryTypeId'),

		getLibraries: generateHandler('GET', '/library'),
		getLibrary: generateHandler('GET', '/library/:libraryId'),
		createLibrary: generateHandler('POST', '/library'),
		updateLibrary: generateHandler('PUT', '/library/:libraryId'),
		deleteLibrary: generateHandler('DELETE', '/library/:libraryId'),
		publishLibraryChanges: generateHandler('POST', '/library/:libraryId/version'),

		getLibraryEngineModels: generateHandler('GET', '/library/:libraryId/engine-model'),
		getLibraryEngineModel: generateHandler('GET', '/library/:libraryId/engine-model/:libraryEngineModelId'),
		createLibraryEngineModel: generateHandler('POST', '/library/:libraryId/engine-model'),
		updateLibraryEngineModel: generateHandler('PUT', '/library/:libraryId/engine-model/:libraryEngineModelId'),
		deleteLibraryEngineModel: generateHandler('DELETE', '/library/:libraryId/engine-model/:libraryEngineModelId'),

		getLibraryCollaborators: generateHandler('GET', '/library/:libraryId/collaborator'),
		getLibraryCollaborator: generateHandler('GET', '/library/:libraryId/collaborator/:collaboratorOrgId'),
		createLibraryCollaborator: generateHandler('POST', '/library/:libraryId/collaborator'),
		updateLibraryCollaborator: generateHandler('PUT', '/library/:libraryId/collaborator/:collaboratorOrgId'),
		deleteLibraryCollaborator: generateHandler('DELETE', '/library/:libraryId/collaborator/:collaboratorOrgId'),

		getEntityIdentifierTypes: generateHandler('GET', '/entity-identifier-type'),
		getEntityIdentifierType: generateHandler('GET', '/entity-identifier-type/:entityIdentifierTypeId'),
		createEntityIdentifierType: generateHandler('POST', '/entity-identifier-type'),
		updateEntityIdentifierType: generateHandler('PUT', '/entity-identifier-type/:entityIdentifierTypeId'),

		getEntities: generateHandler('GET', '/library/:libraryId/entity'),
		getEntity: generateHandler('GET', '/library/:libraryId/entity/:entityId'),
		createEntity: generateHandler('POST', '/library/:libraryId/entity'),
		updateEntity: generateHandler('PUT', '/library/:libraryId/entity/:entityId'),
		uploadEntityProfileImage: generateHandler('POST', '/library/:libraryId/entity/:entityId/profile-image', ['Content-Type']),
		deleteEntity: generateHandler('DELETE', '/library/:libraryId/entity/:entityId'),
		entityLookup: generateHandler('POST', '/entity-lookup'),

		getEntityIdentifiers: generateHandler('GET', '/library/:libraryId/entity/:entityId/identifier'),
		getEntityIdentifier: generateHandler('GET', '/library/:libraryId/entity/:entityId/identifier/:entityIdentifierId'),
		createEntityIdentifier: generateHandler('POST', '/library/:libraryId/entity/:entityId/identifier'),
		updateEntityIdentifier: generateHandler('PUT', '/library/:libraryId/entity/:entityId/identifier/:entityIdentifierId'),
		uploadEntityIdentifier: generateHandler('POST', '/library/:libraryId/entity/:entityId/identifier/:entityIdentifierTypeId', ['Content-Type']),
		deleteEntityIdentifier: generateHandler('DELETE', '/library/:libraryId/entity/:entityId/identifier/:entityIdentifierId'),
	};
};
