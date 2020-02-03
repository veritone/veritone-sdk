import { lightBlack } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const muiTextStyle = muiText('body1');

export default {
  container: {
    ...muiTextStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fafafa !important',
    color: lightBlack,
    // copied from material-ui
    transition: 'margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    '& > *': {
      paddingLeft: 30,
    },
    '& > a': {
      color: lightBlack,
    }
  }
}
