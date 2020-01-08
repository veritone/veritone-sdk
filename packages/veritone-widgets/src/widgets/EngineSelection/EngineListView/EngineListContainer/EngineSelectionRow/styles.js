import merge from 'deepmerge';
import { grey4, lightBlack, blue1 } from '../../../../../styles/modules/variables';
import commonCss, { avatar } from '../../../common.styles';

export default merge(
  commonCss,
  {
    row: {
      paddingBottom: 20,
      maxHeight: 177,
      borderTop: `1px solid ${grey4}`,
    },
    avatar: {
      ...avatar(),
    },
    engineSelect: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    primary: {
      borderRight: `2px solid ${grey4}`,
    },
    icon: {
      height: '100%',
    },
    title: {
      '&:hover': {
        cursor: 'pointer',
        color: blue1,
      },
    },
    secondary: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between',
      minWidth: '37%',
      maxWidth: '37%',
      padding: '0 20px',
      paddingRight: 0,
    },
    description: {
      fontSize: 13,
      lineHeight: '20px',
      color: lightBlack,
      marginTop: 2,
    },
    logos: {
      flexWrap: 'wrap',
      alignContent: 'flex-start',
      justifyContent: 'space-between',
      width: 122,
      marginRight: 15,
    },
    logo: {
      '&:first-child': {
        marginBottom: 20,
      }
    },
    main: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  }
)
