import React from 'react';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';

import { omit, keyBy } from 'lodash';

import { DiscoverySideBar as Sidebar } from 'veritone-react-common';

import { modules } from 'veritone-redux-common';
const { engine: engineModule } = modules;

import * as engineSelectionModule from '../../redux/modules/engineSelection';

import styles from './styles.scss';

import EngineListView from './EngineListView/';
import EngineDetailView from './EngineDetailView/';

import widget from '../../shared/widget';


@connect(
  (state) => ({
    engines: engineModule.getEngines(state),
    engineSearchResults: engineModule.getEngineSearchResults(state)
  }),
  {},
  null,
  { withRef: true }
)
class EngineSelectionWidget extends React.Component {
  static propTypes = {};

  static defaultProps = {
    engines: {}
  }

  state = {
    showDetailView: false,
    engineDetails: null,
    selectAll: false,
  }

  handleShowDetailView = engine => {
    this.setState({
      showDetailView: true,
      engineDetails: engine
    })
  }

  handleHideDetailView = engineId => {
    this.setState({
      showDetailView: false,
      engineDetails: null
    })
  }

  _renderDetailView = () => (
    <EngineDetailView onClose={this.handleHideDetailView} engine={this.state.engineDetails} />
  );

  _renderListView = () => (
    <EngineListView
      engines={this.props.engines}
      engineSearchResults={this.props.engineSearchResults} 
      showDetailView={this.handleShowDetailView}
    />
  )


  render() {
    console.log('engines', this.props)
    return (
      this.state.showDetailView ?
        this._renderDetailView() :
        this._renderListView()
    );
  }
}

export default widget(EngineSelectionWidget);
