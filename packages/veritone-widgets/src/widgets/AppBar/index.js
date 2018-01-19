import { connect } from 'react-redux';
import { AppBar } from 'veritone-react-common';
import { modules } from 'veritone-redux-common'
const { user } = modules;
import widget from '../../shared/widget';

const connectedAppBar = connect(
  state => ({
    user: user.selectUser(state),
    enabledApps: user.selectEnabledApps(state),
    enabledAppsFailedLoading: user.enabledAppsFailedLoading(state),
    isFetchingApps: user.isFetchingApps(state)
  }),
  { fetchEnabledApps: user.fetchEnabledApps },
  null,
  { withRef: true }
)(AppBar);

export default widget(connectedAppBar);
