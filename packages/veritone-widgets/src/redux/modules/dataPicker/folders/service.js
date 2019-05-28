import { call } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';

import { fetchGraphQL } from '../service';

const {
  auth: authModule,
  config: configModule,
} = modules;

import { helpers } from 'veritone-redux-common';
const { fetchGraphQLApi } = helpers;


export function* getRootFolder() {
  const query = `
  {
    rootFolders(type: cms) {
      id
      name
      ownerId
    }
  }`;
  const rootFolder = yield call(fetchGraphQL, query);
  return rootFolder;
};

export function* getFolder(id, folderOffset=0, tdoOffset=0){
  const query = `
  {
    folder(id: "${id}") {
      id
      name
      createdDateTime
      modifiedDateTime
      childFolders(offset: ${folderOffset}) {
        records {
          id
          name
          description
          createdDateTime
          modifiedDateTime
        }
      }
      childTDOs(offset: ${tdoOffset}) {
        records {
          id
          name
          startDateTime
          stopDateTime
          thumbnailUrl
          sourceImageUrl
          primaryAsset (assetType: "media") {
            id
            name
            contentType
            signedUri
          }
          createdDateTime
          modifiedDateTime
          streams {
            uri
            protocol
          }
        }
      }
    }
  }`;

  const folder = yield call(fetchGraphQL, query);
  return folder;
}
