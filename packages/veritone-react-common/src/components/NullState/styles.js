import { darkBlack } from '../../styles/modules/variables';
export default {
  nullStateView: {
    paddingTop: '25vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '& $titleText': {
      color: darkBlack,
      fontSize: 20,
      fontWeight: 300,
      lineHeight: '24px',
      marginBottom: 10,
    },
    '& $buttonStyle': {
      marginTop: 20,
      width: 'fit-content',
      height: 36,
    },
  },
  inWidgetView: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column',
    '& $titleText': {
      color: darkBlack,
      fontSize: 20,
      fontWeight: 300,
      lineHeight: '24px',
      marginBottom: 10,
    },

    '& $buttonStyle': {
      marginTop: 20,
      width: 'fit-content',
      height: 36,
    },
  },
  titleText: {},
  buttonStyle: {},
};
