import { lightBlack } from '../../../styles/modules/variables';
import { muiText } from '../../../styles/modules/muiTypography';
const progressItemBorder = '1px solid #E0E0E0';
const progressItemHeight = '52px';
const outterPadding = '16px';
const audioColor = '#00BFA5';
const videoColor = '#E81D63';
const textColor = '#4A4A4A';
const imageColor = '#4CAF4F';
const body1Text = muiText('body1');
const headlineText = muiText('headline');

export default {
  fileProgressItem: {
    borderBottom: progressItemBorder,
    overflow: 'hidden',
  },
  fileName: {
    ...body1Text,
    display: 'inline-block',
    color: lightBlack,
    paddingLeft: 10,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '80%',
    whiteSpace: 'nowrap',
    lineHeight: progressItemHeight,
    verticalAlign: 'text-top',
  },
  sizeContainer: {
    display: 'inline-block',
    textAlign: 'center',
    width: 'calc(20% - 40px)',
    '& $fileSize': {
      ...body1Text,
      color: lightBlack,
    },
    '&:lastChild': {
      marginRight: 14,
    },
  },
  fileIconContainer: {
    borderRadius: '100%',
    height: `calc(${progressItemHeight} - ${outterPadding})`,
    width: `calc(${progressItemHeight} - ${outterPadding})`,
    minWidth: `calc(${progressItemHeight} - ${outterPadding})`,
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: 14,

    '& $fileIcon': {
      display: 'block',
      margin: '0 auto',
      marginTop: 6,
      color: 'white',
    },
    '&$audio': {
      backgroundColor: audioColor,
    },
    '&$video': {
      backgroundColor: videoColor,
    },
    '&$image': {
      backgroundColor: imageColor,
    },
    '&$text': {
      backgroundColor: textColor,
    },
  },
  fileProgressItemOverlay: {
    height: progressItemHeight,
    lineHeight: progressItemHeight,
    float: 'left',
    position: 'relative',
    marginTop: `-${progressItemHeight}`,
    zIndex: 1,
    width: '100%',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  },
  progressTextOverlay: {
    marginTop: `-${progressItemHeight}`,
    position: 'relative',
    float: 'left',
    width: '100%',
    '& $progressText': {
      ...headlineText,
      color: 'rgba(33,150,243,0.38)',
      lineHeight: `${progressItemHeight} !important`,
      height: progressItemHeight,
      marginLeft: 70,
    },
  },
  fileProgressBar: {
    height: `${progressItemHeight} !important`,
    backgroundColor: 'white !important',
  },
  fileProgressBarPrimary: {
    backgroundColor: 'rgba(33,150,243,0.12) !important',
  },
  fileProgressBarError: {
    backgroundColor: '#FFEBEE !important',
  },
  progressText: {},
  fileIcon: {},
  fileSize: {},
  audio: {},
  video: {},
  image: {},
  text: {},
}
