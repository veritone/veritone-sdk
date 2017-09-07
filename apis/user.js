import { endpoints } from './config';

export default {
  getCurrentUser() {
    return {
      method: 'get',
      path: `${endpoints.user}`
    };
  },
  getApplications() {
    return {
      method: 'get',
      path: `${endpoints.user}/applications`
    };
  }
};
