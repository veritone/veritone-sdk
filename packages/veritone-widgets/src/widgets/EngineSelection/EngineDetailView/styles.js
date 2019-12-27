import merge from 'deepmerge';
import { fullWhite, darkBlack } from '../../../styles/modules/variables';
import { muiText } from '../../../styles/modules/muiTypography';
import commonCss, { avatar } from '../common.styles';

const titleText = muiText('title');
const menuText = muiText('menu');
const cssAvatar = avatar(130);

export default merge(
  commonCss,
  {
    detailsContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 100,
      backgroundColor: fullWhite,
    },
    back: {
      display: 'flex',
      paddingTop: 20,
      paddingLeft: 28,
      fontSize: 20,
    },
    backBtn: {
      ...titleText,
      fontWeight: '500 !important',
      color: darkBlack,
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
      '& $span': {
        marginLeft: 10,
      },
    },
    content: {
      padding: '40px 60px',
    },
    description: {
      paddingBottom: 22,
    },
    details: {
      paddingTop: 15,
    },
    sectionHeading: {
      ...menuText,
      paddingBottom: 15,
      color: darkBlack,
    },
    detailsContent: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    logo: {
      marginRight: 20,
    },
    avatar: {
      ...cssAvatar,
      boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.4)',
    },
    info: {
      paddingBottom: 30,
    },
    button: {
      paddingTop: 10,
    },
  }
)
