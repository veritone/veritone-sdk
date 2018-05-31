import { endpoints } from './config';

export default {
  queryFaceset(q) {
    if (typeof q !== 'string' || q === '') {
      throw new Error('Missing query!');
    }

    return {
      method: 'get',
      path: `${endpoints.faceset}/autocomplete/${encodeURIComponent(q)}`
    };
  },

  createFaceset(faceset) {
    if (typeof faceset !== 'object') {
      throw new Error('Missing faceset!');
    }
    if (typeof faceset.faceSetId !== 'string') {
      throw new Error('Missing faceSetId!');
    }

    return {
      method: 'post',
      path: `${endpoints.faceset}/${encodeURIComponent(faceset.faceSetId)}`,
      data: faceset
    };
  },

  updateFaceset(faceset) {
    if (typeof faceset !== 'object') {
      throw new Error('Missing faceset!');
    }
    if (typeof faceset.faceSetId !== 'string') {
      throw new Error('Missing faceSetId!');
    }

    return {
      method: 'put',
      path: `${endpoints.faceset}/${encodeURIComponent(faceset.faceSetId)}`,
      data: faceset
    };
  }
};
