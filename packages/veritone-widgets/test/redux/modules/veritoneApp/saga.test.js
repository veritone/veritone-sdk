import { put, call, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { removeFunctions as rF } from '../../../helpers/utils';
import {
  handleAppAuth,
  watchAppAuth,
} from '../../../../src/redux/modules/veritoneApp/saga';
import * as appModule from '../../../../src/redux/modules/veritoneApp';
import _ from 'lodash';
import { modules } from 'veritone-redux-common';
const { user: userModule, auth: authModule } = modules;

describe('Saga: veritoneApp', () => {
  
  it('should not load widgets if auth fails', () => {
    const gen = handleAppAuth();
    const err = new Error('test error');

    expect(rF(gen.next().value)).toEqual(rF(put.resolve(userModule.fetchUser())));
    expect(gen.throw(err).done).toEqual(true);
  });

  it('should load widgets if auth succeeds', () => {
    const gen = handleAppAuth();

    expect(rF(gen.next().value)).toEqual(rF(put.resolve(userModule.fetchUser())));
    expect(gen.next().value).toEqual(select(appModule.widgets));
    expect(gen.next().done).toEqual(true);
  })

});