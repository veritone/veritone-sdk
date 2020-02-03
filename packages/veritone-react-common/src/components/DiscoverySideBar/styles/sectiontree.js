import { grey1, grey2, grey4 } from '../../../styles/modules/variables';

export default {
  tabsContainer: {
    width: '100%',
  },
  sectionTreeTab: {
    width: '100%',
    height: 50,
    borderBottom: `1px solid ${grey4} !important`,
    backgroundColor: `${grey1} !important`,
    '& $dark': {
      backgroundColor: `${grey2} !important`,
    },
    '& $muiButtonLabelOverride': {
      display: 'inline-flex',
      justifyContent: 'flex-start',
      '& $label': {
        flexGrow: 1,
        textAlign: 'left',
      },
      '& $leftIcon': {
        marginRight: 15,
      },
      '& $rightIcon': {
        justifySelf: 'flex-end',
      },
    },
  },
  dark: {},
  muiButtonLabelOverride: {},
  label: {},
  leftIcon: {},
  rightIcon: {},
}
