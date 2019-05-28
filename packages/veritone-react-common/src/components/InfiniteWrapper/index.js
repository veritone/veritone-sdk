import React from 'react';
import {
  bool,
  number,
  objectOf,
  string,
  node,
  func,
  arrayOf,
  oneOfType
} from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import { debounce } from 'lodash';
import cx from 'classnames';

import styles from './styles.scss';

export default class InfiniteLoaderWrapper extends React.Component {
  static propTypes = {
    isLoading: bool,
    threshold: number,
    classes: objectOf(string),
    loadingComponent: node,
    triggerPagination: func,
    children: oneOfType([
      arrayOf(node),
      node
    ])
  };

  static defaultProps = {
    threshold: 80,
    classes: {},
    loadingComponent:
      <div className={styles['loading-container']}>
        <CircularProgress size={50} />
      </div>
  }

  getViewWindow = () => {
    const boundingClient = this.containerRef.current.getBoundingClientRect();
    return {
      top: boundingClient.top,
      bottom: boundingClient.bottom
    }
  }

  debouncedTriggerPagination = debounce(this.props.triggerPagination, 1000);

  onScroll = () => {
    const container = this.containerRef.current;
    const { isLoading, threshold } = this.props;
    if (!isLoading && (
      container.scrollTop +
      container.clientHeight >
      container.scrollHeight -
      threshold
    )) {
      // UX improvement: Go to end of container
      container.scrollTop = container.scrollTop + threshold;
      this.debouncedTriggerPagination();
    }
  }

  containerRef = React.createRef(null);

  render() {
    const { children, loadingComponent, classes, isLoading } = this.props;

    return (
      <div className={
        cx(styles['infinte-wrapper'],
          classes.container
        )} ref={this.containerRef} onScroll={this.onScroll}>
        {children}
        <div className={styles['loading-container']}>
          {
            isLoading && loadingComponent
          }
        </div>
      </div>
    )
  }
}
