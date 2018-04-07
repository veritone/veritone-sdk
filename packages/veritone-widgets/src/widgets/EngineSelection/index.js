import React from 'react';
import { connect } from 'react-redux';
import { func } from 'prop-types';
import { noop } from 'lodash';

import EngineListView from './EngineListView/';
import EngineDetailView from './EngineDetailView/';

import { withMuiThemeProvider } from 'veritone-react-common';
import * as engineSelectionModule from '../../redux/modules/engineSelection';

import widget from '../../shared/widget';

@connect(
  state => ({}),
  {
    fetchEngines: engineSelectionModule.refetchEngines
  },
  null,
  { withRef: true }
)
@withMuiThemeProvider
class EngineSelectionWidget extends React.Component {
  static propTypes = {
    onSave: func.isRequired,
    onCancel: func.isRequired,
    fetchEngines: func.isRequired
  };

  static defaultProps = {
    onSave: noop,
    onCancel: noop
  };

  state = {
    showDetailView: false,
    engineDetails: null
  };

  componentDidMount() {
    this.props.fetchEngines();
  }

  veritoneAppDidAuthenticate = () => {
    this.props.fetchEngines();
  };

  handleViewDetail = engine => {
    this.setState({
      showDetailView: true,
      engineDetails: engine
    });
  };

  handleHideDetail = engineId => {
    this.setState({
      showDetailView: false,
      engineDetails: null
    });
  };

  renderDetailView = () => (
    <EngineDetailView
      onCloseDetailView={this.handleHideDetail}
      engine={this.state.engineDetails}
    />
  );

  renderListView = () => (
    <EngineListView
      onViewDetail={this.handleViewDetail}
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
