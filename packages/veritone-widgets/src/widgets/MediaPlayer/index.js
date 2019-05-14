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
  oneOfType
} from 'prop-types';
import { connect } from 'react-redux';
import { Player, ControlBar, BigPlayButton } from 'video-react';

import {
  MediaPlayer as LibMediaPlayer,
  BoundingPolyOverlay,
  OverlayPositioningProvider
} from 'veritone-react-common';
import VideoSource from './VideoSource';
import { getPolysForTime } from './helpers';

import styles from './styles.scss';

@connect(state => ({
  videoHeight: state.player.videoHeight,
  videoWidth: state.player.videoWidth,
  hasStarted: state.player.hasStarted,
  isActive: state.player.isActive,
  currentTime: state.player.currentTime,
  paused: state.player.paused
}))
class MediaPlayerComponent extends React.Component {
  static propTypes = {
    src: string,
    streams: arrayOf(
      shape({
        protocol: string,
        uri: string
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
          ).isRequired
        })
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
        onClick: func.isRequired
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
    forwardedRef: objectOf(any)
  };

  static contextTypes = {
    // need to pass our app's redux store to the Player, or else it will create
    // its own internal store that we can't integrate with
    store: object
  };

  static defaultProps = {
    fluid: true,
    onAddBoundingBox: noop,
    onDeleteBoundingBox: noop,
    onChangeBoundingBox: noop
  };

  render() {
    return (
      <LibMediaPlayer
        {...this.props} />
    );
  }
}

const MediaPlayer = React.forwardRef((props, ref) => {
  return <MediaPlayerComponent {...props} forwardedRef={ref} />;
});
MediaPlayer.displayName = 'MediaPlayer';

export { MediaPlayer };
