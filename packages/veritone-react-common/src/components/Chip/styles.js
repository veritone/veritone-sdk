import { barelyBlack, grey4 } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const captionText = muiText('caption');

export default {
  root: {
    ...captionText,
    textTransform: 'lowercase',
    backgroundColor: `${grey4} !important`,
    border: `1px solid ${barelyBlack} !important`,
  }
};
