import { grey5, blue1, grey1, grey4 } from '../../../styles/modules/variables';
import { muiText } from '../../../styles/modules/muiTypography';

const menuText = muiText('menu');
const body1Text = muiText('body1');
const captionText = muiText('caption');

export default {
  urlUploader: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  urlTextField: {
    ...menuText,
    marginTop: 0,
    marginBottom: '5px !important',
    display: 'inline-block !important',
    '& $fileUrlInputError': {
      color: '#ff1744 !important',
    },
    '& $fileUrlInputFocused': {
      color: blue1,
    },
    '& $fileUrlInputInkbar': {
      backgroundColor: blue1,
    },
    '& $fileUrlInputInkbarError': {
      backgroundColor: '#ff1744',
    },
  },
  fileUrlPickerInputRoot: {
    width: '90%',
    marginTop: '13px !important',
  },
  fileUlrPickerInput: {
    padding: '5px 0',
  },
  urlUploaderInfoBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: grey1,
    border: `4px dashed ${grey4}`,
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 3,
    width: '100%',
    flex: 'auto',
    textAlign: 'center',
  },
  correctUrlText: {
    ...body1Text,
    marginBottom: 15,
  },
  confirmLicenseText: {
    ...captionText,
    color: grey5,
  },
  imageContainer: {
    display: 'flex',
    marginTop: 3,
    padding: 10,
    backgroundColor: '#777',
  },
  fileImage: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    '& img': {
      alignSelf: 'center',
      width: 'auto',
      height: '100%',
      display: 'block',
    },
  },
  fileUrlInputError: {},
  fileUrlInputFocused: {},
  fileUrlInputInkbar: {},
  fileUrlInputInkbarError: {},
}
