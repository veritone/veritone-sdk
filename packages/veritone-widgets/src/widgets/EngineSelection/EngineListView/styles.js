import { lightBlack, darkBlack } from '../../../styles/modules/variables';
import { muiText } from '../../../styles/modules/muiTypography';

const body1Text = muiText('body1');

export default {
  engineSelection: {
    display: 'flex',
    height: '100%',
    backgroundColor: 'white',
  },
  engineSelectionContent: {
    height: '100%',
    flexGrow: 1,
    background: 'white',
  },
  engineListContainer: {
    height: '100%',
    flexDirection: 'column',
    display: 'flex',
    background: 'white',
    padding: '0 20px',
    minHeight: 500,
  },
  engineList: {
    flexGrow: 1,
  },
  tabs: {
    ...body1Text,
    display: 'inline-flex',
    width: '100%',
    height: 49,
    padding: '0 30px',
    color: lightBlack,
    borderBottom: '1px solid $grey4',
  },
  tab: {
    color: `${darkBlack} !important`,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '30px 50px',
    marginBottom: 'auto',
  },
  footerBtn: {
    fontWeight: 500,
  },
}
