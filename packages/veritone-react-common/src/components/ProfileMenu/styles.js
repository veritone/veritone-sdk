import { darkBlack } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const body1Text = muiText('body1');
const captionText = muiText('caption');
const titleText = muiText('title');

export default {

  paper: {
    borderRadius: '13px',
    boxShadow: '0 2px 6px 0 rgba(96,107,134,0.5)'
  },
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
    padding: '30px 30px 15px 30px',
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
        ...titleText,
        color: darkBlack,
      },
      '& $username': {
        ...captionText,
      },
      '& $editButton': {
        padding: '0px 0 10px',
        '& div': {
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
  avatarProfile: {
    height: '35px',
    width: '35px',
    fontSize: '18px',
    paddingTop: '2px'
  },
  avatar: {
    height: '58px',
    width: '58px',
    marginRight: '20px',
  },
  userProfile: {},
  fullName: {},
  username: {},
  editButton: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',

  },
  settingsButton: {
    height: '41px',
    textTransform: 'capitalize',
    color: '#4284F4',
    borderColor: '#4284F4',

  },
  editProfileButton: {
    height: '41px',
    textTransform: 'capitalize',
    backgroundColor: '#4284F4',
    marginRight: '10px',
    boxShadow: 'none',
    color: '#FFFFFF'
  },
  logoutButton:  {
    marginTop: '20px',
    marginBottom: '13px',
    height: '42px',
    textTransform: 'capitalize',
    borderRadius: '21px',
    width: '80%',
    fontColor: '#000'
  }

}
