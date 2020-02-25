import React from 'react';
import cx from 'classnames';
import Rnd from 'react-rnd';
import { withStyles } from 'helpers/withStyles';

const classes = withStyles(styles);
import styles from './styles';

class RndBox extends React.Component {
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
          topLeft: classes.resizeHandle,
          topRight: classes.resizeHandle,
          bottomLeft: classes.resizeHandle,
          bottomRight: classes.resizeHandle,
          right: cx(classes.resizeHandle, classes.resizeHandleHorizontal),
          left: cx(classes.resizeHandle, classes.resizeHandleHorizontal),
          top: cx(classes.resizeHandle, classes.resizeHandleVertical),
          bottom: cx(classes.resizeHandle, classes.resizeHandleVertical)
        }}
        bounds="parent"
        {...this.props}
      />
    );
  }
}

export default RndBox;
