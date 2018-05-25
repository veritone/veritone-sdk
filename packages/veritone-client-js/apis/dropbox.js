import { endpoints } from './config';

export default {
  createDropboxWatcher(watcher) {
    return {
      method: 'post',
      path: endpoints.dropboxWatcher,
      data: watcher
    };
  },

  getDropboxWatchers(options) {
    if (typeof options === 'string') {
      options = {
        watcherId: options
      };
    } else if (typeof options !== 'object') {
      throw new Error('Missing options!');
    }

    return {
      method: 'get',
      path: endpoints.dropboxWatcher,
      query: options
    };
  },

  getDropboxWatcher(watcherId) {
    if (typeof watcherId !== 'string' || watcherId === '') {
      throw new Error('Missing watcherId!');
    }
    return {
      method: 'get',
      path: `${endpoints.dropboxWatcher}/${watcherId}`
    };
  },

  updateDropboxWatcher(watcher) {
    if (typeof watcher !== 'object') {
      throw new Error('Missing watcher!');
    }
    return {
      method: 'put',
      path: `${endpoints.dropboxWatcher}/${watcher.watcherId}`,
      data: watcher
    };
  },

  deleteDropboxWatcher(watcherId) {
    if (typeof watcherId !== 'string' || watcherId === '') {
      throw new Error('Missing watcherId!');
    }

    return {
      method: 'delete',
      path: `${endpoints.dropboxWatcher}/${watcherId}`
    };
  }
};
