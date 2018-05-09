import { endpoints } from './config';

const enginePageLimit = 99999; // fixme?

export default {
  getEngines() {
    return {
      method: 'get',
      path: endpoints.engine,
      query: {
        limit: enginePageLimit
      }
    };
  },

  getEngineCategories() {
    return {
      method: 'get',
      path: `${endpoints.engine}/category`,
      query: {
        limit: enginePageLimit
      }
    };
  },

  getEngineUsingRightsFiltered(engineId) {
    return {
      method: 'get',
      path: `${endpoints.taskTypeByJob}/${engineId}`
    };
  },

  getEngineCategoriesWithEngines() {
    return {
      method: 'get',
      path: `${endpoints.job}/task_type`
    };
  }
};
