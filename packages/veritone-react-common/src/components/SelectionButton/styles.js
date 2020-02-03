import { barelyBlack, blue400 } from '../../styles/modules/variables';

export default {
  condensedButton: {
    paddingLeft: '0 !important',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    backgroundColor: `${barelyBlack} !important`,
    '&:hover:not([disabled]):not($selected)': {
      backgroundColor: 'rgba(33, 150, 243, 0.1) !important',
    },
  },
  selected: {
    borderColor: `${blue400} !important`,
    backgroundColor: 'rgba(33, 150, 243, 0.18) !important',
    '&:hover': {
      backgroundColor: 'unset !important',
    },
  },
  condensed: {
    height: '1.7em !important',
  },
}
