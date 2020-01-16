import { grey2, darkBlack, blue3 } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const body1Text = muiText('body1');

export default {
  container: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
    left: 0,
    right: 0,
    // copied from materialUi
    transition: 'margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms ,width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms !important',
    '&$selected': {
      background: '#f6fbff !important',
    },
  },
  actionButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #e0e0e0',
  },
  leftButtonContainer: {
    flexGrow: 0,
    '& $highlight': {
      background: grey2,
      height: '100%',
      display: 'inline-block',
    },
  },
  rightContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    padding: '0 22px',
    ...body1Text,
    color: darkBlack,
    '& $selected': {
      fontWeight: 400,
      color: blue3,
    },
    '& $rightIconButtons': {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        height: 22,
      },
    },
  },
  selected: {},
  highlight: {},
  rightIconButtons: {},
}
