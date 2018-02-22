import configureStore from 'redux-mock-store';
import { apiMiddleware } from 'redux-api-middleware-fixed';
import fetch from 'node-fetch';

export const makeMockStore = () => configureStore([apiMiddleware(fetch)]);
