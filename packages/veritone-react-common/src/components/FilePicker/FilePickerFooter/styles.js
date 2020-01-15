import { filePickerMargin, grey1 } from '../../../styles/modules/variables';

export default {
  filePickerFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    padding: filePickerMargin,
    backgroundColor: grey1,
    '& > *': {
      marginLeft: `calc(${filePickerMargin} / 2) !important`,
    }
  },
  hasIntercom: {
    '& > *:lastChild': {
      marginRight: 80,
    }
  }
}
