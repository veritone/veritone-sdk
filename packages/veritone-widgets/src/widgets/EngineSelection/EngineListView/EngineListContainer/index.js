import React from 'react';
import { connect } from 'react-redux';
import { func, string, arrayOf, bool } from 'prop-types';
import { isEmpty, noop } from 'lodash';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import EngineList from './EngineList';
import FailureScreen from './FailureScreen/';

import styles from './styles.scss';

import * as engineSelectionModule from '../../../../redux/modules/engineSelection';

@connect(
  (state, ownProps) => ({
    noFilterResultsFound:
      isEmpty(ownProps.engineIds) &&
      engineSelectionModule.hasActiveFilters(state, ownProps.id)
  }),
  {
    refetchEngines: engineSelectionModule.refetchEngines
  }
)
export default class EngineListContainer extends React.Component {
  static propTypes = {
    id: string.isRequired,
    currentTab: string.isRequired,
    engineIds: arrayOf(string),
    onExploreAllEnginesClick: func,
    noFilterResultsFound: bool.isRequired,
    onViewDetail: func.isRequired,
    isFetchingEngines: bool.isRequired,
    failedToFetchEngines: bool.isRequired,
    refetchEngines: func.isRequired
  };

  handleExploreAllEnginesClick = e => {
    this.props.onExploreAllEnginesClick(e, 'explore');
  };

  handleRefetchEngines = () => {
    this.props.refetchEngines(this.props.id);
  };

  render() {
    if (this.props.failedToFetchEngines) {
      return (
        <FailureScreen
          message="Failed to fetch engines."
          onRetry={this.handleRefetchEngines}
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

    if (this.props.currentTab === 'own' && this.props.noFilterResultsFound) {
      return (
        <div className={styles.noResults}>
          <i className="icon-engines" />
          <span className={styles.noResultsMessage}>
            You do not have any engines selected that match these filters.
          </span>
        </div>
      );
    }

    if (isEmpty(this.props.engineIds)) {
      if (this.props.currentTab === 'explore') {
        return (
          <div className={styles.noResults}>
            <i className="icon-engines" />
            <span className={styles.noResultsMessage}>
              Your search returned no results.
            </span>
          </div>
        );
      }

      return (
        <div className={styles.noEnabledEngines}>
          <div className={styles.noEnabledEnginesContainer}>
            <div className={styles.noEnabledEnginesIcon}>
              <i className="icon-engines" />
            </div>
            <div className={styles.noEnabledEnginesText}>
              You have no enabled engines.
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleExploreAllEnginesClick}
            >
              Explore all engines
            </Button>
          </div>
        </div>
      );
    }

    return (
      <EngineList
        id={this.props.id}
        hasNextPage={false}
        isNextPageLoading={false}
        loadNextPage={noop}
        onViewDetail={this.props.onViewDetail}
        list={this.props.engineIds}
      />
    );
  }
}
