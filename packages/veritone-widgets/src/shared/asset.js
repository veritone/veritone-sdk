import { modules } from 'veritone-redux-common';
import {isFunction} from "lodash";
const { auth: authModule, config: configModule } = modules;

export const saveAsset = (
  { tdoId, contentType, type, sourceData, isUserEdited },
  fileData,
  dispatch,
  getState
) => {
  if (!isFunction(dispatch) || !isFunction(getState)) {
    throw new Error('saveAsset requires dispatch and getState functions');
  }
  const createAssetQuery = `mutation createAsset(
    $tdoId: ID!,
    $type: String,
    $contentType: String,
    $file: UploadedFile,
    $sourceData: SetAssetSourceData,
    $isUserEdited: Boolean
  ){
    createAsset( input: {
      containerId: $tdoId,
      type: $type,
      contentType: $contentType,
      sourceData: $sourceData,
      file: $file,
      isUserEdited: $isUserEdited
    })
    { id }
  }`;

  const variables = {
    tdoId,
    type,
    contentType,
    file: fileData,
    sourceData,
    isUserEdited: isUserEdited || false
  };

  const formData = new FormData();
  formData.append('query', createAssetQuery);
  formData.append('variables', JSON.stringify(variables));
  if (contentType === 'application/json') {
    formData.append(
      'file',
      new Blob([JSON.stringify(fileData)], { type: contentType })
    );
  } else {
    formData.append('file', new Blob([fileData], { type: contentType }));
  }
  const config = configModule.getConfig(getState());
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = authModule.selectSessionToken(getState());
  return fetch(graphQLUrl, {
    method: 'post',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(r => {
      return r.json();
    })
    .then(res => {
      if (res.errors) {
        return Promise.reject(res);
      }
      return res;
    });
};

// Remove AWS prefixed params, keep the rest.
export const removeAwsSignatureParams = uri => {
  const amzParamKeyRegex = /[x..X]-[a..A][m..M][z..Z]/;
  if (!uri || !uri.includes('?') || !amzParamKeyRegex.test(uri)) {
    return uri;
  }
  const nakedUri = uri.split('?')[0];
  const uriParamsStr = uri.split('?')[1];
  const nonAwsSignatureParams = uriParamsStr
    .split('&')
    .filter(
      uriParam =>
        uriParam && uriParam.length && !amzParamKeyRegex.test(uriParam)
    );
  if (nonAwsSignatureParams.length) {
    return `${nakedUri}?${nonAwsSignatureParams.join('&')}`;
  }
  return nakedUri;
};
