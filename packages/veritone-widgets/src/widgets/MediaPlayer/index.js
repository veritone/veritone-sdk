import React from 'react';
import {
  arrayOf,
  shape,
  string,
  number,
  bool,
  func,
  objectOf,
  any,
  object
} from 'prop-types';
import { connect } from 'react-redux';
import { Player, ControlBar, BigPlayButton } from 'video-react';

import { BoundingPolyOverlay, OverlayPositioningProvider } from 'veritone-react-common';
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
    boundingPolySeries: arrayOf(
      shape({
        startTimeMs: number.isRequired,
        stopTimeMs: number.isRequired,
        id: string.isRequired,
        object: shape({
          boundingPoly: arrayOf(
            shape({ x: number.isRequired, y: number.isRequired })
          ).isRequired
        })
      })
    ),
    onAddBoundingBox: func.isRequired,
    onDeleteBoundingBox: func.isRequired,
    onChangeBoundingBox: func.isRequired,
    overlayBorderStyle: string,
    actionMenuItems: arrayOf(
      shape({
        label: string.isRequired,
        onClick: func.isRequired
      })
    ),
    readOnly: bool,
    addOnly: bool,
    autoCommit: bool,
    width: number,
    height: number,
    // fluid = 100% width by default, see video-react docs
    fluid: bool,
    videoHeight: number,
    videoWidth: number,
    hasStarted: bool,
    isActive: bool,
    paused: bool,
    currentTime: number,
    forwardedRef: objectOf(any)
  };

  static contextTypes = {
    // need to pass our app's redux store to the Player, or else it will create
    // its own internal store that we can't integrate with
    store: object
  };

  static defaultProps = {
    fluid: true
  };

  handleAddBoundingBox = newBox => {
    this.props.onAddBoundingBox(newBox, this.props.currentTime * 1000);
  };

  render() {
    const { src, streams, ...props } = this.props;

    const currentPolys = getPolysForTime(
      this.props.boundingPolySeries || [],
      this.props.currentTime * 1000
    );

    return (
      <OverlayPositioningProvider
        contentHeight={this.props.videoHeight}
        contentWidth={this.props.videoWidth}
        fixedWidth={!props.fluid}
      >
        {this.props.hasStarted && (
          <BoundingPolyOverlay
            wrapperStyles={{ zIndex: 100 }}
            onAddBoundingBox={this.handleAddBoundingBox}
            onDeleteBoundingBox={this.props.onDeleteBoundingBox}
            onChangeBoundingBox={this.props.onChangeBoundingBox}
            overlayBackgroundColor="rgba(238, 110, 105, 0.5)"
            overlayBorderStyle={this.props.overlayBorderStyle}
            initialBoundingBoxPolys={
              this.props.boundingPolySeries ? currentPolys : undefined
            }
            actionMenuItems={this.props.actionMenuItems}
            addOnly={this.props.addOnly}
            readOnly={this.props.readOnly || !this.props.paused}
            autoCommit={this.props.autoCommit}
          />
        )}
        <Player
          className={styles.mediaPlayer}
          ref={this.props.forwardedRef}
          store={this.context.store}
          {...props}
        >
          {/* prevent video-react from adding its own control bar */}
          <ControlBar autoHide className={styles.hiddenDummyControls} />

          <VideoSource isVideoChild src={src} streams={streams} />
          <BigPlayButton position="center" className={styles.mediaPlayButton} />
        </Player>
      </OverlayPositioningProvider>
    );
  }
}

const MediaPlayer = React.forwardRef((props, ref) => {
  return <MediaPlayerComponent {...props} forwardedRef={ref} />;
});

export { MediaPlayer };
