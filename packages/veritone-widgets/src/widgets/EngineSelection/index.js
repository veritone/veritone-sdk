import React from 'react';
import { func } from 'prop-types';
import { noop } from 'lodash';

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
    engineDetails: null
  };

  handleOnViewDetail = engine => {
    this.setState({
      showDetailView: true,
      engineDetails: engine
    });
  };

  handleOnHideDetail = engineId => {
    this.setState({
      showDetailView: false,
      engineDetails: null
    });
  };

  renderDetailView = () => (
    <EngineDetailView
      onCloseDetailView={this.handleOnHideDetail}
      engine={this.state.engineDetails}
    />
  );

  renderListView = () => (
    <EngineListView
      onViewDetail={this.handleOnViewDetail}
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
