import { lightBlack, fullWhite } from '../../../../../styles/modules/variables';
import { muiText } from '../../../../../styles/modules/muiTypography';

const headlineText = muiText('headline');

export default {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    '& $message': {
      ...headlineText,
      fontWeight: '200 !important',
      color: lightBlack,
      margin: '15px 0',
    },
    '& $errorIcon': {
      height: 105,
      width: 105,
      color: 'rgba(0, 0, 0, 0.26)',
    },
    '& $button': {
      backgroundColor: fullWhite,
    },
    '& $icon': {
      marginRight: 10,
    }
  },
  message: {},
  errorIcon: {},
  button: {},
  icon: {},
}
