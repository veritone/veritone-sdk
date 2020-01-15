import { darkBlack, grey1, grey4 } from '../../../styles/modules/variables';
import { muiText } from '../../../styles/modules/muiTypography';

const body1Text = muiText('body1');

export default {
  container: {
    width: '100%',
    height: 45,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: grey1,
    borderBottom: `1px solid ${grey4}`,
  },
  rightIconButtonContainer: {
    display: 'inline-block',
    width: 50,
  },
  multiTabsContainer: {
    flexGrow: 1,
  },
  singleTabContainer: {
    flexGrow: 1,
    paddingLeft: 25,
  },
  muiTabsFlexContainerOverride: {
    height: 46,
  },
  muiTabButtonRootOverride: {
    minWidth: 'initial !important', // hack: 'get rid of material-ui's responsive scaling of tabs
    color: darkBlack,
    fontSize: 14, // hack: 'get rid of material-ui's responsive scaling of tabs
  },
  singleTabLabel: {
    ...body1Text,
    textTransform: 'uppercase',
    color: darkBlack,
  },
}
