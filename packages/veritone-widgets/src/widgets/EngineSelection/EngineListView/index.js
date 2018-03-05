import React from 'react';
import { connect } from 'react-redux';
import { bool, func, objectOf, any } from 'prop-types';
import { isEmpty } from 'lodash';

import LibCheckbox from 'material-ui/Checkbox';
import Tabs, { Tab } from 'material-ui/Tabs';
import LibButton from 'material-ui/Button';

import { DiscoverySideBar as Sidebar } from 'veritone-react-common';

import { modules } from 'veritone-redux-common';
const { engine: engineModule } = modules;

import styles from './styles.scss';

import SelectBar from './SelectBar';
import EngineList from './EngineList';
import EngineSelectionRow from './EngineSelectionRow';

import * as engineSelectionModule from '../../../redux/modules/engineSelection';



const engineFilters = {
  children: [
    {
      label: 'Categories',
      children: [{ formComponentId: 'select-station-form' }]
    },
    {
      label: 'Price & Rating',
      children: [{ formComponentId: 'select-station-form' }]
    },
    {
      label: 'Deployment Model',
      children: [{ formComponentId: 'select-station-form' }]
    },
    {
      label: 'Attributes',
      children: [{ formComponentId: 'select-station-form' }]
    }
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
    selectedEngineIds: engineSelectionModule.getSelectedEngineIds(state),
    getEngineFilters: engineSelectionModule.getEngineFilters(state)
  }),
  {
    searchEngines: engineSelectionModule.searchEngines,
    checkAllEngines: engineSelectionModule.checkAllEngines,
    uncheckAllEngines: engineSelectionModule.uncheckAllEngines,
    clearSearch: engineSelectionModule.clearSearch,
    addEngineFilter: engineSelectionModule.addEngineFilter,
    removeEngineFilter: engineSelectionModule.removeEngineFilter
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

  handleOnClearSearch = () => {
    this.props.clearSearch();
  }

  handleOnTabChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  }

  handleOnFilterClick = ({ type, value }) => {
    (!!this.props.getEngineFilters[type]) ?
      this.props.removeEngineFilter({ type, value }) :
      this.props.addEngineFilter({ type, value })
  }

  _renderEngineList = () => (
    <EngineList
      hasNextPage={false}
      isNextPageLoading={false}
      loadNextPage={() => {}}
      // loadNextPage={this.props.fetchEngines}
      showDetailView={this.props.showDetailView}
      engines={this.props.engines}
      list={this.props.currentResults}
    />
  )

  _renderNoEnabledEngines = () => (
    <div className={styles.noEnabledEngines}>
      <div className={styles.noEnabledEnginesContainer}>
        <div className={styles.noEnabledEnginesIcon}>
          <i className="icon-engines" />
        </div>
        <div className={styles.noEnabledEnginesText}>You have no enabled engines.</div>
        <LibButton raised color="primary" onClick={e => this.handleOnTabChange(e, 1)}>
          Explore all engines
        </LibButton>
      </div>
    </div>
  )

  render() {
    const { tabIndex } = this.state;
    const tabs = {
      0: !isEmpty(this.props.engines) ? this._renderNoEnabledEngines() : <div>test</div>,
      1: !isEmpty(this.props.engines) ? this._renderEngineList() : <div>No Engines Found</div> 
    };

    return (
      <div className={styles.engineSelection}>
        <div className={styles.sideBar}>
          <Sidebar
            tabs={['Filters']}
            clearAllFilters={false}
            filtersSections={engineFilters}
            formComponents={{
              'select-station-form': (
                <div>
                  <div>
                    <LibCheckbox onClick={() => this.handleOnFilterClick({type: 'category', value: 'transcription'})} /> Transcription
                  </div>
                  <div>
                    <LibCheckbox onClick={() => this.handleOnFilterClick({type: 'category', value: 'translate'})} /> Translate
                  </div>
                </div>
              )
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
            <SelectBar
              onCheck={this.handleCheckAll}
              onSearch={this.handleOnSearch}
              onClearSearch={this.handleOnClearSearch}
            />
            {tabs[tabIndex]}
            <div className={styles.footer}>
              <LibButton onClick={() => console.log('cancel')}>
                Cancel
              </LibButton>
              <LibButton color="primary" onClick={() => console.log('save')}>
                Save
              </LibButton>
              {/* FOOTER HERE */}
            </div>
            {/* {this._renderNoEnabledEngines()} */}
            {/* {this._renderEngineList()} */}
            {/* {this.state.tabIndex === 0 && this.props.selectedEngineIds.map(engineId =>
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
            )} */}
          </div>
        </div>
      </div>
    );
  }
}
