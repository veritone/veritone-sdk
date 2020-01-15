

import { lightBlack } from '../../../../styles/modules/variables';
import { muiText } from '../../../../styles/modules/muiTypography';

const subheadText = muiText('subhead');
const captionText = muiText('caption');
const body1 = muiText('body1');

const audio1 = '#00BFA5';
const audio2 = 'rgba(0,191,165,0.05)';
const video1 = '#E81D63';
const video2 = 'rgba(233,30,99,0.05)';
const text1 = '#4A4A4A';
const text2 = 'rgba(117,117,117,0.05)';
const image1 = '#4CAF4F';
const image2 = 'rgba(76,175,80,0.05)';

export default {
  extensionListContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
  },
  extensionListHeader: {
    width: '100%',
  },
  extensionListTitle: {
    ...subheadText,
    paddingLeft: 20,
    color: lightBlack,
  },
  extensionListCloseButton: {
    position: 'absolute !important',
    top: 0,
    right: 0,
  },
  extensionList: {
    overflowY: 'auto',
    height: '100%',
  },
  extensionTypeContainer: {
    borderRadius: 2,
    border: '1px solid',
    margin: '12px auto !important',
    width: 'calc(100% - 40px) !important',
    padding: 10,
    '& $mediaTypeKey': {
      borderRadius: 2,
      color: 'white',
      textTransform: 'uppercase',
      ...captionText,
      padding: '2px 7px',
    },
    '&$audio': {
      borderColor: audio1,
      backgroundColor: audio2,
      '& $mediaTypeKey': {
        backgroundColor: audio1,
      },
    },
    '&$video': {
      borderColor: video1,
      backgroundColor: video2,
      '& $mediaTypeKey': {
        backgroundColor: video1,
      },
    },
    '&$text': {
      borderColor: text1,
      backgroundColor: text2,
      '& $mediaTypeKey': {
        backgroundColor: text1,
      },
    },
    '&$image': {
      borderColor: image1,
      backgroundColor: image2,
      '& $mediaTypeKey': {
        backgroundColor: image1,
      },
    },
    '& $mediaExtension': {
      ...body1,
    },
  },
  mediaTypeKey: {},
  mediaExtension: {},
  audio: {},
  video: {},
  text: {},
  image: {},
}
