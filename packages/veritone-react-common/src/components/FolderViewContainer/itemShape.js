import { shape, string, oneOf } from 'prop-types';

export default shape({
  id: string.isRequired,
  type: oneOf(['folder', 'tdo']).isRequired,
  name: string,
  primaryAsset: shape({
    name: string,
    contentType: string.isRequired,
    signedUri: string
  }),
  createdDateTime: string.isRequired,
  modifiedDateTime: string.isRequired
})
