import React from 'react';
import { isNumber } from 'lodash';
import { arrayOf, oneOf, string, number, shape, func } from 'prop-types';
import Rnd from 'react-rnd';
import cx from 'classnames';

import { getMousePosition } from 'helpers/dom';
import withContextProps from 'helpers/withContextProps';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import { OverlayPositioningContext } from './OverlayPositioningProvider';
import OverlayConfirmMenu from './OverlayConfirmMenu';
import styles from './overlay.styles.scss';

@withContextProps(OverlayPositioningContext.Consumer, context => ({
  overlayPositioningContext: context
}))
@withMuiThemeProvider
export default class Overlay extends React.Component {
  static propTypes = {
    acceptMode: oneOf(['auto', 'confirm']),
    confirmLabel: string,
    // readOnly: bool,
    overlayPositioningContext: shape({
      top: number.isRequired,
      left: number.isRequired,
      width: number.isRequired,
      height: number.isRequired
    }).isRequired,
    overlayBackgroundColor: string,
    overlayBorderStyle: string,
    overlayBackgroundBlendMode: string,
    onBoundingBoxChange: func.isRequired,
    initialBoundingBoxPositions: arrayOf(
      shape({
        // fixme -- this should take percentage-corners, translated via getDerivedStateFromProps
        x: number.isRequired,
        y: number.isRequired,
        width: number.isRequired,
        height: number.isRequired
      })
    )
  };

  static defaultProps = {
    acceptMode: 'confirm',
    confirmLabel: 'Add',
    // readOnly: false,
    initialBoundingBoxPositions: [],
    overlayBackgroundColor: '#FF6464',
    overlayBackgroundBlendMode: 'hard-light',
    overlayBorderStyle: '1px solid #fff'
  };

  state = {
    boundingBoxPositions: this.props.initialBoundingBoxPositions,
    focusedBoundingBoxIndex: null,
    stagedBoundingBoxPosition: {},
    userMinimizedConfirmMenu: false,
    userActingOnBoundingBox: false,
    drawingInitialBoundingBox: false
  };

  handleResize = (e, direction, ref, delta, position) => {
    this.setState(state => {
      const focusedIndex = ref.getAttribute('data-boxindex');
      state.boundingBoxPositions[focusedIndex] = {
        width: ref.offsetWidth,
        height: ref.offsetHeight,
        ...position
      };

      return {
        ...state,
        userActingOnBoundingBox: true
      };
    });
  };

  handleResizeStagedBox = (e, direction, ref, delta, position) => {
    this.setState(state => ({
      userActingOnBoundingBox: true,
      stagedBoundingBoxPosition: {
        ...state.stagedBoundingBoxPosition,
        width: ref.offsetWidth,
        height: ref.offsetHeight,
        ...position
      }
    }));
  };

  handleResizeStop = () => {
    this.setState({
      userActingOnBoundingBox: false,
      userMinimizedConfirmMenu: false
    });
  };

  handleDrag = (e, d) => {
    this.setState({ userActingOnBoundingBox: true });
  };

  handleDragExistingBoxStop = (e, { node, x, y }) => {
    this.setState(state => {
      const focusedIndex = Number(node.getAttribute('data-boxindex'));
      state.boundingBoxPositions[focusedIndex].x = x;
      state.boundingBoxPositions[focusedIndex].y = y;

      return {
        boundingBoxPositions: state.boundingBoxPositions,
        userActingOnBoundingBox: false,
        userMinimizedConfirmMenu: false
      };
    });
  };

  handleDragStagedBoxStop = (e, d) => {
    this.setState(state => ({
      stagedBoundingBoxPosition: {
        ...state.stagedBoundingBoxPosition,
        x: d.x,
        y: d.y
      },
      userActingOnBoundingBox: false,
      userMinimizedConfirmMenu: false
    }));
  };

  handleClickBox = e => {
    e.stopPropagation();

    // fixme: try to ignore clicks that are the result of mouseup after resize/drag

    // cancel any unconfirmed
    this.removeUnconfirmedBoundingBoxes();

    const focusedIndex = e.target.getAttribute('data-boxindex');

    this.setState({
      focusedBoundingBoxIndex: focusedIndex ? Number(focusedIndex) : null
    });
  };

  confirmStagedBoundingBox = () => {
    // todo
    // this.props.onBoundingBoxChange(this.toPercentageBasedPoly());
    this.props.onBoundingBoxChange([
      ...this.state.boundingBoxPositions,
      this.state.stagedBoundingBoxPosition
    ]);

    // todo: clear stage when new initial set is received
  };

  removeUnconfirmedBoundingBoxes = () => {
    // delete staged box
    this.setState({
      stagedBoundingBoxPosition: {}
    });
  };

  minimizeConfirmMenu = () => {
    this.setState({ userMinimizedConfirmMenu: true });
  };

  handleBackgroundMouseDown = e => {
    if (this.state.drawingInitialBoundingBox) {
      // click while drawing; finish drawing
      // fixme -- separate logic
      this.handleBackgroundMouseUp();
      return;
    }

    // deal with dragging out an initial box on a blank canvas
    const { x: mouseX, y: mouseY } = getMousePosition(e);

    const largerContextDimension = Math.max(
      this.props.overlayPositioningContext.width,
      this.props.overlayPositioningContext.height
    );

    this.setState({
      focusedBoundingBoxIndex: null,
      drawingInitialBoundingBox: true,
      userActingOnBoundingBox: true,
      stagedBoundingBoxPosition: {
        x: mouseX,
        y: mouseY,
        // "one-click" box size. 10% of the larger of content width/height.
        width: largerContextDimension * 0.1,
        height: largerContextDimension * 0.1
      }
    });
  };

  handleBackgroundMouseMove = e => {
    if (this.state.drawingInitialBoundingBox) {
      const { x: mouseX, y: mouseY } = getMousePosition(e);

      this.setState(state => {
        const width = mouseX - state.stagedBoundingBoxPosition.x;
        const height = mouseY - state.stagedBoundingBoxPosition.y;

        return {
          stagedBoundingBoxPosition: {
            // prevent weird behavior when box width is set to a negative value
            width: width < 0 ? 0 : width,
            height: height < 0 ? 0 : height,
            x: state.stagedBoundingBoxPosition.x,
            y: state.stagedBoundingBoxPosition.y
          }
        };
      });
    }
  };

  handleBackgroundMouseUp = e => {
    if (this.state.drawingInitialBoundingBox) {
      this.setState({
        drawingInitialBoundingBox: false,
        userActingOnBoundingBox: false
      });
    }
  };

  toPercentageBasedPoly = () => {
    // fixme for multiple
    const {
      width: containerWidth,
      height: containerHeight
    } = this.props.overlayPositioningContext;

    const { x, y, width, height } = this.state;

    return [
      // top-left
      {
        x: x / containerWidth,
        y: y / containerHeight
      },
      // top-right
      {
        x: (x + width) / containerWidth,
        y: y / containerHeight
      },
      // bottom-right
      {
        x: (x + width) / containerWidth,
        y: (y + height) / containerHeight
      },
      // bottom-left
      {
        x: x / containerWidth,
        y: (y + height) / containerHeight
      }
    ];
  };

  fromPercentageBasedPoly = ([topLeft, topRight, bottomRight, bottomLeft]) => {
    // todo
    return {
      width: 0,
      height: 0,
      x: 0,
      y: 0
    };
  };

  hasStagedBoundingBox = () => {
    return (
      isNumber(this.state.stagedBoundingBoxPosition.x) &&
      isNumber(this.state.stagedBoundingBoxPosition.y) &&
      isNumber(this.state.stagedBoundingBoxPosition.width) &&
      isNumber(this.state.stagedBoundingBoxPosition.height)
    );
  };

  render() {
    const { top, left, height, width } = this.props.overlayPositioningContext;
    const resizeHandleSize = 6;
    const handleShift = resizeHandleSize / 2;

    // todo -- wrap RND component with common styles
    return (
      <div
        style={{
          position: 'absolute',
          overflow: 'hidden',
          top,
          left,
          height,
          width
        }}
      >
        {this.state.boundingBoxPositions.map(({ x, y, width, height }, i) => (
          <Rnd
            // index is significant since boxes don't have IDs
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            extendsProps={{
              'data-boxindex': i,
              onClick: this.handleClickBox
            }}
            style={{
              border: this.props.overlayBorderStyle,
              backgroundColor: this.props.overlayBackgroundColor,
              mixBlendMode: this.props.overlayBackgroundBlendMode
            }}
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
            size={{ width, height }}
            position={{ x, y }}
            bounds="parent"
            onDragStart={this.handleDragStart}
            onDragStop={this.handleDragExistingBoxStop}
            onDrag={this.handleDrag}
            onResize={this.handleResize}
            onResizeStop={this.handleResizeStop}
            enableResizing={
              this.state.focusedBoundingBoxIndex === i ? undefined : false
            }
            // disableDragging={this.state.focusedBoundingBoxIndex !== i}
          />
        ))}

        {this.hasStagedBoundingBox() && (
          <Rnd
            style={{
              border: this.props.overlayBorderStyle,
              backgroundColor: this.props.overlayBackgroundColor,
              mixBlendMode: this.props.overlayBackgroundBlendMode,
              // do not let this box interfere with mouse events as we draw it out
              pointerEvents: this.state.drawingInitialBoundingBox
                ? 'none'
                : 'auto'
            }}
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
            size={{
              width: this.state.stagedBoundingBoxPosition.width,
              height: this.state.stagedBoundingBoxPosition.height
            }}
            position={{
              x: this.state.stagedBoundingBoxPosition.x,
              y: this.state.stagedBoundingBoxPosition.y
            }}
            bounds="parent"
            onDragStop={this.handleDragStagedBoxStop}
            onDrag={this.handleDrag}
            onResize={this.handleResizeStagedBox}
            onResizeStop={this.handleResizeStop}
            enableResizing={
              // don't show handles during initial drag placement
              this.state.drawingInitialBoundingBox ? false : undefined
            }
          />
        )}

        {this.props.acceptMode === 'confirm' &&
          this.hasStagedBoundingBox() && (
            <OverlayConfirmMenu
              visible={
                !this.state.userActingOnBoundingBox &&
                !this.state.userMinimizedConfirmMenu
              }
              confirmLabel={this.props.confirmLabel}
              onConfirm={this.confirmStagedBoundingBox}
              onCancel={this.removeUnconfirmedBoundingBoxes}
              onMinimize={this.minimizeConfirmMenu}
            />
          )}

        <div
          style={{
            width: '100%',
            height: '100%',
            cursor: 'crosshair'
          }}
          onMouseDown={this.handleBackgroundMouseDown}
          onMouseUp={this.handleBackgroundMouseUp}
          onMouseMove={this.handleBackgroundMouseMove}
        />
      </div>
    );
  }
}
