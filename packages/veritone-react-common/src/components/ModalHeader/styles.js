
import { grey1, fullWhite } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const titleText = muiText('title');

export default {
  modalHeader: {
    backgroundColor: '#1f2532',
    '& span': {
      color: grey1,
    },
  },
  fullScreenTopBar: {
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    '& $topBarTitle': {
      ...titleText,
      color: grey1,
      alignSelf: 'center',
    },
    '& $iconGroup': {
      display: 'flex',
      justifyContent: 'space-between',
      alignSelf: 'center',
    },
  },
  icon: {
    color: fullWhite,
  },
  topBarTitle: {},
  iconGroup: {},
}
