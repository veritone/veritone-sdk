import React from 'react';
import { connect } from 'react-redux';
import { bool, func, objectOf, any, arrayOf, string } from 'prop-types';
import { isEmpty, isArray, isString, noop, without } from 'lodash';

import LibCheckbox from 'material-ui/Checkbox';
import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';

import { modules } from 'veritone-redux-common';
const { engine: engineModule } = modules;

import styles from './styles.scss';

import SelectBar from './SelectBar/';
import EnginesSideBar from './SideBar';
import EngineList from './EngineList';
import SelectedActionBar from './SelectedActionBar/';
import FailureScreen from './FailureScreen/';

import * as engineSelectionModule from '../../../redux/modules/engineSelection';

@connect(
  (state, ownProps) => ({
    engines: engineModule.getEngines(state),
    currentResults: engineSelectionModule.getCurrentResults(state),
    allEnginesChecked: engineSelectionModule.allEnginesChecked(state),
    selectedEngineIds: engineSelectionModule.getSelectedEngineIds(state),
    checkedEngineIds: engineSelectionModule.getCheckedEngineIds(state),
    filters: engineSelectionModule.getEngineFilters(state),
    isFetchingEngines: engineModule.isFetchingEngines(state),
    failedToFetchEngines: engineModule.failedToFetchEngines(state),
    searchQuery: engineSelectionModule.getSearchQuery(state)
  }),
  {
    addEngines: engineSelectionModule.addEngines,
    removeEngines: engineSelectionModule.removeEngines,
    refetchEngines: engineSelectionModule.refetchEngines,
    searchEngines: engineSelectionModule.searchEngines,
    checkAllEngines: engineSelectionModule.checkAllEngines,
    uncheckAllEngines: engineSelectionModule.uncheckAllEngines,
    clearSearch: engineSelectionModule.clearSearch,
    addEngineFilter: engineSelectionModule.addEngineFilter,
    removeEngineFilter: engineSelectionModule.removeEngineFilter,
    clearAllFilters: engineSelectionModule.clearAllFilters
  },
  null,
  { withRef: true }
)
export default class EngineListView extends React.Component {
  static propTypes = {
    engines: objectOf(any),
    showDetailView: func.isRequired,
    currentResults: arrayOf(string),
    onSave: func.isRequired,
    onCancel: func.isRequired
  };

  static defaultProps = {
    engines: {},
    currentResults: []
  };

  state = {
    tabIndex: 0
  };

  handleCheckAll = () => {
    this.props.allEnginesChecked
      ? this.props.uncheckAllEngines()
      : this.props.checkAllEngines(
          this.state.tabIndex
            ? this.props.currentResults
            : this.props.selectedEngineIds
        );
  };

  handleSearch = name => {
    this.props.searchEngines({ name });
  };

  handleTabChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  };

  // handleOnFilterChange = ({ type, value }) => {
  //   // console.log('handleOnFilterChange()', type, value)
  //   // (!!this.props.filters[type]) ?
  //   //   this.props.removeEngineFilter({ type, value }) :
  //   this.props.addEngineFilter({ type, value })
  // }

  renderEngineList = selectedEngines => (
    <EngineList
      hasNextPage={false}
      isNextPageLoading={false}
      loadNextPage={() => {}}
      // loadNextPage={this.props.fetchEngines}
      showDetailView={this.props.showDetailView}
      engines={this.props.engines}
      list={selectedEngines || this.props.currentResults}
    />
  );

  renderNoEnabledEngines = () => (
    <div className={styles.noEnabledEngines}>
      <div className={styles.noEnabledEnginesContainer}>
        <div className={styles.noEnabledEnginesIcon}>
          <i className="icon-engines" />
        </div>
        <div className={styles.noEnabledEnginesText}>
          You have no enabled engines.
        </div>
        <Button
          raised
          color="primary"
          onClick={e => this.handleTabChange(e, 1)}
        >
          Explore all engines
        </Button>
      </div>
    </div>
  );

  renderNoResults = () => (
    <div className={styles.noResults}>
      <i className="icon-engines" />
      <span className={styles.noResultsMessage}>
        Your search returned no results.
      </span>
    </div>
  );

  handleOnClearFilter = id => {
    const { filter, value } = JSON.parse(id);
    const { filters } = this.props;

    if (!filters[filter].length) {
      return;
    }

    if (isArray(filters[filter])) {
      this.props.addEngineFilter({
        type: filter,
        value: without(filters[filter], value)
      });
    }

    if (isString(filters[filter])) {
      this.props.removeEngineFilter({
        type: filter,
        value
      });
    }
  };

  renderTabs = () => (
    <Tabs
      className={styles.tabs}
      value={this.state.tabIndex}
      onChange={this.handleTabChange}
      indicatorColor="primary"
      textColor="primary"
      fullWidth
    >
      <Tab classes={{ rootPrimarySelected: styles.tab }} label="Your Engines" />
      <Tab
        classes={{ rootPrimarySelected: styles.tab }}
        label="Explore All Engines"
      />
    </Tabs>
  );

  renderYourEnginesTab = () => {
    if (isEmpty(this.props.selectedEngineIds)) {
      return this.renderNoEnabledEngines();
    }

    return this.renderEngineList(this.props.selectedEngineIds);
  };

  renderExploreAllEnginesTab = () => {
    if (this.props.failedToFetchEngines) {
      return (
        <FailureScreen
          message="Failed to fetch engines."
          onRetry={this.props.refetchEngines}
        />
      );
    }

    if (this.props.isFetchingEngines) {
      return (
        <div className={styles.isFetching}>
          <CircularProgress size={50} />
        </div>
      );
    }

    if (isEmpty(this.props.currentResults)) {
      return this.renderNoResults();
    }

    return this.renderEngineList();
  };

  render() {
    const { checkedEngineIds } = this.props;
    const { tabIndex } = this.state;
    const tabs = {
      0: this.renderYourEnginesTab(),
      1: this.renderExploreAllEnginesTab()
    };

    return (
      <div className={styles.engineSelection}>
        <EnginesSideBar
          filters={this.props.filters}
          filterBy={this.props.addEngineFilter}
          onClearAllFilters={this.props.clearAllFilters}
          onClearFilter={this.handleOnClearFilter}
        />
        <div className={styles.engineSelectionContent}>
          {!isEmpty(checkedEngineIds) && (
            <SelectedActionBar
              selectedEngines={checkedEngineIds}
              disabledSelectAllMessage={!tabIndex}
              currentResultsCount={this.props.currentResults.length}
              onBack={this.props.uncheckAllEngines}
              onAddSelected={this.props.addEngines}
              onRemoveSelected={this.props.removeEngines}
              onSelectAll={this.props.checkAllEngines}
              allEngines={Object.keys(this.props.engines)}
            />
          )}
          {isEmpty(checkedEngineIds) && this.renderTabs()}
          <div className={styles.engineListContainer}>
            <SelectBar
              onCheckAll={this.handleCheckAll}
              searchQuery={this.props.searchQuery}
              onSearch={this.handleSearch}
              onClearSearch={this.props.clearSearch}
              isChecked={this.props.allEnginesChecked}
              isDisabled={!tabIndex}
              count={
                tabIndex
                  ? this.props.currentResults.length
                  : this.props.selectedEngineIds.length
              }
            />
            <div className={styles.engineList}>{tabs[tabIndex]}</div>
            <div className={styles.footer}>
              <Button onClick={this.props.onCancel}>Cancel</Button>
              <Button color="primary" onClick={this.props.onSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
