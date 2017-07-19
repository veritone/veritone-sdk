import { expect } from 'chai';
import { endpoints } from './config';

import { assertMatches } from '../apis/helper/test-util';
import widgetHandlers from './widget';

const apiBaseUrl = 'http://fake.domain';

describe('Widgets', function() {
	describe('getWidget', function() {
		it('validates widgetId', function() {
			expect(() => this.api.getWidget()).to.throw(/widgetId/);
		});

		it('gets the widgetId with extra data in the query', function(done) {
			const query = {
				query: 'my-query'
			};

			const scope = nock(apiBaseUrl)
				.get(/my-widget/)
				.query(query)
				.reply(200, 'ok');

			this.api.getWidget('my-widget', query, () => {
				scope.done();
				done();
			});
		});
	});

	describe('updateWidget', function() {
		it('puts to the widget endpoint with the widget', function(done) {
			const data = {
				widget: 'my-widget'
			};

			const scope = nock(apiBaseUrl)
				.put(endpoints.widget, data)
				.reply(200, 'ok');

			this.api.updateWidget(data, () => {
				scope.done();
				done();
			});
		});
	});
});
