import { lightBlack } from '../../../styles/modules/variables';
import { muiText } from '../../../styles/modules/muiTypography';

const body1Text = muiText('body1');

export default {
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    '& $separator': {
      ...body1Text,
      color: lightBlack,
      padding: '0 10px',
    },
    '& $dateTimeTZ': {
      width: 40,
      '& input': {
        color: lightBlack,
        borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
        padding: '3px 0',
      }
    }
  },
  separator: {},
  dateTimeTZ: {},
}
