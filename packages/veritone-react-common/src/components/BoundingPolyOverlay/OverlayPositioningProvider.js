import React from 'react';
import { node, number, bool, string, shape, any } from 'prop-types';
import { isEqual } from 'lodash';
import cx from 'classnames';
import { withStyles } from '@material-ui/styles';
import styles from './styles';

export const OverlayPositioningContext = React.createContext({
  top: 0,
  left: 0,
  height: 0,
  width: 0
});
class OverlayPositioningProvider extends React.Component {
  static propTypes = {
    contentHeight: number,
    contentWidth: number,
    fixedWidth: bool,
    children: node,
    contentClassName: string,
    classes: shape({any})
  };
  static defaultProps = {};

  state = {
    overlayPosition: { top: 0, left: 0, height: 0, width: 0 }
  };

  measuredChildRef = null; // eslint-disable-line
  resizeObserver = null; // eslint-disable-line
  pollingInterval = null;

  componentWillUnmount() {
    clearInterval(this.pollingInterval);
    this.resizeObserver && this.resizeObserver.disconnect();
  }

  componentDidUpdate() {
    this.measureChild();
  }

  measureChild = (element = this.measuredChildRef) => {
    // calculate the actual size of the element we're going to lay on top of
    const {
      height: screenHeight,
      width: screenWidth
    } = element.getBoundingClientRect();
    const { contentWidth, contentHeight } = this.props;

    const ratioScreen = screenWidth / screenHeight;
    const ratioContent = contentWidth / contentHeight;

    const [width, height] =
      ratioScreen > ratioContent
        ? [contentWidth * screenHeight / contentHeight, screenHeight]
        : [screenWidth, contentHeight * screenWidth / contentWidth];

    // figure out what styles need to be applied to the overlay component so that
    // it aligns with the content (considering letter/pillarboxing)
    const measuredOverlayPosition = {
      top: (screenHeight - height) / 2,
      left: (screenWidth - width) / 2,
      height,
      width
    };

    if (!isEqual(this.state.overlayPosition, measuredOverlayPosition)) {
      this.setState({
        overlayPosition: measuredOverlayPosition
      });
    }
  };

  setMeasuredChildRef = r => {
    if (!r) {
      return;
    }

    this.measuredChildRef = r;

    if (!window.ResizeObserver) {
      clearInterval(this.pollingInterval);
      // poll for changes in the measured element's size
      this.pollingInterval = setInterval(this.measureChild, 250);
      return;
    }

    // use ResizeObserver if available (Chrome only), to avoid polling
    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.measureChild(entry.target);
    });

    this.resizeObserver.observe(r);
  };

  render() {
    // clearfix and float are to make sure the "measured child" div sizes
    // exactly to the size of its child content in fixed/fluid width scenarios
    const { classes } = this.props;
    return (
      <OverlayPositioningContext.Provider value={this.state.overlayPosition}>
        <div className={cx({ [classes.clearfix]: this.props.fixedWidth })}>
          <div
            className={cx(this.props.contentClassName)}
            style={{
              float: this.props.fixedWidth ? 'left' : 'none',
              position: 'relative',
              verticalAlign: 'bottom'
            }}
            ref={this.setMeasuredChildRef}
          >
            {this.props.children}
          </div>
        </div>
      </OverlayPositioningContext.Provider>
    );
  }
}

export default withStyles(styles)(OverlayPositioningProvider);
