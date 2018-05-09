import { endpoints } from './config';

export default {
  createWidget(collectionId, widget) {
    return {
      method: 'post',
      path: `${endpoints.collection}/${collectionId}/widget`,
      data: widget
    };
  },

  getWidgets(collectionId, options = {}) {
    if (typeof collectionId !== 'string' || collectionId === '') {
      throw new Error('Missing collectionId');
    }

    return {
      method: 'get',
      path: `${endpoints.collection}/${collectionId}/widget`,
      query: options
    };
  },

  getWidget(widgetId, options) {
    if (typeof widgetId !== 'string' || widgetId === '') {
      throw new Error('Missing widgetId');
    }

    return {
      method: 'get',
      path: `${endpoints.widget}/${widgetId}`,
      query: options
    };
  },

  updateWidget(widget) {
    return {
      method: 'put',
      path: endpoints.widget,
      data: widget
    };
  }
};
