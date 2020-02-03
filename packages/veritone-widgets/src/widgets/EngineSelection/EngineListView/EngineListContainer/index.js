import React from 'react';
import { connect } from 'react-redux';
import { func, string, arrayOf, bool, shape, any } from 'prop-types';
import { isEmpty, noop } from 'lodash';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/styles'

import EngineList from './EngineList';
import FailureScreen from './FailureScreen/';

import styles from './styles';

import * as engineSelectionModule from '../../../../redux/modules/engineSelection';

@withStyles(styles)
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
    refetchEngines: func.isRequired,
    classes: shape({ any }),
  };

  handleExploreAllEnginesClick = e => {
    this.props.onExploreAllEnginesClick(e, 'explore');
  };

  handleRefetchEngines = () => {
    this.props.refetchEngines(this.props.id);
  };

  render() {
    const { classes } = this.props;
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
        <div className={classes.isFetching}>
          <CircularProgress size={50} />
        </div>
      );
    }

    if (this.props.currentTab === 'own' && this.props.noFilterResultsFound) {
      return (
        <div className={classes.noResults}>
          <i className="icon-engines" />
          <span className={classes.noResultsMessage}>
            You do not have any engines selected that match these filters.
          </span>
        </div>
      );
    }

    if (isEmpty(this.props.engineIds)) {
      if (this.props.currentTab === 'explore') {
        return (
          <div className={classes.noResults}>
            <i className="icon-engines" />
            <span className={classes.noResultsMessage}>
              Your search returned no results.
            </span>
          </div>
        );
      }

      return (
        <div className={classes.noEnabledEngines}>
          <div className={classes.noEnabledEnginesContainer}>
            <div className={classes.noEnabledEnginesIcon}>
              <i className="icon-engines" />
            </div>
            <div className={classes.noEnabledEnginesText}>
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
