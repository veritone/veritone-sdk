import React from 'react';
import { isNumber, isEqual, findIndex, get } from 'lodash';
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
import { guid } from '../../helpers/guid';

import { getMousePosition } from '../../helpers/dom';
import withContextProps from '../../helpers/withContextProps';
import { OverlayPositioningContext } from './OverlayPositioningProvider';
import RndBox from './RndBox';
import {
  percentagePolyToPixelXYWidthHeight,
  pixelXYWidthHeightToPercentagePoly
} from './helpers';

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
export default class Overlay extends React.Component {
  static propTypes = {
    confirmLabel: string,
    readOnly: bool,
    addOnly: bool,
    autoCommit: bool,
    overlayPositioningContext: shape({
      top: number.isRequired,
      left: number.isRequired,
      width: number.isRequired,
      height: number.isRequired
    }).isRequired,
    wrapperStyles: objectOf(any),
    defaultBoundingBoxStyles: objectOf(any),
    stagedBoundingBoxStyles: objectOf(any),
    stylesByObjectType: objectOf(objectOf(any)),
    toolBarOffset: number,
    onAddBoundingBox: func.isRequired,
    onDeleteBoundingBox: func.isRequired,
    onChangeBoundingBox: func.isRequired,
    initialBoundingBoxPolys: arrayOf(
      shape({
        // unique ID
        id: string.isRequired,
        // optional type for styles + future stuff maybe
        // (corresponds to props.stylesByObjectType)
        overlayObjectType: string,
        readOnly: bool,
        // vertices
        boundingPoly: arrayOf(
          shape({
            x: number.isRequired,
            y: number.isRequired
          }).isRequired
        ).isRequired
      })
    ),
    actionMenuItems: arrayOf(
      shape({
        label: string.isRequired,
        onClick: func.isRequired
      })
    ),
    autofocus: bool
  };

  static defaultProps = {
    confirmLabel: 'Add',
    readOnly: false,
    addOnly: false,
    initialBoundingBoxPolys: [],
    toolBarOffset: 0,
    stagedBoundingBoxStyles: {},
    stylesByObjectType: {},
    defaultBoundingBoxStyles: {
      backgroundColor: 'rgba(72,147,226,0.7)',
      border: '1px solid #4893E2'
    }
  };

  state = {
    boundingBoxPositions: [], // set in getDerivedStateFromProps
    focusedBoundingBoxId: null,
    stagedBoundingBoxPosition: {},
    userMinimizedConfirmMenu: false,
    userActingOnBoundingBox: false,
    drawingInitialBoundingBox: false
  };

  static getDerivedStateFromProps(props) {
    const { initialBoundingBoxPolys } = props;
    return {
      boundingBoxPositions: Overlay.mapPolysToInternalFormat(
        props.initialBoundingBoxPolys,
        props.overlayPositioningContext.width,
        props.overlayPositioningContext.height
      ),
      focusedBoundingBoxId: get(initialBoundingBoxPolys, [0, 'id'], null)
    };
  }

  // memoize so we don't update/render on every video frame
  /* eslint-disable-next-line react/sort-comp */
  static mapPolysToInternalFormat = memoize(
    (polys, width, height) =>
      polys.map(({ boundingPoly, ...rest }) => ({
        boundingPoly: percentagePolyToPixelXYWidthHeight(
          boundingPoly,
          width,
          height
        ),
        ...rest
      })),
    isEqual
  );

  handleResizeExistingBox = (e, direction, ref, delta, position) => {
    this.removeStagedBoundingBox();
    this.setState(state => {
      const focusedId = ref.getAttribute('data-boxid');
      const focusedIndex = findIndex(state.boundingBoxPositions, {
        id: focusedId
      });

      state.boundingBoxPositions[focusedIndex].boundingPoly = {
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

  handleResizeStagedBoxStop = () => {
    this.setState({
      userActingOnBoundingBox: false,
      userMinimizedConfirmMenu: false
    });
  };

  handleResizeExistingBoxStop = (e, direction, ref, delta, position) => {
    const focusedId = ref.getAttribute('data-boxid');
    const focusedIndex = findIndex(this.state.boundingBoxPositions, {
      id: focusedId
    });

    this.props.onChangeBoundingBox({
      ...this.state.boundingBoxPositions[focusedIndex],
      boundingPoly: pixelXYWidthHeightToPercentagePoly(
        this.state.boundingBoxPositions[focusedIndex].boundingPoly,
        this.props.overlayPositioningContext.width,
        this.props.overlayPositioningContext.height
      )
    });

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
    const focusedId = node.getAttribute('data-boxid');
    const focusedIndex = findIndex(this.state.boundingBoxPositions, {
      id: focusedId
    });

    const draggedObject = {
      ...this.state.boundingBoxPositions[focusedIndex].boundingPoly,
      x,
      y
    };

    this.props.onChangeBoundingBox({
      ...this.state.boundingBoxPositions[focusedIndex],
      boundingPoly: pixelXYWidthHeightToPercentagePoly(
        draggedObject,
        this.props.overlayPositioningContext.width,
        this.props.overlayPositioningContext.height
      )
    });

    this.setState({
      userActingOnBoundingBox: false,
      userMinimizedConfirmMenu: false
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
    const focusedId = e.target.getAttribute('data-boxid');

    // full read/add only
    if (this.props.readOnly || this.props.addOnly) {
      return;
    }

    // individual box marked as readonly
    const focusedIndex = findIndex(this.state.boundingBoxPositions, {
      id: focusedId
    });
    if (get(this.state.boundingBoxPositions[focusedIndex], 'readOnly')) {
      return;
    }

    this.removeStagedBoundingBox();

    this.setState(state => {
      return {
        focusedBoundingBoxId: focusedId ? focusedId : state.focusedBoundingBoxId
      };
    });
  };

  confirmStagedBoundingBox = () => {
    if (this.hasStagedBoundingBox()) {
      const id = guid();
      this.props.onAddBoundingBox({
        boundingPoly: pixelXYWidthHeightToPercentagePoly(
          this.state.stagedBoundingBoxPosition,
          this.props.overlayPositioningContext.width,
          this.props.overlayPositioningContext.height
        ),
        id: id
      });

      if (this.props.autofocus) {
        this.setState({ focusedBoundingBoxId: id });
      }

      this.removeStagedBoundingBox();
    }
  };

  removeStagedBoundingBox = () => {
    this.setState({
      stagedBoundingBoxPosition: {}
    });
  };

  minimizeConfirmMenu = () => {
    this.setState({ userMinimizedConfirmMenu: true });
  };

  handleBackgroundMouseDown = e => {
    if (this.state.boundingBoxPositions.length >= 1) {
      return;
    }
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

  handleBackgroundMouseUp = () => {
    if (this.state.drawingInitialBoundingBox) {
      if (this.props.autoCommit) {
        this.confirmStagedBoundingBox();
      }
      this.setState({
        drawingInitialBoundingBox: false,
        userActingOnBoundingBox: false,
        userMinimizedConfirmMenu: false
      });
    }
  };

  handleDelete = () => {
    this.props.onDeleteBoundingBox(this.state.focusedBoundingBoxId);
    this.setState({
      userActingOnBoundingBox: false,
      focusedBoundingBoxId: null
    });
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

    const boundingBoxCommonStyles = {
      willChange: 'left, top, width, height'
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
        {this.state.boundingBoxPositions.map(
          ({
            id,
            overlayObjectType,
            readOnly,
            boundingPoly: { x, y, width, height }
          }) => (
              <RndBox
                key={id}
                data-boxid={id}
                onClick={this.handleClickBox}
                style={{
                  ...boundingBoxCommonStyles,
                  ...this.props.defaultBoundingBoxStyles,
                  ...this.props.stylesByObjectType[overlayObjectType],
                  pointerEvents:
                    readOnly ||
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
                onResize={this.handleResizeExistingBox}
                onResizeStop={this.handleResizeExistingBoxStop}
                disableDragging={
                  readOnly || this.props.readOnly || this.props.addOnly
                }
                enableResizing={
                  !readOnly &&
                    !this.props.readOnly &&
                    !this.props.addOnly &&
                    this.state.focusedBoundingBoxId === id
                    ? undefined
                    : false
                }
              />
            )
        )}

        {this.hasStagedBoundingBox() &&
          !this.props.readOnly && (
            <RndBox
              style={{
                ...boundingBoxCommonStyles,
                ...this.props.defaultBoundingBoxStyles,
                ...this.props.stagedBoundingBoxStyles,
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
              onResizeStop={this.handleResizeStagedBoxStop}
              enableResizing={
                // don't show handles during initial drag placement
                this.state.drawingInitialBoundingBox ? false : undefined
              }
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
