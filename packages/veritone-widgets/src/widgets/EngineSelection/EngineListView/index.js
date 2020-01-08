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
  any
} from 'prop-types';
import { isEmpty, debounce } from 'lodash';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles'
import { modules } from 'veritone-redux-common';
const { engine: engineModule } = modules;

import SelectBar from './SelectBar/';
import EnginesSideBar from './SideBar';
import SelectedActionBar from './SelectedActionBar/';
import EngineListContainer from './EngineListContainer';

import * as engineSelectionModule from '../../../redux/modules/engineSelection';

import styles from './styles';

@withStyles(styles)
@connect(
  (state, { id }) => ({
    currentResults: engineSelectionModule.getCurrentResults(state, id),
    allEnginesChecked: engineSelectionModule.allEnginesChecked(state, id),
    checkedEngineIds: engineSelectionModule.getCheckedEngineIds(state, id),
    isFetchingEngines: engineModule.isFetchingEngines(state, id),
    failedToFetchEngines: engineModule.failedToFetchEngines(state, id),
    searchQuery: engineSelectionModule.getSearchQuery(state, id),
    currentTab: engineSelectionModule.getCurrentTab(state, id),
    isSearchOpen: engineSelectionModule.isSearchOpen(state, id)
  }),
  {
    selectEngines: engineSelectionModule.selectEngines,
    deselectEngines: engineSelectionModule.deselectEngines,
    searchEngines: engineSelectionModule.searchEngines,
    checkAllEngines: engineSelectionModule.checkAllEngines,
    uncheckAllEngines: engineSelectionModule.uncheckAllEngines,
    clearSearch: engineSelectionModule.clearSearch,
    changeTab: engineSelectionModule.changeTab,
    toggleSearch: engineSelectionModule.toggleSearch
  }
)
export default class EngineListView extends React.Component {
  static propTypes = {
    id: string.isRequired,
    allEngines: objectOf(object),
    currentResults: arrayOf(string),
    allEnginesChecked: bool.isRequired,
    selectedEngineIds: arrayOf(string).isRequired,
    checkedEngineIds: arrayOf(string).isRequired,
    initialSelectedEngineIds: arrayOf(string),
    onViewDetail: func.isRequired,
    searchQuery: string,
    isFetchingEngines: bool.isRequired,
    failedToFetchEngines: bool.isRequired,
    currentTab: string.isRequired,
    isSearchOpen: bool.isRequired,
    selectEngines: func.isRequired,
    deselectEngines: func.isRequired,
    searchEngines: func.isRequired,
    checkAllEngines: func.isRequired,
    uncheckAllEngines: func.isRequired,
    clearSearch: func.isRequired,
    changeTab: func.isRequired,
    toggleSearch: func.isRequired,
    onSave: func.isRequired,
    onCancel: func.isRequired,
    actionMenuItems: arrayOf(
      shape({
        buttonText: string,
        iconClass: string,
        onClick: func.isRequired
      })
    ),
    hideActions: bool,
    classes: shape({ any }),
  };

  static defaultProps = {
    currentResults: []
  };

  state = {};

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      isEmpty(prevProps.allEngines) &&
      !isEmpty(this.props.allEngines) &&
      this.props.initialSelectedEngineIds
    ) {
      this.props.selectEngines(
        this.props.id,
        this.props.initialSelectedEngineIds
      );
    }
  }

  handleCheckAll = () => {
    const enginesToCheck =
      this.props.currentTab === 'explore'
        ? this.props.currentResults
        : this.props.selectedEngineIds;

    this.props.allEnginesChecked
      ? this.props.uncheckAllEngines(this.props.id)
      : this.props.checkAllEngines(this.props.id, enginesToCheck);
  };

  handleSearch = debounce(
    name => this.props.searchEngines(this.props.id, { name }),
    300
  );

  handleTabChange = (event, tab) => {
    this.props.changeTab(this.props.id, tab);
  };

  handleSave = () => {
    this.props.onSave();
  };

  handleOnBack = () => {
    this.props.uncheckAllEngines(this.props.id);
  };

  render() {
    const { checkedEngineIds, currentTab, classes } = this.props;

    return (
      <div className={classes.engineSelection}>
        <EnginesSideBar id={this.props.id} />
        <div className={classes.engineSelectionContent}>
          {!isEmpty(checkedEngineIds) && (
            <SelectedActionBar
              id={this.props.id}
              selectedEngines={checkedEngineIds}
              disabledSelectAllMessage={currentTab === 'own'}
              currentResultsCount={this.props.currentResults.length}
              onBack={this.handleOnBack}
              onAddSelected={this.props.selectEngines}
              onRemoveSelected={this.props.deselectEngines}
              onSelectAll={this.props.checkAllEngines}
              allEngines={Object.keys(this.props.allEngines)}
            />
          )}
          {isEmpty(checkedEngineIds) && (
            <Tabs
              className={classes.tabs}
              value={this.props.currentTab}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab
                classes={{ selected: classes.tab }}
                value="own"
                label={`Your Engines (${this.props.selectedEngineIds.length})`}
              />
              <Tab
                classes={{ selected: classes.tab }}
                value="explore"
                label="Explore All Engines"
              />
            </Tabs>
          )}
          <div className={classes.engineListContainer}>
            {!this.props.failedToFetchEngines && (
              <SelectBar
                id={this.props.id}
                onCheckAll={this.handleCheckAll}
                searchQuery={this.props.searchQuery}
                onSearch={this.handleSearch}
                onClearSearch={this.props.clearSearch}
                onToggleSearch={this.props.toggleSearch}
                isSearchOpen={this.props.isSearchOpen}
                isChecked={this.props.allEnginesChecked}
                actionMenuItems={this.props.actionMenuItems}
                currentTab={currentTab}
                count={
                  currentTab === 'explore'
                    ? this.props.currentResults.length
                    : this.props.selectedEngineIds.length
                }
              />
            )}
            <div className={classes.engineList}>
              <EngineListContainer
                id={this.props.id}
                currentTab={this.props.currentTab}
                engineIds={
                  currentTab === 'explore'
                    ? this.props.currentResults
                    : this.props.selectedEngineIds
                }
                onViewDetail={this.props.onViewDetail}
                isFetchingEngines={this.props.isFetchingEngines}
                failedToFetchEngines={this.props.failedToFetchEngines}
                onExploreAllEnginesClick={this.handleTabChange}
              />
            </div>
            {!this.props.hideActions && (
              <div className={classes.footer}>
                <Button
                  classes={{ label: classes.footerBtn }}
                  onClick={this.props.onCancel}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  classes={{ label: classes.footerBtn }}
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
