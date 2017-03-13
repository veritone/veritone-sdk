'use strict';

var request = require('request');
var librariesApiBaseUri = '/media';

module.exports = function init() {
	var self = this;

	return {
		getLibraries: getLibraries,
		getLibrary: getLibrary,
		createLibrary: createLibrary,
		updateLibrary: updateLibrary,
		deleteLibrary: deleteLibrary,
		publishLibraryChanges: publishLibraryChanges

		// TODO:

		//getLibraryTypes: getLibraryTypes,
		//getLibraryType: getLibraryType,
		//createLibraryType: createLibraryType,
		//updateLibraryType: updateLibraryType,

		//getLibraryEngineModels: getLibraryEngineModels,
		//getLibraryEngineModel: getLibraryEngineModel,
		//createLibraryEngineModel: createLibraryEngineModel,
		//updateLibraryEngineModel: updateLibraryEngineModel,
		//deleteLibraryEngineModel: deleteLibraryEngineModel,

		//getLibraryCollaborators: getLibraryCollaborators,
		//getLibraryCollaborator: getLibraryCollaborator,
		//createLibraryCollaborator: createLibraryCollaborator,
		//updateLibraryCollaborator: updateLibraryCollaborator,
		//deleteLibraryCollaborator: deleteLibraryCollaborator,

		//getEntities: getEntities,
		//getEntity: getEntity,
		//createEntity: createEntity,
		//updateEntity: updateEntity,
		//uploadEntityProfileImage: uploadEntityProfileImage,
		//deleteEntity: deleteEntity,

		//getEntityIdentifierTypes: getEntityIdentifierTypes,
		//getEntityIdentifierType: getEntityIdentifierType,
		//createEntityIdentifierType: createEntityIdentifierType,
		//updateEntityIdentifierType: updateEntityIdentifierType,

		//getEntityIdentifiers: getEntityIdentifiers,
		//getEntityIdentifier: getEntityIdentifier,
		//createEntityIdentifier: createEntityIdentifier,
		//uploadEntityIdentifier: uploadEntityIdentifier,
		//updateEntityIdentifier: updateEntityIdentifier,
		//deleteEntityIdentifier: deleteEntityIdentifier,
	};

	function getLibraries(callback) {
		if (typeof callback != 'function') {
			throw new Error('Missing callback!');
		}

		var options = {
			method: 'GET',
			url: self._baseUri + librariesApiBaseUri + '/library',
			headers: self.generateHeaders(self._token),
			json: true
		};

		self._retryHelper.retry(function task(callback) {
			request(options, callback);
		}, callback);
	}

	function getLibrary(libraryId, callback) {
		if (!libraryId) {
			throw new Error('libraryId is required');
		}
		if (typeof callback != 'function') {
			throw new Error('Missing callback!');
		}

		var options = {
			method: 'GET',
			url: self._baseUri + librariesApiBaseUri + '/library/' + libraryId,
			headers: self.generateHeaders(self._token),
			json: true
		};

		self._retryHelper.retry(function task(callback) {
			request(options, callback);
		}, callback);
	}

	function createLibrary(library, callback) {
		if (typeof library != 'object') {
			throw new Error('Expected library to be an object');
		}
		if (typeof callback != 'function') {
			throw new Error('Missing callback!');
		}

		var options = {
			method: 'POST',
			url: self._baseUri + librariesApiBaseUri + '/library',
			headers: self.generateHeaders(self._token),
			json: library
		};

		self._retryHelper.retry(function task(callback) {
			request(options, callback);
		}, callback);
	}

	function updateLibrary(library, callback) {
		if (typeof library != 'object') {
			throw new Error('Expected library to be an object');
		}
		if (!library.libraryId) {
			throw new Error('library.libraryId is required');
		}
		if (typeof callback != 'function') {
			throw new Error('Missing callback!');
		}

		var options = {
			method: 'PUT',
			url: self._baseUri + librariesApiBaseUri + '/library/' + library.libraryId,
			headers: self.generateHeaders(self._token),
			json: library
		};

		self._retryHelper.retry(function task(callback) {
			request(options, callback);
		}, callback);
	}

	function deleteLibrary(libraryId, callback) {
		if (!libraryId) {
			throw new Error('libraryId is required');
		}
		if (typeof callback != 'function') {
			throw new Error('Missing callback!');
		}

		var options = {
			method: 'DELETE',
			url: self._baseUri + librariesApiBaseUri + '/library/' + libraryId,
			headers: self.generateHeaders(self._token),
			json: true
		};

		self._retryHelper.retry(function task(callback) {
			request(options, callback);
		}, callback);
	}

	function publishLibraryChanges(libraryId, callback) {
		if (!libraryId) {
			throw new Error('libraryId is required');
		}
		if (typeof callback != 'function') {
			throw new Error('Missing callback!');
		}

		var options = {
			method: 'POST',
			url: self._baseUri + librariesApiBaseUri + '/library/' + libraryId + '/version',
			headers: self.generateHeaders(self._token),
			json: true
		};

		self._retryHelper.retry(function task(callback) {
			request(options, callback);
		}, callback);
	}
};