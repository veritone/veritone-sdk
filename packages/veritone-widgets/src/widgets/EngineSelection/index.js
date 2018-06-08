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
  (state, { _widgetId }) => ({
    deselectedEngineIds: engineSelectionModule.getDeselectedEngineIds(
      state,
      _widgetId
    ),
    selectedEngineIds: engineSelectionModule.getSelectedEngineIds(
      state,
      _widgetId
    )
  }),
  {
    initializeWidget: engineSelectionModule.initializeWidget,
    fetchEngines: engineSelectionModule.refetchEngines,
    setDeselectedEngineIds: engineSelectionModule.setDeselectedEngineIds,
    setAllEnginesSelected: engineSelectionModule.setAllEnginesSelected
  },
  null,
  { withRef: true }
)
class EngineSelection extends React.Component {
  static propTypes = {
    _widgetId: string.isRequired,
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
    initializeWidget: func.isRequired,
    allEnginesSelected: bool,
    initialDeselectedEngineIds: arrayOf(string),
    initialSelectedEngineIds: arrayOf(string),
    selectedEngineIds: arrayOf(string),
    deselectedEngineIds: arrayOf(string),
    hideActions: bool
  };

  static defaultProps = {
    initialSelectedEngineIds: [],
    initialDeselectedEngineIds: [],
    allEnginesSelected: false,
    hideActions: false
  };

  state = {
    showDetailView: false,
    engineDetails: null
  };

  UNSAFE_componentWillMount() {
    this.props.initializeWidget(this.props._widgetId);
  }

  componentDidMount() {
    this.props.setDeselectedEngineIds(
      this.props._widgetId,
      this.props.initialDeselectedEngineIds
    );
    this.props.setAllEnginesSelected(
      this.props._widgetId,
      this.props.allEnginesSelected
    );
    this.props.fetchEngines(this.props._widgetId);
  }

  save = () => {
    return this.props.onSave(
      this.props.allEnginesSelected
        ? this.props.deselectedEngineIds
        : this.props.selectedEngineIds
    );
  };

  veritoneAppDidAuthenticate = () => {
    this.props.fetchEngines(this.props._widgetId);
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
        id={this.props._widgetId}
        onCloseDetailView={this.handleHideDetail}
        engine={this.state.engineDetails}
      />
    ) : (
      <EngineListView
        id={this.props._widgetId}
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
