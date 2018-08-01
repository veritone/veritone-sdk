import React from 'react';
import { isNumber, isEqual } from 'lodash';
import memoize from 'memoize-one';
import {
  arrayOf,
  bool,
  string,
  number,
  shape,
  func,
  objectOf,
  any
} from 'prop-types';
import { branch, renderNothing } from 'recompose';

import { getMousePosition } from 'helpers/dom';
import withContextProps from 'helpers/withContextProps';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import { OverlayPositioningContext } from './OverlayPositioningProvider';
import OverlayConfirmMenu from './OverlayConfirmMenu';
import OverlayActionsMenu from './OverlayActionsMenu';
import RndBox from './RndBox';
import { percentagePolyToPixelXYWidthHeight } from './helpers';

@withContextProps(OverlayPositioningContext.Consumer, context => ({
  overlayPositioningContext: context
}))
@branch(
  // do not render if we don't have a workable overlayPositioningContext
  props =>
    !(
      props.overlayPositioningContext.width &&
      props.overlayPositioningContext.height
    ),
  renderNothing
)
@withMuiThemeProvider
export default class Overlay extends React.Component {
  static propTypes = {
    confirmLabel: string,
    readOnly: bool,
    addOnly: bool,
    overlayPositioningContext: shape({
      top: number.isRequired,
      left: number.isRequired,
      width: number.isRequired,
      height: number.isRequired
    }).isRequired,
    wrapperStyles: objectOf(any),
    toolBarOffset: number,
    overlayBackgroundColor: string,
    overlayBorderStyle: string,
    overlayBackgroundBlendMode: string,
    onBoundingBoxChange: func.isRequired,
    initialBoundingBoxPolys: arrayOf(
      arrayOf(
        shape({
          x: number.isRequired,
          y: number.isRequired
        })
      )
    ),
    actionMenuItems: arrayOf(
      shape({
        label: string.isRequired,
        onClick: func.isRequired
      })
    )
  };

  static defaultProps = {
    confirmLabel: 'Add',
    readOnly: false,
    addOnly: false,
    initialBoundingBoxPolys: [],
    toolBarOffset: 0,
    overlayBackgroundColor: '#FF6464',
    overlayBackgroundBlendMode: 'hard-light',
    overlayBorderStyle: '1px solid #fff'
  };

  state = {
    boundingBoxPositions: [], // set in getDerivedStateFromProps
    focusedBoundingBoxIndex: null,
    stagedBoundingBoxPosition: {},
    userMinimizedConfirmMenu: false,
    userActingOnBoundingBox: false,
    drawingInitialBoundingBox: false
  };

  static getDerivedStateFromProps(props) {
    return {
      boundingBoxPositions: Overlay.mapPolysToInternalFormat(
        props.initialBoundingBoxPolys,
        props.overlayPositioningContext.width,
        props.overlayPositioningContext.height
      )
    };
  }

  // memoize so we don't update/render on every video frame
  /* eslint-disable-next-line react/sort-comp */
  static mapPolysToInternalFormat = memoize(
    (polys, width, height) =>
      polys.map(poly =>
        percentagePolyToPixelXYWidthHeight(poly, width, height)
      ),
    isEqual
  );

  handleResize = (e, direction, ref, delta, position) => {
    this.removeStagedBoundingBox();

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

  handleDragStagedBox = (e, d) => {
    this.setState({ userActingOnBoundingBox: true });
  };

  handleDragExistingBox = () => {
    this.removeStagedBoundingBox();

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

    if (this.props.readOnly || this.props.addOnly) {
      return;
    }

    this.removeStagedBoundingBox();

    // fixme: try to ignore clicks that are the result of mouseup after resize/drag
    const focusedIndex = e.target.getAttribute('data-boxindex');

    this.setState(state => {
      // clicking a focused box de-focuses it
      // if (
      //   focusedIndex &&
      //   Number(focusedIndex) === state.focusedBoundingBoxIndex
      // ) {
      //   return { focusedBoundingBoxIndex: null };
      // }

      // otherwise focus the clicked box
      return {
        focusedBoundingBoxIndex: focusedIndex
          ? Number(focusedIndex)
          : state.focusedBoundingBoxIndex
      };
    });
  };

  confirmStagedBoundingBox = () => {
    this.props.onBoundingBoxChange({
      allPolys: this.toPercentageBasedPoly([
        ...this.state.boundingBoxPositions,
        this.state.stagedBoundingBoxPosition
      ]),
      newPoly: this.toPercentageBasedPoly([
        this.state.stagedBoundingBoxPosition
      ])[0]
    });

    this.removeStagedBoundingBox();
  };

  removeStagedBoundingBox = () => {
    // delete staged box
    this.setState({
      stagedBoundingBoxPosition: {}
    });
  };

  minimizeConfirmMenu = () => {
    this.setState({ userMinimizedConfirmMenu: true });
  };

  handleBackgroundMouseDown = e => {
    if (this.props.readOnly) {
      return;
    }

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
      // focusedBoundingBoxIndex: null,
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
            // prevent weird behavior when box width is set to a negative value,
            // and don't allow boxes too small to interact with (~< 15px)
            width: width < 15 ? 15 : width,
            height: height < 15 ? 15 : height,
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
        userActingOnBoundingBox: false,
        focusedBoundingBoxIndex: null,
        userMinimizedConfirmMenu: false
      });
    }
  };

  handleDelete = () => {
    let result = [...this.state.boundingBoxPositions];
    result.splice(this.state.focusedBoundingBoxIndex, 1);

    this.props.onBoundingBoxChange({
      allPolys: this.toPercentageBasedPoly(result),
      deletedIndex: this.state.focusedBoundingBoxIndex
    });

    this.setState({
      userActingOnBoundingBox: false,
      focusedBoundingBoxIndex: null
    });
  };

  toPercentageBasedPoly = positions => {
    // translate from internal (x, y, width, height) format to veritone's
    // percentage-based vertex format
    const {
      width: containerWidth,
      height: containerHeight
    } = this.props.overlayPositioningContext;

    return positions.map(({ x, y, width, height }) => [
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
    ]);
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

    const showingConfirmMenu =
      this.hasStagedBoundingBox() &&
      !this.state.userActingOnBoundingBox &&
      !this.state.userMinimizedConfirmMenu;

    const showingActionsMenu =
      isNumber(this.state.focusedBoundingBoxIndex) &&
      !this.state.userActingOnBoundingBox &&
      !this.state.userMinimizedConfirmMenu;

    const boundingBoxStyles = {
      border: this.props.overlayBorderStyle,
      backgroundColor: this.props.overlayBackgroundColor,
      mixBlendMode: this.props.overlayBackgroundBlendMode,
      willChange: 'left, top, width, height' // this seems to fix some rendering jank
    };

    return (
      <div
        style={{
          position: 'absolute',
          overflow: 'hidden',
          top,
          left,
          height,
          width,
          pointerEvents: this.props.readOnly ? 'none' : 'auto',
          ...this.props.wrapperStyles
        }}
      >
        {this.state.boundingBoxPositions.map(({ x, y, width, height }, i) => (
          <RndBox
            // index is significant since boxes don't have IDs
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            extendsProps={{
              'data-boxindex': i,
              onClick: this.handleClickBox
            }}
            style={{
              ...boundingBoxStyles,
              // do not let this box interfere with mouse events as we draw out
              // the initial bounding box
              pointerEvents:
                this.props.readOnly ||
                this.props.addOnly ||
                this.state.drawingInitialBoundingBox
                  ? 'none'
                  : 'auto'
            }}
            size={{ width, height }}
            position={{ x, y }}
            onDragStop={this.handleDragExistingBoxStop}
            onDrag={this.handleDragExistingBox}
            onResize={this.handleResize}
            onResizeStop={this.handleResizeStop}
            disableDragging={this.props.readOnly || this.props.addOnly}
            enableResizing={
              !this.props.readOnly &&
              !this.props.addOnly &&
              this.state.focusedBoundingBoxIndex === i
                ? undefined
                : false
            }
          />
        ))}

        {this.hasStagedBoundingBox() &&
          !this.props.readOnly && (
            <RndBox
              style={{
                ...boundingBoxStyles,
                // do not let this box interfere with mouse events as we draw it out
                pointerEvents: this.state.drawingInitialBoundingBox
                  ? 'none'
                  : 'auto'
              }}
              size={{
                width: this.state.stagedBoundingBoxPosition.width,
                height: this.state.stagedBoundingBoxPosition.height
              }}
              position={{
                x: this.state.stagedBoundingBoxPosition.x,
                y: this.state.stagedBoundingBoxPosition.y
              }}
              onDragStop={this.handleDragStagedBoxStop}
              onDrag={this.handleDragStagedBox}
              onResize={this.handleResizeStagedBox}
              onResizeStop={this.handleResizeStop}
              enableResizing={
                // don't show handles during initial drag placement
                this.state.drawingInitialBoundingBox ? false : undefined
              }
            />
          )}

        {showingConfirmMenu &&
          !this.props.readOnly && (
            <OverlayConfirmMenu
              visible={showingConfirmMenu}
              confirmLabel={this.props.confirmLabel}
              onConfirm={this.confirmStagedBoundingBox}
              onCancel={this.removeStagedBoundingBox}
              onMinimize={this.minimizeConfirmMenu}
              bottomOffset={this.props.toolBarOffset}
            />
          )}

        {showingActionsMenu &&
          !this.props.addOnly &&
          !this.props.readOnly && (
            <OverlayActionsMenu
              visible={showingActionsMenu}
              onMinimize={this.minimizeConfirmMenu}
              menuItems={this.props.actionMenuItems}
              onDelete={this.handleDelete}
              onConfirm={this.handleConfirmChange}
              bottomOffset={this.props.toolBarOffset}
            />
          )}

        <div
          style={{
            width: '100%',
            height: '100%',
            cursor: this.props.readOnly ? 'auto' : 'crosshair'
          }}
          onMouseDown={this.handleBackgroundMouseDown}
          onMouseUp={this.handleBackgroundMouseUp}
          onMouseMove={this.handleBackgroundMouseMove}
        />
      </div>
    );
  }
}
