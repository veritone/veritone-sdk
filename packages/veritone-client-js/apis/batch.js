import { endpoints } from './config';

export default {
  batch(requests) {
    return {
      method: 'post',
      path: endpoints.batch,
      data: requests
    };
  }
};
