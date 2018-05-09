import { assertMatches } from '../apis/helper/test-util';
import libraryHandlers from './libraries';

describe('Library', function() {
  describe('getLibraryTypes', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library-type')
      };

      const result = libraryHandlers.getLibraryTypes();
      assertMatches(result, expected);
    });
  });

  describe('getLibraryType', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library-type/123')
      };

      const result = libraryHandlers.getLibraryType({
        libraryTypeId: '123'
      });
      assertMatches(result, expected);
    });
  });

  describe('createLibraryType', function() {
    it('makes the correct post request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: new RegExp('/library-type'),
        data
      };

      const result = libraryHandlers.createLibraryType({}, data);
      assertMatches(result, expected);
    });
  });

  describe('updateLibraryType', function() {
    it('makes the correct put request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'put',
        path: new RegExp('/library-type/123'),
        data
      };

      const result = libraryHandlers.updateLibraryType(
        {
          libraryTypeId: 123
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('getLibraries', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library')
      };

      const result = libraryHandlers.getLibraries();
      assertMatches(result, expected);
    });
  });

  describe('getLibrary', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library/123')
      };

      const result = libraryHandlers.getLibrary({
        libraryId: '123'
      });
      assertMatches(result, expected);
    });
  });

  describe('createLibrary', function() {
    it('makes the correct post request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: new RegExp('/library'),
        data
      };

      const result = libraryHandlers.createLibrary(data);
      assertMatches(result, expected);
    });
  });

  describe('updateLibrary', function() {
    it('makes the correct put request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'put',
        path: new RegExp('/library/123'),
        data
      };

      const result = libraryHandlers.updateLibrary(
        {
          libraryId: 123
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('deleteLibrary', function() {
    it('makes the correct delete request', function() {
      const expected = {
        method: 'delete',
        path: new RegExp('/library/123')
      };

      const result = libraryHandlers.deleteLibrary({
        libraryId: 123
      });
      assertMatches(result, expected);
    });
  });

  describe('publishLibraryChanges', function() {
    it('makes the correct post request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: new RegExp('/library/123/version'),
        data
      };

      const result = libraryHandlers.publishLibraryChanges(
        {
          libraryId: 123
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('getLibraryEngineModels', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library/123/engine-model')
      };

      const result = libraryHandlers.getLibraryEngineModels({
        libraryId: 123
      });
      assertMatches(result, expected);
    });
  });

  describe('getLibraryEngineModel', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library/123/engine-model/456')
      };

      const result = libraryHandlers.getLibraryEngineModel({
        libraryId: 123,
        libraryEngineModelId: 456
      });
      assertMatches(result, expected);
    });
  });

  describe('createLibraryEngineModel', function() {
    it('makes the correct post request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: new RegExp('/library/123/engine-model'),
        data
      };

      const result = libraryHandlers.createLibraryEngineModel(
        {
          libraryId: 123
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('updateLibraryEngineModel', function() {
    it('makes the correct put request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'put',
        path: new RegExp('/library/123/engine-model/456'),
        data
      };

      const result = libraryHandlers.updateLibraryEngineModel(
        {
          libraryId: 123,
          libraryEngineModelId: 456
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('deleteLibraryEngineModel', function() {
    it('makes the correct delete request', function() {
      const expected = {
        method: 'delete',
        path: new RegExp('/library/123/engine-model/456')
      };

      const result = libraryHandlers.deleteLibraryEngineModel({
        libraryId: 123,
        libraryEngineModelId: 456
      });
      assertMatches(result, expected);
    });
  });

  describe('getLibraryCollaborators', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library/123/collaborator')
      };

      const result = libraryHandlers.getLibraryCollaborators({
        libraryId: 123
      });
      assertMatches(result, expected);
    });
  });

  describe('getLibraryCollaborator', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library/123/collaborator/456')
      };

      const result = libraryHandlers.getLibraryCollaborator({
        libraryId: 123,
        collaboratorOrgId: 456
      });
      assertMatches(result, expected);
    });
  });

  describe('createLibraryCollaborator', function() {
    it('makes the correct post request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: new RegExp('/library/123/collaborator'),
        data
      };

      const result = libraryHandlers.createLibraryCollaborator(
        {
          libraryId: 123
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('updateLibraryCollaborator', function() {
    it('makes the correct put request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'put',
        path: new RegExp('/library/123/collaborator/456'),
        data
      };

      const result = libraryHandlers.updateLibraryCollaborator(
        {
          libraryId: 123,
          collaboratorOrgId: 456
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('deleteLibraryCollaborator', function() {
    it('makes the correct delete request', function() {
      const expected = {
        method: 'delete',
        path: new RegExp('/library/123/collaborator/456')
      };

      const result = libraryHandlers.deleteLibraryCollaborator({
        libraryId: 123,
        collaboratorOrgId: 456
      });
      assertMatches(result, expected);
    });
  });

  describe('getEntityIdentifierTypes', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/entity-identifier-type')
      };

      const result = libraryHandlers.getEntityIdentifierTypes();
      assertMatches(result, expected);
    });
  });

  describe('getEntityIdentifierType', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/entity-identifier-type/123')
      };

      const result = libraryHandlers.getEntityIdentifierType({
        entityIdentifierTypeId: 123
      });
      assertMatches(result, expected);
    });
  });

  describe('createEntityIdentifierType', function() {
    it('makes the correct post request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: new RegExp('/entity-identifier-type'),
        data
      };

      const result = libraryHandlers.createEntityIdentifierType(data);
      assertMatches(result, expected);
    });
  });

  describe('updateEntityIdentifierType', function() {
    it('makes the correct put request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'put',
        path: new RegExp('/entity-identifier-type/123'),
        data
      };

      const result = libraryHandlers.updateEntityIdentifierType(
        {
          entityIdentifierTypeId: 123
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('getEntities', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library/123/entity')
      };

      const result = libraryHandlers.getEntities({
        libraryId: 123
      });
      assertMatches(result, expected);
    });
  });

  describe('getEntity', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library/123/entity/456')
      };

      const result = libraryHandlers.getEntity({
        libraryId: 123,
        entityId: 456
      });
      assertMatches(result, expected);
    });
  });

  describe('createEntity', function() {
    it('makes the correct post request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: new RegExp('/library/123/entity'),
        data
      };

      const result = libraryHandlers.createEntity(
        {
          libraryId: 123
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('updateEntity', function() {
    it('makes the correct put request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'put',
        path: new RegExp('/library/123/entity/456'),
        data
      };

      const result = libraryHandlers.updateEntity(
        {
          libraryId: 123,
          entityId: 456
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('uploadEntityProfileImage', function() {
    it('posts to the correct endpoint with header', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: new RegExp('/library/123/entity/456/profile-image'),
        headers: {
          'Content-Type': 'something'
        },
        data
      };

      const result = libraryHandlers.uploadEntityProfileImage(
        {
          libraryId: 123,
          entityId: 456,
          'Content-Type': 'something'
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('deleteEntity', function() {
    it('makes the correct delete request', function() {
      const expected = {
        method: 'delete',
        path: new RegExp('/library/123/entity/456')
      };

      const result = libraryHandlers.deleteEntity({
        libraryId: 123,
        entityId: 456
      });
      assertMatches(result, expected);
    });
  });

  describe('entityLookup', function() {
    it('makes the correct post request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: new RegExp('/entity-lookup'),
        data
      };

      const result = libraryHandlers.entityLookup(data);
      assertMatches(result, expected);
    });
  });

  describe('getEntityIdentifiers', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library/123/entity/456/identifier')
      };

      const result = libraryHandlers.getEntityIdentifiers({
        libraryId: 123,
        entityId: 456
      });
      assertMatches(result, expected);
    });
  });

  describe('getEntityIdentifier', function() {
    it('makes the correct get request', function() {
      const expected = {
        method: 'get',
        path: new RegExp('/library/123/entity/456/identifier/789')
      };

      const result = libraryHandlers.getEntityIdentifier({
        libraryId: 123,
        entityId: 456,
        entityIdentifierId: 789
      });
      assertMatches(result, expected);
    });
  });

  describe('createEntityIdentifier', function() {
    it('makes the correct post request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: new RegExp('/library/123/entity/456/identifier'),
        data
      };

      const result = libraryHandlers.createEntityIdentifier(
        {
          libraryId: 123,
          entityId: 456
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('updateEntityIdentifier', function() {
    it('makes the correct put request', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'put',
        path: new RegExp('/library/123/entity/456/identifier/789'),
        data
      };

      const result = libraryHandlers.updateEntityIdentifier(
        {
          libraryId: 123,
          entityId: 456,
          entityIdentifierId: 789
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('uploadEntityIdentifier', function() {
    it('posts to the correct endpoint with header', function() {
      const data = {
        my: 'data'
      };

      const expected = {
        method: 'post',
        path: new RegExp('/library/123/entity/456/identifier/789'),
        headers: {
          'Content-Type': 'something'
        },
        data
      };

      const result = libraryHandlers.uploadEntityIdentifier(
        {
          libraryId: 123,
          entityId: 456,
          entityIdentifierTypeId: 789,
          'Content-Type': 'something'
        },
        data
      );
      assertMatches(result, expected);
    });
  });

  describe('deleteEntityIdentifier', function() {
    it('makes the correct delete request', function() {
      const expected = {
        method: 'delete',
        path: new RegExp('/library/123/entity/456/identifier/789')
      };

      const result = libraryHandlers.deleteEntityIdentifier({
        libraryId: 123,
        entityId: 456,
        entityIdentifierId: 789
      });
      assertMatches(result, expected);
    });
  });
});
