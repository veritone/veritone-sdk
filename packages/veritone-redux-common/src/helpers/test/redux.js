import configureStore from 'redux-mock-store';
import { apiMiddleware } from 'redux-api-middleware-fixed';

export const makeMockStore = () => configureStore([apiMiddleware(fetch)]);
