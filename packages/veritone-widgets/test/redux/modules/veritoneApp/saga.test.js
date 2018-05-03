import { put, select } from 'redux-saga/effects';
import { withoutFunctions as wF } from '../../../helpers/utils';
import {
  handleAppAuth,
} from '../../../../src/redux/modules/veritoneApp/saga';
import * as appModule from '../../../../src/redux/modules/veritoneApp';
import { modules } from 'veritone-redux-common';
const { user: userModule } = modules;

describe('Saga: veritoneApp', () => {
  
  it('should not load widgets if auth fails', () => {
    const gen = handleAppAuth();
    const err = new Error('test error');

    expect(wF(gen.next().value)).toEqual(wF(put.resolve(userModule.fetchUser())));
    expect(gen.throw(err).done).toEqual(true);
  });

  it('should load widgets if auth succeeds', () => {
    const gen = handleAppAuth();

    expect(wF(gen.next().value)).toEqual(wF(put.resolve(userModule.fetchUser())));
    expect(gen.next().value).toEqual(select(appModule.widgets));
    expect(gen.next().done).toEqual(true);
  })

});