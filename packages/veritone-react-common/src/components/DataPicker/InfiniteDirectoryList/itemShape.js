import { shape, string, oneOf } from 'prop-types';

export default shape({
  id: string.isRequired,
  type: oneOf(['folder', 'tdo']).isRequired,
  name: string,
  startDateTime: string,
  stopDateTime: string,
  thumbnailUrl: string,
  sourceImageUrl: string,
  primaryAsset: shape({
    name: string,
    contentType: string.isRequired,
    signedUri: string.isRequired
  }),
  streams: shape({
    uri: string.isRequired,
    protocol: string.isRequired
  }),
  createdDateTime: string.isRequired,
  modifiedDateTime: string.isRequired
})