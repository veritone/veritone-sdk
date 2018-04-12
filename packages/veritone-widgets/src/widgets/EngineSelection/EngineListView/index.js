import React from 'react';
import { connect } from 'react-redux';
import {
  bool,
  func,
  objectOf,
  object,
  arrayOf,
  string,
  shape,
  number
} from 'prop-types';
import { isEmpty, isArray, isString, without, noop } from 'lodash';

import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import { withMuiThemeProvider } from 'veritone-react-common';
import { modules } from 'veritone-redux-common';
const { engine: engineModule } = modules;

import SelectBar from './SelectBar/';
import EnginesSideBar from './SideBar';
import EngineList from './EngineList';
import SelectedActionBar from './SelectedActionBar/';
import FailureScreen from './FailureScreen/';

import * as engineSelectionModule from '../../../redux/modules/engineSelection';

import styles from './styles.scss';

@connect(
  (state, ownProps) => ({
    allEngines: engineModule.getEngines(state),
    currentResults: engineSelectionModule.getCurrentResults(state),
    allEnginesChecked: engineSelectionModule.allEnginesChecked(state),
    selectedEngineIds: engineSelectionModule.getSelectedEngineIds(state),
    checkedEngineIds: engineSelectionModule.getCheckedEngineIds(state),
    filters: engineSelectionModule.getEngineFilters(state),
    isFetchingEngines: engineModule.isFetchingEngines(state),
    failedToFetchEngines: engineModule.failedToFetchEngines(state),
    searchQuery: engineSelectionModule.getSearchQuery(state),
    currentTabIndex: engineSelectionModule.getCurrentTabIndex(state),
    isSearchOpen: engineSelectionModule.isSearchOpen(state)
  }),
  {
    selectEngines: engineSelectionModule.selectEngines,
    deselectEngines: engineSelectionModule.deselectEngines,
    refetchEngines: engineSelectionModule.refetchEngines,
    searchEngines: engineSelectionModule.searchEngines,
    checkAllEngines: engineSelectionModule.checkAllEngines,
    uncheckAllEngines: engineSelectionModule.uncheckAllEngines,
    clearSearch: engineSelectionModule.clearSearch,
    addEngineFilter: engineSelectionModule.addEngineFilter,
    removeEngineFilter: engineSelectionModule.removeEngineFilter,
    clearAllFilters: engineSelectionModule.clearAllFilters,
    changeTab: engineSelectionModule.changeTab,
    toggleSearch: engineSelectionModule.toggleSearch
  }
)
@withMuiThemeProvider
export default class EngineListView extends React.Component {
  static propTypes = {
    allEngines: objectOf(object).isRequired,
    onViewDetail: func.isRequired,
    currentResults: arrayOf(string).isRequired,
    allEnginesChecked: bool.isRequired,
    selectedEngineIds: arrayOf(string).isRequired,
    checkedEngineIds: arrayOf(string).isRequired,
    filters: shape({
      category: arrayOf(string)
    }).isRequired,
    isFetchingEngines: bool.isRequired,
    failedToFetchEngines: bool.isRequired,
    searchQuery: string,
    currentTabIndex: number.isRequired,
    isSearchOpen: bool.isRequired,
    selectEngines: func.isRequired,
    deselectEngines: func.isRequired,
    refetchEngines: func.isRequired,
    searchEngines: func.isRequired,
    checkAllEngines: func.isRequired,
    uncheckAllEngines: func.isRequired,
    clearSearch: func.isRequired,
    addEngineFilter: func.isRequired,
    removeEngineFilter: func.isRequired,
    clearAllFilters: func.isRequired,
    changeTab: func.isRequired,
    toggleSearch: func.isRequired,
    onSave: func.isRequired,
    onCancel: func.isRequired,
    hideActions: bool
  };

  static defaultProps = {
    allEngines: {},
    currentResults: []
  };

  handleCheckAll = () => {
    const enginesToCheck = this.props.currentTabIndex
      ? this.props.currentResults
      : this.props.selectedEngineIds;

    this.props.allEnginesChecked
      ? this.props.uncheckAllEngines()
      : this.props.checkAllEngines(enginesToCheck);
  };

  handleSearch = name => {
    this.props.searchEngines({ name });
  };

  handleTabChange = (event, tabIndex) => {
    this.props.changeTab(tabIndex);
  };

  renderEngineList = selectedEngines => (
    <EngineList
      hasNextPage={false}
      isNextPageLoading={false}
      loadNextPage={noop}
      onViewDetail={this.props.onViewDetail}
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
          variant="raised"
          color="primary"
          onClick={e => this.handleTabChange(e, 1)} // eslint-disable-line
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

  handleClearFilter = id => {
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
      value={this.props.currentTabIndex}
      onChange={this.handleTabChange}
      indicatorColor="primary"
      textColor="primary"
      fullWidth
    >
      <Tab
        classes={{ textColorPrimarySelected: styles.tab }}
        label="Your Engines"
      />
      <Tab
        classes={{ textColorPrimarySelected: styles.tab }}
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

  handleSave = () => {
    this.props.onSave();
  };

  render() {
    const { checkedEngineIds } = this.props;
    const { currentTabIndex } = this.props;
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
          onClearFilter={this.handleClearFilter}
        />
        <div className={styles.engineSelectionContent}>
          {!isEmpty(checkedEngineIds) && (
            <SelectedActionBar
              selectedEngines={checkedEngineIds}
              disabledSelectAllMessage={!currentTabIndex}
              currentResultsCount={this.props.currentResults.length}
              onBack={this.props.uncheckAllEngines}
              onAddSelected={this.props.selectEngines}
              onRemoveSelected={this.props.deselectEngines}
              onSelectAll={this.props.checkAllEngines}
              allEngines={Object.keys(this.props.allEngines)}
            />
          )}
          {isEmpty(checkedEngineIds) && this.renderTabs()}
          <div className={styles.engineListContainer}>
            <SelectBar
              onCheckAll={this.handleCheckAll}
              searchQuery={this.props.searchQuery}
              onSearch={this.handleSearch}
              onClearSearch={this.props.clearSearch}
              onToggleSearch={this.props.toggleSearch}
              isSearchOpen={this.props.isSearchOpen}
              isChecked={this.props.allEnginesChecked}
              hideActions={
                this.props.failedToFetchEngines ||
                this.props.isFetchingEngines ||
                !currentTabIndex
              }
              count={
                currentTabIndex
                  ? this.props.currentResults.length
                  : this.props.selectedEngineIds.length
              }
            />
            <div className={styles.engineList}>{tabs[currentTabIndex]}</div>
            {!this.props.hideActions && (
              <div className={styles.footer}>
                <Button
                  classes={{ label: styles.footerBtn }}
                  onClick={this.props.onCancel}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  classes={{ label: styles.footerBtn }}
                  onClick={this.handleSave}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
