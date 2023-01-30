import React from 'react';
import { get, noop } from 'lodash';
import {
  arrayOf,
  shape,
  string,
  number,
  bool,
  func,
  objectOf,
  any,
  object,
  oneOfType,
} from 'prop-types';
import {
  Player,
  ControlBar,
  BigPlayButton,
  VolumeMenuButton,
  ReplayControl,
  ForwardControl,
  PlayToggle,
  CurrentTimeDisplay,
  TimeDivider,
  DurationDisplay,
  ProgressControl,
  FullscreenToggle,
} from 'video-react';
import cx from 'classnames';
import { withStyles } from '@material-ui/styles';
import RestartMediaButton from './RestartMediaButton';
import BoundingPolyOverlay from './../BoundingPolyOverlay/Overlay';
import OverlayPositioningProvider from './../BoundingPolyOverlay/OverlayPositioningProvider';

import VideoSource from './VideoSource';
import { getPolysForTime } from './helpers';

import styles from './styles';

class MediaPlayerComponent extends React.Component {
  static propTypes = {
    src: string,
    streams: arrayOf(
      shape({
        protocol: string,
        uri: string,
      })
    ),
    overlayContentClassName: string,
    reactPlayerClassName: string,
    boundingPolySeries: arrayOf(
      shape({
        startTimeMs: number.isRequired,
        stopTimeMs: number.isRequired,
        object: shape({
          id: string.isRequired,
          overlayObjectType: string,
          boundingPoly: arrayOf(
            shape({ x: number.isRequired, y: number.isRequired })
          ).isRequired,
        }),
      })
    ),
    onAddBoundingBox: func,
    onDeleteBoundingBox: func,
    onChangeBoundingBox: func,
    onPlayerRefReady: func,

    defaultBoundingBoxStyles: objectOf(any),
    stagedBoundingBoxStyles: objectOf(any),
    stylesByObjectType: objectOf(objectOf(any)),

    actionMenuItems: arrayOf(
      shape({
        label: string.isRequired,
        onClick: func.isRequired,
      })
    ),
    readOnly: bool,
    addOnly: bool,
    autoCommit: bool,
    width: oneOfType([string, number]),
    height: oneOfType([string, number]),
    // fluid = 100% width by default, see video-react docs
    fluid: bool,
    videoHeight: number,
    videoWidth: number,
    hasStarted: bool,
    isActive: bool,
    paused: bool,
    currentTime: number,
    autofocus: bool,
    myForwardedRef: objectOf(any),
    useOverlayControlBar: bool,
    isFullscreen: bool,
    btnRestart: bool,
    btnReplay: bool,
    btnForward: bool,
    btnPlayToggle: bool,
    btnVolume: bool,
    btnFullscreenToggle: bool,
    ctrlProgress: bool,
    displayTime: bool,
    autoHide: bool,
    autoHideTime: number,
    classes: shape({ any }),
  };

  static contextTypes = {
    // need to pass our app's redux store to the Player, or else it will create
    // its own internal store that we can't integrate with
    store: object,
  };

  static defaultProps = {
    fluid: true,
    onAddBoundingBox: noop,
    onDeleteBoundingBox: noop,
    onChangeBoundingBox: noop,
    useOverlayControlBar: false,
    btnRestart: true,
    btnReplay: true,
    btnForward: true,
    btnPlayToggle: true,
    btnVolume: true,
    btnFullscreenToggle: true,
    ctrlProgress: true,
    displayTime: true,
    autoHide: true,
    autoHideTime: 1000,
  };

  componentDidMount() {
    if (this.props.onPlayerRefReady) {
      const playerRef = get(this.props.myForwardedRef, 'current');
      if (playerRef) {
        this.props.onPlayerRefReady(playerRef);
      }
    }
  }

  handleAddBoundingBox = (newBox) => {
    this.props.onAddBoundingBox(newBox, this.props.currentTime * 1000);
  };

  render() {
    const {
      src,
      streams,
      overlayContentClassName,
      reactPlayerClassName,
      useOverlayControlBar,
      isFullscreen,
      btnRestart,
      btnReplay,
      btnForward,
      btnPlayToggle,
      btnVolume,
      btnFullscreenToggle,
      ctrlProgress,
      displayTime,
      autoHide,
      autoHideTime,
      classes,
      ...props
    } = this.props;

    const currentPolys = getPolysForTime(
      this.props.boundingPolySeries || [],
      this.props.currentTime * 1000
    );

    return (
      <OverlayPositioningProvider
        contentHeight={this.props.videoHeight}
        contentWidth={this.props.videoWidth}
        fixedWidth={!props.fluid}
        contentClassName={overlayContentClassName}
      >
        {this.props.hasStarted && (
          <BoundingPolyOverlay
            wrapperStyles={{ zIndex: 100 }}
            onAddBoundingBox={this.handleAddBoundingBox}
            onDeleteBoundingBox={this.props.onDeleteBoundingBox}
            onChangeBoundingBox={this.props.onChangeBoundingBox}
            initialBoundingBoxPolys={
              this.props.boundingPolySeries ? currentPolys : undefined
            }
            actionMenuItems={this.props.actionMenuItems}
            addOnly={this.props.addOnly}
            readOnly={this.props.readOnly || !this.props.paused}
            autoCommit={this.props.autoCommit}
            stagedBoundingBoxStyles={props.stagedBoundingBoxStyles}
            stylesByObjectType={props.stylesByObjectType}
            defaultBoundingBoxStyles={props.defaultBoundingBoxStyles}
            autofocus={props.autofocus}
          />
        )}
        <Player
          className={cx(classes.mediaPlayer, reactPlayerClassName)}
          ref={this.props.myForwardedRef}
          store={this.context.store}
          {...props}
        >
          <ControlBar
            className={cx('video-react', classes.mediaPlayerControls)}
            autoHide={autoHide}
            autoHideTime={autoHideTime}
            disableDefaultControls
            disableCompletely={!useOverlayControlBar && !isFullscreen}
          >
            {btnRestart && <RestartMediaButton order={1.1} />}
            {btnReplay && <ReplayControl seconds={10} order={1.2} />}
            {btnForward && <ForwardControl seconds={10} order={1.3} />}
            {btnPlayToggle && <PlayToggle order={2} />}
            {displayTime && <CurrentTimeDisplay order={3.1} />}
            {displayTime && <TimeDivider order={3.2} />}
            {displayTime && <DurationDisplay order={3.3} />}
            {ctrlProgress && <ProgressControl order={6} />}
            {btnVolume && (
              <VolumeMenuButton vertical={ctrlProgress} order={7} />
            )}
            {btnFullscreenToggle && <FullscreenToggle order={8} />}
          </ControlBar>
          <VideoSource
            isVideoChild
            src={src}
            streams={streams}
            disablePreload={props.preload === 'none' ? true : false}
            currentTime={this.props.currentTime}
          />
          <BigPlayButton
            position="center"
            className={classes.mediaPlayButton}
          />
        </Player>
      </OverlayPositioningProvider>
    );
  }
}

export default withStyles(styles)(MediaPlayerComponent);
