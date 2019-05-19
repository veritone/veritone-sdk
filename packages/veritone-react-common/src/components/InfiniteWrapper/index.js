import React from 'react';
import { debounce } from 'lodash';
import cx from 'classnames';

import styles from './styles.scss';

import infiniteWrapperShape from './infiniteWrapperShape';

export default class InfiniteLoaderWrapper extends React.Component {
  static propTypes = infiniteWrapperShape;

  static defaultProps = {
    threshold: 80,
    classes: {}
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
