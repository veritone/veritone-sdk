import React from 'react';
import { get, isNumber } from 'lodash';
import { oneOf, string, number, shape, func } from 'prop-types';
import Rnd from 'react-rnd';
import cx from 'classnames';

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
    overlayPositioningContext: shape({
      top: number.isRequired,
      left: number.isRequired,
      width: number.isRequired,
      height: number.isRequired
    }).isRequired,
    overlayBackgroundColor: string,
    overlayBorderStyle: string,
    overlayBackgroundBlendMode: string,
    onAccept: func.isRequired,
    onCancel: func.isRequired,
    initialBoundingBoxPosition: shape({
      // fixme -- this should take percentage-corners
      x: number.isRequired,
      y: number.isRequired,
      width: number.isRequired,
      height: number.isRequired
    })
  };
  static defaultProps = {
    acceptMode: 'confirm',
    confirmLabel: 'Add',
    overlayBackgroundColor: '#FF6464',
    overlayBackgroundBlendMode: 'hard-light',
    overlayBorderStyle: '1px solid #fff'
  };

  state = {
    width: get(this.props.initialBoundingBoxPosition, 'width'),
    x: get(this.props.initialBoundingBoxPosition, 'x'),
    y: get(this.props.initialBoundingBoxPosition, 'y'),
    userMinimizedConfirmMenu: false,
    userActingOnBoundingBox: false,
    drawingInitialBoundingBox: false
  };

  handleResize = (e, direction, ref, delta, position) => {
    this.setState({
      userActingOnBoundingBox: true,
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      ...position
    });
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

  handleDragStop = (e, d) => {
    this.setState({
      x: d.x,
      y: d.y,
      userActingOnBoundingBox: false,
      userMinimizedConfirmMenu: false
    });
  };

  handleConfirm = () => {
    this.props.onAccept(this.toPercentageBasedPoly());
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  handleMinimizeConfirmMenu = () => {
    this.setState({ userMinimizedConfirmMenu: true });
  };

  getMousePosition(e) {
    // https://stackoverflow.com/questions/8389156
    let el = e.target,
      x = 0,
      y = 0;

    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }

    x = e.clientX - x;
    y = e.clientY - y;

    return { x: x, y: y };
  }

  handleBackgroundMouseDown = e => {
    // deal with dragging out an initial box on a blank canvas
    const boundingPolyAlreadyExists = this.canRenderBoundingPoly();

    if (!boundingPolyAlreadyExists) {
      const { x: mouseX, y: mouseY } = this.getMousePosition(e);

      const largerContextDimension = Math.max(
        this.props.overlayPositioningContext.width,
        this.props.overlayPositioningContext.height
      );

      this.setState({
        drawingInitialBoundingBox: true,
        userActingOnBoundingBox: true,
        x: mouseX,
        y: mouseY,
        // "one-click" box size. 10% of the larger of content width/height.
        width: largerContextDimension * 0.1,
        height: largerContextDimension * 0.1
      });
    }
  };

  handleBackgroundMouseMove = e => {
    if (this.state.drawingInitialBoundingBox) {
      const { x: mouseX, y: mouseY } = this.getMousePosition(e);

      this.setState(state => {
        const width = mouseX - state.x;
        const height = mouseY - state.y;

        return {
          // prevent weird behavior when box width is set to a negative value
          width: width < 0 ? 0 : width,
          height: height < 0 ? 0 : height
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

  canRenderBoundingPoly = () => {
    return (
      isNumber(this.state.x) &&
      isNumber(this.state.y) &&
      isNumber(this.state.width) &&
      isNumber(this.state.height)
    );
  };

  render() {
    const { top, left, height, width } = this.props.overlayPositioningContext;
    const resizeHandleSize = 6;
    const handleShift = resizeHandleSize / 2;

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
        onMouseDown={this.handleBackgroundMouseDown}
        onMouseUp={this.handleBackgroundMouseUp}
        onMouseMove={this.handleBackgroundMouseMove}
      >
        {this.canRenderBoundingPoly() && (
          <Rnd
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
            size={{ width: this.state.width, height: this.state.height }}
            position={{ x: this.state.x, y: this.state.y }}
            bounds="parent"
            onDragStop={this.handleDragStop}
            onDrag={this.handleDrag}
            onResize={this.handleResize}
            onResizeStop={this.handleResizeStop}
            enableResizing={
              // don't show handles during initial drag placement
              this.state.drawingInitialBoundingBox ? false : undefined
            }
          />
        )}

        {this.props.acceptMode === 'confirm' &&
          this.canRenderBoundingPoly() && (
            <OverlayConfirmMenu
              visible={
                !this.state.userActingOnBoundingBox &&
                this.canRenderBoundingPoly() &&
                !this.state.userMinimizedConfirmMenu
              }
              confirmLabel={this.props.confirmLabel}
              onConfirm={this.handleConfirm}
              onCancel={this.handleCancel}
              onMinimize={this.handleMinimizeConfirmMenu}
            />
          )}
      </div>
    );
  }
}
