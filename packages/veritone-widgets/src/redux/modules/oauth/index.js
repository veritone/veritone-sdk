export const REQUEST_OAUTH_GRANT = 'REQUEST_OAUTH_GRANT';
export const OAUTH_GRANT_FLOW_FAILED = 'OAUTH_GRANT_FLOW_FAILED';

export function requestOAuthGrant() {
  return {
    type: REQUEST_OAUTH_GRANT
  }
}
