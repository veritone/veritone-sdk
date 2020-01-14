import { call, select, putResolve } from 'redux-saga/effects';
import { withoutFunctions as wF } from '../../../helpers/utils';
import {
  handleAppAuth,
} from '../../../../src/redux/modules/veritoneApp/saga';
import * as appModule from '../../../../src/redux/modules/veritoneApp';
import { modules } from 'veritone-redux-common';
const { user: userModule } = modules;

describe('Saga: veritoneApp', () => {
  const widgets = [
    { veritoneAppDidAuthenticate: () =>  {} },
    { veritoneAppDidAuthenticate: () => {} },
    { /* empty test */ }
  ];
  
  it('should not load widgets if auth fails', () => {
    const gen = handleAppAuth();
    const err = new Error('test error');

    expect(wF(gen.next().value)).toEqual(wF(putResolve(userModule.fetchUser())));
    expect(gen.throw(err).done).toEqual(true);
  });

  it('should load widgets if auth succeeds', () => {
    const gen = handleAppAuth();

    expect(wF(gen.next().value)).toEqual(wF(putResolve(userModule.fetchUser())));
    expect(gen.next().value).toEqual(select(appModule.widgets));
    expect(gen.next(widgets).value).toEqual(call(widgets[0].veritoneAppDidAuthenticate));
    expect(gen.next().value).toEqual(call(widgets[1].veritoneAppDidAuthenticate));
    expect(gen.next().done).toEqual(true);
  })

});