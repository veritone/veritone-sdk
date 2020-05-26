import { selectUserId } from './auth/index';
import { selectApplicationId } from './config';

export const getExtraHeaders = state => {
  let headers = {};
  const applicationId = selectApplicationId(state);
  const userId = selectUserId(state);
  if (applicationId) {
    headers['x-veritone-application'] = applicationId;
  }
  if (userId) {
    headers['x-veritone-user'] = userId;
  }
  return headers;
};
