import React from 'react';
import { connect } from 'react-redux';
import { bool, func, objectOf, any } from 'prop-types';
import { isEmpty } from 'lodash';

import LibCheckbox from 'material-ui/Checkbox';
import Tabs, { Tab } from 'material-ui/Tabs';

import { DiscoverySideBar as Sidebar } from 'veritone-react-common';

import { modules } from 'veritone-redux-common';
const { engine: engineModule } = modules;

import styles from './styles.scss';

import SelectBar from './SelectBar';
import EngineSelectionRow from './EngineSelectionRow';

import * as engineSelectionModule from '../../../redux/modules/engineSelection';



const exampleSectionTree = {
  children: [
    {
      label: 'Categories',
      children: [{ formComponentId: 'select-station-form' }]
    },
    // {
    //   label: 'Price & Rating',
    //   children: [{
    //     label: 'SubSection 1',
    //     children: [{ formComponentId: 'select-station-form' }]
    //   }]
    // },
    // {
    //   label: 'Deployment Model',
    //   children: [
    //     {
    //       label: 'SubSection 1',
    //       children: [{ formComponentId: 'select-station-form' }]
    //     },
    //     {
    //       label: 'SubSection 2',
    //       children: [{ formComponentId: 'select-station-form' }]
    //     }
    //   ]
    // },
    // {
    //   label: 'Attributes',
    //   children: [
    //     {
    //       label: 'SubSection 1',
    //       children: [{ formComponentId: 'select-station-form' }]
    //     },
    //     {
    //       label: 'SubSection 2',
    //       children: [{ formComponentId: 'select-station-form' }]
    //     }
    //   ]
    // }
  ]
};

// const exampleSelectedFilters = [
//   {
//     label: 'filter category one',
//     number: 5,
//     id: '1'
//   },
//   {
//     label: 'filter category 2',
//     number: 10,
//     id: '2'
//   }
// ];


@connect(
  (state, ownProps) => ({
    allEnginesChecked: engineSelectionModule.allEnginesChecked(state),
    selectedEngineIds: engineSelectionModule.getSelectedEngineIds(state)
  }),
  {
    checkAllEngines: engineSelectionModule.checkAllEngines,
    uncheckAllEngines: engineSelectionModule.uncheckAllEngines,
    searchEngines: engineModule.searchEngines
  },
  null,
  { withRef: true }
)
export default class EngineListView extends React.Component {
  static propTypes = {
    showDetailView: func.isRequired,
    engineSearchResults: objectOf(any)
  };

  static defaultProps = {
    engines: {}
  }

  state = {
    tabIndex: 1
  }

  handleCheckAll = () => {
    this.props.allEnginesChecked ?
      this.props.uncheckAllEngines(this.props.engines) :
      this.props.checkAllEngines(this.props.engines);
  }

  handleOnSearch = name => {
    this.props.searchEngines({ name });
  }

  handleOnTabChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  }

  render() {
    console.log('list view', this.props.engines)
    return (
      <div className={styles.engineSelection}>
        <div className={styles.sideBar}>
          <Sidebar
            tabs={['Filters']}
            clearAllFilters={false}
            filtersSections={exampleSectionTree}
            formComponents={{
              'select-station-form': <div><LibCheckbox /> Test</div>
            }}
          />
        </div>
        <div className={styles.engineListContainer}>
          <Tabs
            className={styles.tabs}
            value={this.state.tabIndex}
            onChange={this.handleOnTabChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab classes={{ rootPrimarySelected: styles.tab }} label="Your Engines" />
            <Tab classes={{ rootPrimarySelected: styles.tab }} label="Explore All Engines" />
          </Tabs>
          <div className={styles.engineList}>
            <SelectBar onCheck={this.handleCheckAll} onSearch={this.handleOnSearch} />
            {this.state.tabIndex === 0 && this.props.selectedEngineIds.map(engineId =>
              <EngineSelectionRow
                engine={this.props.engines[engineId]}
                showDetailView={this.props.showDetailView}
              />
            )}
            {this.state.tabIndex === 1 && !isEmpty(this.props.engineSearchResults) && this.props.engineSearchResults.map(engineId =>
              <EngineSelectionRow
                engine={this.props.engines[engineId]}
                showDetailView={this.props.showDetailView}
              />
            )}
            {this.state.tabIndex === 1 && isEmpty(this.props.engineSearchResults) && Object.values(this.props.engines).map(engine =>
              <EngineSelectionRow
                engine={engine}
                showDetailView={this.props.showDetailView}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
