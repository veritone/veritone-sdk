import { endpoints } from './config'

export default {
	getRootTreeFolder(
		organizationId,
		userId,
		rootFolderType,
		options = {}
	) {
		if (typeof organizationId !== 'string' || organizationId === '') {
			throw new Error('Missing organizationId');
		}
		if (typeof userId !== 'string' || userId === '') {
			throw new Error('Missing userId');
		}
		if (typeof rootFolderType !== 'string' || rootFolderType === '') {
			throw new Error('Missing rootFolderType');
		}

		var rootFolderPath =
			endpoints.collectionFolders +
			organizationId +
			'/' +
			userId +
			'/type/' +
			rootFolderType;
		this._retryRequest('GET', rootFolderPath, options, callback);
	},

	getTreeObject(treeObjectId, options = {}) {
		if (typeof treeObjectId !== 'string' || treeObjectId === '') {
			throw new Error('Missing organizationId');
		}

		var treeObjectPath = endpoints.collectionFolders + treeObjectId;
		this._retryRequest('GET', treeObjectPath, options, callback);
	},
	createTreeFolder(treeFolder) {
		if (typeof treeFolder !== 'object') {
			throw new Error('Missing tree folder!');
		}
		this._retryRequest(
			'POST',
			endpoints.collectionFolders,
			treeFolder,
			callback
		);
	},

	createTreeObject(treeObject) {
		if (typeof treeObject !== 'object') {
			throw new Error('Missing tree object!');
		}
		this._retryRequest(
			'POST',
			endpoints.collectionFolders + 'object/',
			treeObject,
			callback
		);
	},

	moveTreeFolder(
		treeObjectId,
		treeFolderMoveObj
	) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree object id!');
		}
		if (typeof treeFolderMoveObj !== 'object') {
			throw new Error('Missing tree folder move information!');
		}
		this._retryRequest(
			'PUT',
			endpoints.collectionFolders + 'move/' + treeObjectId,
			treeFolderMoveObj,
			callback
		);
	},

	updateTreeFolder(
		treeObjectId,
		treeFolderObj
	) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree object id!');
		}
		if (typeof treeFolderObj !== 'object') {
			throw new Error('Missing tree folder information!');
		}
		this._retryRequest(
			'PUT',
			endpoints.collectionFolders + treeObjectId,
			treeFolderObj,
			callback
		);
	},

	deleteTreeFolder(treeObjectId, options) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree folder!');
		}

		this._retryRequest(
			'DELETE',
			endpoints.collectionFolders + treeObjectId,
			options,
			callback
		);
	},

	deleteTreeObject(treeObjectId, options) {
		if (typeof treeObjectId !== 'string') {
			throw new Error('Missing tree folder!');
		}
		this._retryRequest(
			'DELETE',
			endpoints.collectionFolders + 'object/' + treeObjectId,
			options,
			callback
		);
	},

	searchTreeFolder(queryTerms) {
		if (typeof queryTerms !== 'object') {
			throw new Error('Missing query terms!');
		}

		this._retryRequest(
			'POST',
			endpoints.collectionFolders + 'search/',
			queryTerms,
			callback
		);
	},

	folderSummary(queryTerms) {
		if (typeof queryTerms !== 'object') {
			throw new Error('Missing folder summary terms!');
		}
		this._retryRequest(
			'POST',
			endpoints.collectionFolders + 'summary/',
			queryTerms,
			callback
		);
	}
};
