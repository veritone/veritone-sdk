import { lightBlack } from '../../../styles/modules/variables';

export default {
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    '& $todayIcon': {
      color: lightBlack,
      marginRight: 25,
    },
  },
  dateTimeTZ: {
    '& input': {
      color: lightBlack,
      borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
      padding: '3px 0',
    }
  },
  todayIcon: {},
}
