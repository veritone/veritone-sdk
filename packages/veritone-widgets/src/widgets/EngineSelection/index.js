import React from 'react';
import { connect } from 'react-redux';
import { func, arrayOf, string, bool, shape } from 'prop-types';
import { withMuiThemeProvider } from 'veritone-react-common';

import EngineListView from './EngineListView/';
import EngineDetailView from './EngineDetailView/';

import * as engineSelectionModule from '../../redux/modules/engineSelection';

import widget from '../../shared/widget';

@withMuiThemeProvider
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
class EngineSelection extends React.Component {
  static propTypes = {
    onSave: func.isRequired,
    onCancel: func.isRequired,
    actionMenuItems: arrayOf(
      shape({
        buttonText: string,
        iconClass: string,
        onClick: func.isRequired
      })
    ),
    fetchEngines: func.isRequired,
    setAllEnginesSelected: func.isRequired,
    setDeselectedEngineIds: func.isRequired,
    allEnginesSelected: bool,
    initialDeselectedEngineIds: arrayOf(string),
    initialSelectedEngineIds: arrayOf(string),
    selectedEngineIds: arrayOf(string),
    deselectedEngineIds: arrayOf(string),
    hideActions: bool
  };

  static defaultProps = {
    deselectedEngineIds: [],
    allEnginesSelected: false,
    hideActions: false
  };

  state = {
    showDetailView: false,
    engineDetails: null
  };

  componentDidMount() {
    this.props.setDeselectedEngineIds(this.props.initialDeselectedEngineIds);
    this.props.setAllEnginesSelected(this.props.allEnginesSelected);
    this.props.fetchEngines();
  }

  save = () => {
    return this.props.onSave(
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

  render() {
    return this.state.showDetailView ? (
      <EngineDetailView
        onCloseDetailView={this.handleHideDetail}
        engine={this.state.engineDetails}
      />
    ) : (
      <EngineListView
        onViewDetail={this.handleViewDetail}
        onSave={this.save}
        onCancel={this.props.onCancel}
        actionMenuItems={this.props.actionMenuItems}
        allEnginesSelected={this.props.allEnginesSelected}
        hideActions={this.props.hideActions}
        initialSelectedEngineIds={this.props.initialSelectedEngineIds}
      />
    );
  }
}

const EngineSelectionWidget = widget(EngineSelection);
export { EngineSelectionWidget };
