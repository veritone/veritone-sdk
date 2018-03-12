import React from 'react';
import { func } from 'prop-types';
import { DiscoverySideBar as Sidebar } from 'veritone-react-common';
import { noop } from 'lodash';

import { modules } from 'veritone-redux-common';
const { engine: engineModule } = modules;

import * as engineSelectionModule from '../../redux/modules/engineSelection';

import EngineListView from './EngineListView/';
import EngineDetailView from './EngineDetailView/';

import withMuiThemeProvider from '../../shared/withMuiThemeProvider';

import widget from '../../shared/widget';

@withMuiThemeProvider
class EngineSelectionWidget extends React.Component {
  static propTypes = {
    onSave: func.isRequired,
    onCancel: func.isRequired
  };

  static defaultProps = {
    onSave: noop,
    onCancel: noop
  };

  state = {
    showDetailView: false,
    engineDetails: null,
    selectAll: false
  };

  handleShowDetailView = engine => {
    this.setState({
      showDetailView: true,
      engineDetails: engine
    });
  };

  handleHideDetailView = engineId => {
    this.setState({
      showDetailView: false,
      engineDetails: null
    });
  };

  renderDetailView = () => (
    <EngineDetailView
      onClose={this.handleHideDetailView}
      engine={this.state.engineDetails}
    />
  );

  renderListView = () => (
    <EngineListView
      showDetailView={this.handleShowDetailView}
      onSave={this.props.onSave}
      onCancel={this.props.onCancel}
    />
  );

  render() {
    return this.state.showDetailView
      ? this.renderDetailView()
      : this.renderListView();
  }
}

export default widget(EngineSelectionWidget);
