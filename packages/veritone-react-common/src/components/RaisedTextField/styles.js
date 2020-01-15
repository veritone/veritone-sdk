import { lightBlack } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const body1Text = muiText('body1');
const body2Text = muiText('body2');

export default {
  paper: {
    height: 65,
    marginBottom: 2,
  },
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 25px',
  },
  label: {
    ...body2Text,
    width: '40%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  value: {
    ...body1Text,
    color: lightBlack,
    width: '100%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  actionIconContainer: {
    width: 70,
  },
  actionIcon: {
    textAlign: 'right',
  },
}
