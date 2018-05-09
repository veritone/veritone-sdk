import { expect } from 'chai';
import { endpoints } from './config';

import { assertMatches } from '../apis/helper/test-util';
import widgetHandlers from './widget';

describe('Widgets', function() {
  describe('createWidget', function() {
    it('posts to the collectionId with the widget', function() {
      const data = {
        widget: 'my-widget'
      };

      const expected = {
        method: 'post',
        path: /my-collection/,
        data
      };

      const result = widgetHandlers.createWidget('my-collection', data);
      assertMatches(result, expected);
    });
  });

  describe('getWidgets', function() {
    it('validates collectionId', function() {
      expect(() => widgetHandlers.getWidgets()).to.throw(/collectionId/);
    });

    it('gets the widgetId with extra data in the query', function() {
      const query = {
        data: 'my-data'
      };

      const expected = {
        method: 'get',
        path: /my-collection\/widget/,
        query
      };

      const result = widgetHandlers.getWidgets('my-collection', query);
      assertMatches(result, expected);
    });
  });

  describe('getWidget', function() {
    it('validates widgetId', function() {
      expect(() => widgetHandlers.getWidget()).to.throw(/widgetId/);
    });

    it('gets the widgetId with extra data in the query', function() {
      const query = {
        query: 'my-query'
      };

      const expected = {
        method: 'get',
        path: /my-widget/,
        query
      };

      const result = widgetHandlers.getWidget('my-widget', query);
      assertMatches(result, expected);
    });
  });

  describe('updateWidget', function() {
    it('puts to the widget endpoint with the widget', function() {
      const data = {
        widget: 'my-widget'
      };

      const expected = {
        method: 'put',
        path: endpoints.widget,
        data
      };

      const result = widgetHandlers.updateWidget(data);
      assertMatches(result, expected);
    });
  });
});
