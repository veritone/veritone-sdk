import { grey1, grey4, blue1, fullWhite } from '../../../styles/modules/variables';
import { muiText } from '../../../styles/modules/muiTypography';

const headlineText = muiText('headline');
const display2Text = muiText('display2');
const body1Text = muiText('body1');
const buttonText = muiText('button');
export default {
  fileUploader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: grey1,
    border: `4px dashed ${grey4}`,
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%',
    position: 'relative',
    '& $uploaderContainer': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      '& $fileUploadIcon': {
        color: `${blue1} !important`,
        fontSize: '112px !important',
        lineHeight: '112px !important',
      }
    }
  },
  fileUploaderAcceptText: {
    color: blue1,
    cursor: 'default',
    ...headlineText,
  },
  flat: {
    backgroundColor: `${fullWhite} !important`,
  },
  fileUploadIcon: {
    color: '#9a9a9a',
    ...display2Text,
  },
  fileUploaderSubtext: {
    ...body1Text,
    textAlign: 'center',
    textTransform: 'none',
    marginBottom: '0 !important',
    '&$subtextBlue': {
      marginLeft: 5,
      color: blue1,
    }
  },
  uploaderOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  },
  extensionListOpenButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    ...buttonText,
    textTransform: 'none',
    fontWeight: 'normal !important',
    color: blue1,
    cursor: 'pointer',
  },
  uploaderContainer : {},
  subtextBlue: {},
}
