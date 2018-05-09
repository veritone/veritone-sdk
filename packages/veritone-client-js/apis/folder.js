import { endpoints } from './config';

export default {
  getRootTreeFolder(organizationId, userId, rootFolderType, options = {}) {
    if (typeof organizationId !== 'string' || organizationId === '') {
      throw new Error('Missing organizationId');
    }
    if (typeof userId !== 'string' || userId === '') {
      throw new Error('Missing userId');
    }
    if (typeof rootFolderType !== 'string' || rootFolderType === '') {
      throw new Error('Missing rootFolderType');
    }

    return {
      method: 'get',
      path: `${
        endpoints.collectionFolders
      }/${organizationId}/${userId}/type/${rootFolderType}`,
      query: options
    };
  },

  getTreeObject(treeObjectId, options = {}) {
    if (typeof treeObjectId !== 'string' || treeObjectId === '') {
      throw new Error('Missing organizationId');
    }

    return {
      method: 'get',
      path: `${endpoints.collectionFolders}/${treeObjectId}`,
      query: options
    };
  },

  createTreeFolder(treeFolder) {
    if (typeof treeFolder !== 'object') {
      throw new Error('Missing tree folder!');
    }

    return {
      method: 'post',
      path: endpoints.collectionFolders,
      data: treeFolder
    };
  },

  createTreeObject(treeObject) {
    if (typeof treeObject !== 'object') {
      throw new Error('Missing tree object!');
    }

    return {
      method: 'post',
      path: `${endpoints.collectionFolders}/object`,
      data: treeObject
    };
  },

  moveTreeFolder(treeObjectId, treeFolderMoveObj) {
    if (typeof treeObjectId !== 'string') {
      throw new Error('Missing tree object id!');
    }
    if (typeof treeFolderMoveObj !== 'object') {
      throw new Error('Missing tree folder move information!');
    }

    return {
      method: 'put',
      path: `${endpoints.collectionFolders}/move/${treeObjectId}`,
      data: treeFolderMoveObj
    };
  },

  updateTreeFolder(treeObjectId, treeFolderObj) {
    if (typeof treeObjectId !== 'string') {
      throw new Error('Missing tree object id!');
    }
    if (typeof treeFolderObj !== 'object') {
      throw new Error('Missing tree folder information!');
    }

    return {
      method: 'put',
      path: `${endpoints.collectionFolders}/${treeObjectId}`,
      data: treeFolderObj
    };
  },

  deleteTreeFolder(treeObjectId, options) {
    if (typeof treeObjectId !== 'string') {
      throw new Error('Missing tree folder!');
    }

    return {
      method: 'delete',
      path: `${endpoints.collectionFolders}/${treeObjectId}`,
      query: options
    };
  },

  deleteTreeObject(treeObjectId, options) {
    if (typeof treeObjectId !== 'string') {
      throw new Error('Missing tree folder!');
    }

    return {
      method: 'delete',
      path: `${endpoints.collectionFolders}/object/${treeObjectId}`,
      query: options
    };
  },

  searchTreeFolder(queryTerms) {
    if (typeof queryTerms !== 'object') {
      throw new Error('Missing query terms!');
    }

    return {
      method: 'post',
      path: `${endpoints.collectionFolders}/search`,
      data: queryTerms
    };
  },

  folderSummary(queryTerms) {
    if (typeof queryTerms !== 'object') {
      throw new Error('Missing folder summary terms!');
    }

    return {
      method: 'post',
      path: `${endpoints.collectionFolders}/summary`,
      data: queryTerms
    };
  }
};
