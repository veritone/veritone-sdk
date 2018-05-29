import { expect } from 'chai';
import { uniq } from 'lodash';

import * as module from './';

describe('confirmation module', function() {
  describe('action creators', function() {
    it('dispatches correct type', function() {
      const approve = module.approveConfirmAction(1);
      const cancel = module.cancelConfirmAction(1);
      const show = module._showConfirmationDialog({});

      expect(approve.type).to.equal(module.APPROVE_CONFIRM_ACTION);
      expect(cancel.type).to.equal(module.CANCEL_CONFIRM_ACTION);
      expect(show.type).to.equal(module.SHOW_CONFIRMATION);
    });

    it('attaches ID to the action meta (approve/cancel)', function() {
      const approve = module.approveConfirmAction(1);
      const cancel = module.cancelConfirmAction(1);

      expect(approve.meta.id).to.equal(1);
      expect(cancel.meta.id).to.equal(1);
    });

    it('attaches correct data to action (showConfirmDialog)', function() {
      const show = module._showConfirmationDialog({
        a: 'a',
        b: 'b',
        id: 'id'
      });

      expect(show.meta.id).to.equal('id');
      expect(show.payload.a).to.equal('a');
      expect(show.payload.b).to.equal('b');
    });
  });

  describe('withConfirmation', function() {
    it('wraps an action, and accepts the actions original params', function() {
      const myActionCreator = (id1, id2) => ({
        type: 'ACTION',
        payload: { id1, id2 }
      });
      const confirmedActionCreator = module.withConfirmation(myActionCreator);
      const action = confirmedActionCreator('my-id-1', 'my-id-2');

      expect(action.type).to.equal(module.CONFIRM);
      expect(action.payload.wrappedAction).to.deep.equal(
        myActionCreator('my-id-1', 'my-id-2')
      );
    });

    it('attaches an ID to the action', function() {
      const myActionCreator = () => ({ type: 'ACTION' });
      const confirmedActionCreator = module.withConfirmation(myActionCreator);
      const action = confirmedActionCreator();

      expect(action.meta.id).to.be.a('string');
    });

    it('attaches dialog text to the action (config object)', function() {
      const myActionCreator = () => ({ type: 'ACTION' });
      const confirmedActionCreator = module.withConfirmation(myActionCreator, {
        message: 'Confirm?',
        confirmButtonLabel: 'OK',
        cancelButtonLabel: 'No'
      });
      const action = confirmedActionCreator();

      expect(action.payload.message).to.equal('Confirm?');
      expect(action.payload.confirmButtonLabel).to.equal('OK');
      expect(action.payload.cancelButtonLabel).to.equal('No');
    });
  });

  it('attaches dialog text to the action (config fn)', function() {
    const myActionCreator = () => ({ type: 'ACTION' });
    const confirmedActionCreator = module.withConfirmation(
      myActionCreator,
      args => ({
        message: `delete ${args.id}?`
      })
    );
    const action = confirmedActionCreator({ id: 5 });

    expect(action.payload.message).to.equal('delete 5?');
  });

  describe('reducer', function() {
    it('adds a confirmation to the visible set', function() {
      let state = [undefined, module._showConfirmationDialog({ id: 1 })].reduce(
        module.default
      );
      state = { [module.namespace]: state };

      expect(module.getConfirmations(state)).to.be.an('object');
      expect(Object.keys(module.getConfirmations(state)).length).to.equal(1);
    });

    it('sets fields on confirmation', function() {
      let state = [
        undefined,
        module._showConfirmationDialog({
          id: 1,
          message: 'Confirm?',
          confirmButtonLabel: 'OK'
        })
      ].reduce(module.default);
      state = { [module.namespace]: state };

      const id = Object.keys(module.getConfirmations(state))[0];

      expect(module.getConfirmations(state)[id].message).to.equal('Confirm?');
      expect(module.getConfirmations(state)[id].confirmButtonLabel).to.equal(
        'OK'
      );
    });

    it('removes acted-upon confirmations from the set', function() {
      let state = [
        undefined,
        module._showConfirmationDialog({ id: 1 }),
        module._showConfirmationDialog({ id: 2 }),
        module._showConfirmationDialog({ id: 3 })
      ].reduce(module.default);

      expect(
        uniq(
          Object.keys(module.getConfirmations({ [module.namespace]: state }))
        ).length
        // three distinct confirmations
      ).to.equal(3);

      const firstId = Object.keys(
        module.getConfirmations({ [module.namespace]: state })
      )[0];

      const secondId = Object.keys(
        module.getConfirmations({ [module.namespace]: state })
      )[1];

      state = [
        module.approveConfirmAction(firstId),
        module.cancelConfirmAction(secondId)
      ].reduce(module.default, state);

      expect(
        Object.keys(module.getConfirmations({ [module.namespace]: state }))
          .length
      ).to.equal(1);

      expect(
        Object.keys(module.getConfirmations({ [module.namespace]: state }))
      ).not.to.include(firstId);

      expect(
        Object.keys(module.getConfirmations({ [module.namespace]: state }))
      ).not.to.include(secondId);
    });

    // todo: prevent confirm same action multiple times? stable ID?
    // has to be stable only when same args are passed to same creator
    // probably not unimportant enough edgecase.
  });
});
