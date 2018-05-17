import React from 'react';
import { func, string, arrayOf } from 'prop-types';
import { isEmpty, noop } from 'lodash';

import Button from 'material-ui/Button';

import EngineList from './EngineList';

import styles from './styles.scss';

export default class YourEnginesView extends React.Component {
  static propTypes = {
    selectedEngineIds: arrayOf(string),
    onExploreAllEnginesClick: func.isRequired,
    onViewDetail: func.isRequired
  };

  handleExploreAllEnginesClick = e => {
    this.props.onExploreAllEnginesClick(e, 1);
  };

  render() {
    if (isEmpty(this.props.selectedEngineIds)) {
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
    }

    return (
      <EngineList
        hasNextPage={false}
        isNextPageLoading={false}
        loadNextPage={noop}
        onViewDetail={this.props.onViewDetail}
        list={this.props.selectedEngineIds}
      />
    );
  }
}
