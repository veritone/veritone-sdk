import { darkBlack } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const body1Text = muiText('body1');
const body2Text = muiText('body2');
const captionText = muiText('caption');

export default {
  popover: {
    marginTop: '18px',
  },
  userNullState: {
    ...body1Text,
    padding: '20px 0 !important',
    margin: '0 auto',
    width: '200px',
    textAlign: 'center',
    cursor: 'default !important',
  },
  header: {
    display: 'flex',
    '&:focus': {
      outline: 'none', // prevent outline around profile subheade
    },
    '& $userAvatar': {
      paddingRight: '15px',
    },
    '& $userProfile': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      '& $fullName': {
        ...body2Text,
        color: darkBlack,
      },
      '& $username': {
        ...captionText,
      },
      '& $editButton': {
        padding: '5px 0 10px',
        '& div': {
          // fix shadow
          lineHeight: '36px',
        },
      },
    },
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {},
  userProfile: {},
  fullName: {},
  username: {},
  editButton: {},
}