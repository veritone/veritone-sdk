import { endpoints } from './config';

export default {
	createWidget(collectionId, widget) {
		this._retryRequest(
			'POST',
			path.join(endpoints.collection, collectionId, 'widget'),
			widget,
			callback
		);
	},

	getWidgets(collectionId, options = {}) {
		if (typeof collectionId !== 'string' || collectionId === '') {
			throw new Error('Missing collectionId');
		}

		this._retryRequest(
			'GET',
			path.join(endpoints.collection, collectionId, 'widget'),
			options,
			callback
		);
	},

	getWidget(widgetId, options) {
		if (typeof widgetId !== 'string' || widgetId === '') {
			throw new Error('Missing widgetId');
		}

		this._retryRequest(
			'GET',
			path.join(endpoints.widget, widgetId),
			options,
			callback
		);
	},

	updateWidget(widget) {
		this._retryRequest('PUT', endpoints.widget, widget, callback);
	},
}
