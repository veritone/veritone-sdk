import React from 'react';
import classNames from 'classnames';

import styles from './styles.scss';

import infiniteWrapperShape from './infiniteWrapperShape';

export default class InfiniteLoaderWrapper extends React.Component {
  static propTypes = infiniteWrapperShape;

  static defaultProps = {
    threshold: 50,
    classes: {}
  }

  componentDidMount() {
    this.props.onMount();
  }

  getSnapshotBeforeUpdate() {
    return this.containerRef.current.scrollHeight;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot < this.containerRef.current.scrollHeight) {
      this.loading = false;
    }
  }

  onScroll = () => {
    const container = this.containerRef.current;
    if (!this.loading && !this.props.finishedLoading && (
      container.scrollTop +
      container.clientHeight >
      container.scrollHeight -
      this.props.threshold
    )) {
      this.loading = true;
      container.scrollTop = container.scrollTop + this.props.threshold
      this.props.loadMore();
    }
  }

  loading = false;

  containerRef = React.createRef(null);

  render() {
    const { children, loadingComponent, classes, finishedLoading } = this.props;

    return (
      <div className={classNames(styles['infinte-wrapper'], classes.container)} ref={this.containerRef} onScroll={this.onScroll}>
        {children}
        {
          !finishedLoading && loadingComponent
        }
      </div>
    )
  }
}
