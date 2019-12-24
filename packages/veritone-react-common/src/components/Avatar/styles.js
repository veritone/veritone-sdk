import { lightBlack } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const captionText = muiText('caption');

export default {
  container: {
    overflow: 'hidden',
    borderRadius: '50%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  labelBackgroundContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: lightBlack,
    textAlign: 'center',
    height: '30%',
    width: '100%',
    '& span': {
      ...captionText,
      fontWeight: '200 !important',
      color: 'white',
    }
  }
}
