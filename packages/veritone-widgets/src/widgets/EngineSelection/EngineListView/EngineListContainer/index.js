import React from 'react';
import { connect } from 'react-redux';
import { func, string, arrayOf, bool, number } from 'prop-types';
import { isEmpty, noop } from 'lodash';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import EngineList from './EngineList';
import FailureScreen from './FailureScreen/';

import styles from './styles.scss';

import * as engineSelectionModule from '../../../../redux/modules/engineSelection';

@connect((state, ownProps) => ({}), {
  refetchEngines: engineSelectionModule.refetchEngines
})
export default class EngineListContainer extends React.Component {
  static propTypes = {
    id: string.isRequired,
    currentTabIndex: number.isRequired,
    engineIds: arrayOf(string),
    onExploreAllEnginesClick: func,
    onViewDetail: func.isRequired,
    isFetchingEngines: bool.isRequired,
    failedToFetchEngines: bool.isRequired,
    refetchEngines: func.isRequired
  };

  handleExploreAllEnginesClick = e => {
    this.props.onExploreAllEnginesClick(e, 1);
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

    if (isEmpty(this.props.engineIds)) {
      if (!this.props.currentTabIndex) {
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
                variant="raised"
                color="primary"
                onClick={this.handleExploreAllEnginesClick}
              >
                Explore all engines
              </Button>
            </div>
          </div>
        );
      } else {
        return (
          <div className={styles.noResults}>
            <i className="icon-engines" />
            <span className={styles.noResultsMessage}>
              Your search returned no results.
            </span>
          </div>
        );
      }
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
