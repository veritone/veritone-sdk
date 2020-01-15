import { grey1, filePickerMargin } from '../../styles/modules/variables';

export default {
  filePicker: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: grey1,
    maxWidth: '100%',
  },
  filePickerNonModal: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  filePickerPaperOverride: {
    maxWidth: '100% !important',
    maxHeight: '100% !important',
    minHeight: 411,
    position: 'relative',
  },
  filePickerBody: {
    flex: '1',
    display: 'flex',
    padding: filePickerMargin,
    overflowY: 'auto',
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    paddingBottom: '0.25em',
  },
}
