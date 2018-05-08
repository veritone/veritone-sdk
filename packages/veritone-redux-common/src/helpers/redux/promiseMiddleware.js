import { forEachRight, isFunction, constant } from 'lodash';
/*
BASIC USAGE:

import {
  WAIT_FOR_ACTION,
  ERROR_ACTION,
  CALLBACK_ARGUMENT,
  CALLBACK_ERROR_ARGUMENT
} from here;
store.dispatch({
  type: 'todos/get',
  [ WAIT_FOR_ACTION ]: 'todos/get/success', // Specify which action we are waiting for
  [ ERROR_ACTION ]: 'todos/get/failed', // Optional
  [ CALLBACK_ARGUMENT ]: action => action.customData, // Optional
  [ CALLBACK_ERROR_ARGUMENT ]: action => action.customError, // Optional
})
.then( payload => console.log('Todos got!') )
.catch( error => console.error('Failed!' + error.message) );
*/

// From documentation, needed for integrating with redux
const fsaCompliantArgumentCb = action => {
  return action.payload || action.data || {};
};
const fsaCompliantErrorArgumentCb = action => {
  return action.error || action.err || new Error('action.error not specified.');
};
// Add symbols to actions to activate promise return
// symbols don't show as normal keys, won't break actions
export const WAIT_FOR_ACTION = Symbol('WAIT_FOR_ACTION');
export const ERROR_ACTION = Symbol('ERROR_ACTION');
export const CALLBACK_ARGUMENT = Symbol('CALLBACK_ARGUMENT');
export const CALLBACK_ERROR_ARGUMENT = Symbol('ERROR_CALLBACK_ARGUMENT');

export function promiseMiddleware() {
  let pendingActionList = [];

  const middleware = store => {
    return function(next) {
      return function(action) {
        const successAction = action[WAIT_FOR_ACTION];
        const errorAction = action[ERROR_ACTION];
        const newPendingActionInfo = {};

        // loop through list, see if there are any pending
        // promise callbacks by comparing types
        forEachRight(pendingActionList, pendingActionInfo => {
          if (pendingActionInfo.isSuccessAction(action)) {
            pendingActionInfo.resolveCallback(
              pendingActionInfo.successArgumentCb(action)
            );
            pendingActionList.splice(
              pendingActionList.indexOf(pendingActionInfo),
              1
            );
          } else if (pendingActionInfo.isErrorAction(action)) {
            pendingActionInfo.rejectCallback(
              pendingActionInfo.errorArgumentCb(action)
            );
            pendingActionList.splice(
              pendingActionList.indexOf(pendingActionInfo),
              1
            );
          }
        });

        // If new action doesn't contain the symbol then we
        // are done
        if (!action[WAIT_FOR_ACTION]) {
          return next(action);
        }

        // These are the comparison function
        newPendingActionInfo.isSuccessAction = isFunction(successAction)
          ? successAction
          : action => action.type === successAction;
        if (errorAction) {
          newPendingActionInfo.isErrorAction = isFunction(errorAction)
            ? errorAction
            : action => action.type === errorAction;
        } else {
          newPendingActionInfo.isErrorAction = constant(false);
        }

        // If you need to change which action info to push into the
        // promise callbacks, you can change them here
        newPendingActionInfo.successArgumentCb =
          action[CALLBACK_ARGUMENT] || fsaCompliantArgumentCb;
        newPendingActionInfo.errorArgumentCb =
          action[CALLBACK_ERROR_ARGUMENT] || fsaCompliantErrorArgumentCb;

        // Setting up promise to be called when action types match
        const promise = new Promise(function(resolve, reject) {
          newPendingActionInfo.resolveCallback = resolve;
          newPendingActionInfo.rejectCallback = reject;
        });

        pendingActionList.push(newPendingActionInfo);
        // Move on, but return a promise for dispatch
        next(action);
        return promise;
      };
    };
  };
  return middleware;
}
