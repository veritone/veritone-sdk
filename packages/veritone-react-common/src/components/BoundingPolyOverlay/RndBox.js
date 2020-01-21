import React from 'react';
import cx from 'classnames';
import { Rnd } from 'react-rnd';

import styles from './overlay.styles.scss';

export default class RndBox extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  render() {
    const resizeHandleSize = 6;
    const handleShift = resizeHandleSize / 2;

    return (
      <Rnd
        resizeHandleStyles={{
          topLeft: { left: -handleShift, top: -handleShift },
          topRight: { right: -handleShift, top: -handleShift },
          bottomLeft: { left: -handleShift, bottom: -handleShift },
          bottomRight: { right: -handleShift, bottom: -handleShift },
          right: { right: -handleShift },
          left: { left: -handleShift },
          top: { top: -handleShift },
          bottom: { bottom: -handleShift }
        }}
        resizeHandleClasses={{
          topLeft: styles.resizeHandle,
          topRight: styles.resizeHandle,
          bottomLeft: styles.resizeHandle,
          bottomRight: styles.resizeHandle,
          right: cx(styles.resizeHandle, styles.resizeHandleHorizontal),
          left: cx(styles.resizeHandle, styles.resizeHandleHorizontal),
          top: cx(styles.resizeHandle, styles.resizeHandleVertical),
          bottom: cx(styles.resizeHandle, styles.resizeHandleVertical)
        }}
        bounds="parent"
        {...this.props}
      />
    );
  }
}
