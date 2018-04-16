import React from 'react';
import { connect } from 'react-redux';
import { func, arrayOf, string, bool } from 'prop-types';
import { noop } from 'lodash';

import EngineListView from './EngineListView/';
import EngineDetailView from './EngineDetailView/';

import * as engineSelectionModule from '../../redux/modules/engineSelection';

import widget from '../../shared/widget';

@connect(
  state => ({
    deselectedEngineIds: engineSelectionModule.getDeselectedEngineIds(state),
    selectedEngineIds: engineSelectionModule.getSelectedEngineIds(state)
  }),
  {
    fetchEngines: engineSelectionModule.refetchEngines,
    setDeselectedEngineIds: engineSelectionModule.setDeselectedEngineIds,
    setAllEnginesSelected: engineSelectionModule.setAllEnginesSelected
  },
  null,
  { withRef: true }
)
class EngineSelectionWidget extends React.Component {
  static propTypes = {
    onSave: func.isRequired,
    onCancel: func.isRequired,
    fetchEngines: func.isRequired,
    setAllEnginesSelected: func.isRequired,
    setDeselectedEngineIds: func.isRequired,
    allEnginesSelected: bool,
    selectedEngineIds: arrayOf(string),
    deselectedEngineIds: arrayOf(string),
    hideActions: bool
  };

  static defaultProps = {
    onSave: noop,
    onCancel: noop,
    deselectedEngineIds: [],
    allEnginesSelected: false,
    hideActions: false
  };

  state = {
    showDetailView: false,
    engineDetails: null
  };

  componentDidMount() {
    this.props.setDeselectedEngineIds(this.props.deselectedEngineIds);
    this.props.setAllEnginesSelected(this.props.allEnginesSelected);
    this.props.fetchEngines();
  }

  save = () => {
    this.props.onSave(
      this.props.allEnginesSelected
        ? this.props.deselectedEngineIds
        : this.props.selectedEngineIds
    );
  };

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
      onSave={this.save}
      onCancel={this.props.onCancel}
      allEnginesSelected={this.props.allEnginesSelected}
      hideActions={this.props.hideActions}
    />
  );

  render() {
    return this.state.showDetailView
      ? this.renderDetailView()
      : this.renderListView();
  }
}

export default widget(EngineSelectionWidget);
