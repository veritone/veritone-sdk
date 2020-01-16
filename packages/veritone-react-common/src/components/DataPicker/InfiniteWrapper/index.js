import React, { useRef, useEffect } from 'react';
import {
  bool,
  number,
  objectOf,
  string,
  node,
  func,
  arrayOf,
  oneOfType,
} from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';
import { debounce } from 'lodash';
import cx from 'classnames';

const styles = {
  infinteWrapper: {
    height: '100%',
    overflowY: 'auto',
  },
  loadingHidden: {
    opacity: 0,
  },
  loadingContainer: {
    minHeight: 80,
    display: 'flex',
    justifyContent: 'center',
  }
}

const useStyles = makeStyles(styles);

export default function InfiniteLoaderWrapper({
  isLoading,
  threshold,
  triggerPagination,
  classes,
  children,
  loadingComponent
}) {
  const muiClasses = useStyles();
  const containerRef = useRef(null);
  // const getViewWindow = () => {
  //   const boundingClient = containerRef.current.getBoundingClientRect();
  //   return {
  //     top: boundingClient.top,
  //     bottom: boundingClient.bottom
  //   }
  // }
  const debouncedTriggerPagination = debounce(triggerPagination, 1000);
  const onScroll = () => {
    const container = containerRef.current;
    if (!isLoading && container) {
      if ((container.scrollTop + container.clientHeight) > (container.scrollHeight - threshold)) {
        // UX improvement: Go to end of container
        container.scrollTop = container.scrollTop + threshold;
        debouncedTriggerPagination();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll, true);

    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, []);

  return (
    <div className={cx(muiClasses['infinteWrapper'], classes.container)} ref={containerRef}>
      {children}
      <div className={muiClasses['loadingContainer']}>
        {
          isLoading && loadingComponent
        }
      </div>
    </div>
  )
}

InfiniteLoaderWrapper.propTypes = {
  isLoading: bool,
  threshold: number,
  classes: objectOf(string),
  loadingComponent: node,
  triggerPagination: func,
  children: oneOfType([
    arrayOf(node),
    node
  ])
}

InfiniteLoaderWrapper.defaultProps = {
  threshold: 80,
  classes: {},
  loadingComponent:
    <div style={{
      minHeight: 80,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <CircularProgress size={50} />
    </div>
}
