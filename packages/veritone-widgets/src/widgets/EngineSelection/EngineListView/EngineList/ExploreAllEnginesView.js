import React from 'react';
import { connect } from 'react-redux';
import { func, bool, string, arrayOf } from 'prop-types';
import { isEmpty, noop } from 'lodash';

import { modules } from 'veritone-redux-common';
const { engine: engineModule } = modules;

import { CircularProgress } from 'material-ui/Progress';

import EngineList from './EngineList';
import FailureScreen from './FailureScreen/';

import styles from './styles.scss';

import * as engineSelectionModule from '../../../../redux/modules/engineSelection';

@connect(
  (state, ownProps) => ({
    isFetchingEngines: engineModule.isFetchingEngines(state)
  }),
  {
    refetchEngines: engineSelectionModule.refetchEngines
  }
)
export default class ExploreAllEnginesView extends React.Component {
  static propTypes = {
    currentResults: arrayOf(string),
    failedToFetchEngines: bool.isRequired,
    isFetchingEngines: bool.isRequired,
    refetchEngines: func.isRequired,
    onViewDetail: func.isRequired
  };

  render() {
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
      <EngineList
        hasNextPage={false}
        isNextPageLoading={false}
        loadNextPage={noop}
        onViewDetail={this.props.onViewDetail}
        list={this.props.currentResults}
      />
    );
  }
}
