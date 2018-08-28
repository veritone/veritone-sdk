import { put } from 'redux-saga/effects'; // eslint-disable-line

import { handleConfirmAction } from './saga';
import * as module from './';

describe('confirmation sagas', function() {
  describe('confirm action', function() {
    it('works (confirm flow)', function() {
      let gen = handleConfirmAction({
        payload: {
          wrappedAction: { type: 'TEST' },
          arg: 'a'
        },
        meta: {
          id: '123'
        }
      });

      let next = gen.next();
      expect(next.value).toEqual(
        put(
          module._showConfirmationDialog({
            id: '123',
            arg: 'a'
          })
        ),
        'must put to show confirmation dialog'
      );

      next = gen.next();
      next = gen.next({ confirm: module.approveConfirmAction('123') });
      expect(next.value).toEqual(put({ type: 'TEST' }));
    });

    it('works (cancel flow)', function() {
      let gen = handleConfirmAction({
        payload: {
          wrappedAction: { type: 'TEST' },
          arg: 'a'
        },
        meta: {
          id: '123'
        }
      });

      let next = gen.next();
      expect(next.value).toEqual(
        put(
          module._showConfirmationDialog({
            id: '123',
            arg: 'a'
          })
        ),
        'must put to show confirmation dialog'
      );

      next = gen.next();
      next = gen.next({ cancel: module.cancelConfirmAction('123') });
      expect(next.value).toBe(undefined);
    });
  });
});
