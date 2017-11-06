import { selectSessionToken } from 'modules/user';

export function commonHeaders(state) {
  return {
    Authorization: `Bearer ${selectSessionToken(state)}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
}
