import { grey2, grey4, grey1 } from "../../../styles/modules/variables";

export default {
  tabsContainer: {
    width: '100%',
  },
  sectionTreeTab: {
    width: '100%',
    height: 50,
    borderBottom: `1px solid ${grey4} !important`,
    backgroundColor: `${grey1} !important`,
    '&$selected': {
      backgroundColor: `${grey2} !important`,
    },
    '& $muiButtonLabelOverride': {
      display: 'inline-flex',
      justifyContent: 'flex-start',

      '& label': {
        flexGrow: 1,
        textAlign: 'left',
      },
      '& $leftIcon': {
        marginRight: 15,
        fontSize: 20,
        display: 'flex',
      },
      '& $rightIcon': {
        justifySelf: 'flex-end',
        display: 'flex',
      },
    },
  },
  selected: {},
  muiButtonLabelOverride: {},
  leftIcon: {},
  rightIcon: {},
}
