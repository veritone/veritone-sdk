import React from 'react';
import {
  arrayOf,
  shape,
  string,
  number,
  bool,
  func,
  objectOf,
  any
} from 'prop-types';
import { noop } from 'lodash';
import { connect } from 'react-redux';
import { Player, ControlBar, BigPlayButton } from 'video-react';

import { Overlay, OverlayPositioningProvider } from 'veritone-react-common';
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
        object: shape({
          boundingPoly: arrayOf(
            shape({ x: number.isRequired, y: number.isRequired })
          ).isRequired
        })
      })
    ),
    onBoundingBoxChange: func,
    width: number,
    height: number,
    videoHeight: number,
    videoWidth: number,
    hasStarted: bool,
    isActive: bool,
    paused: bool,
    currentTime: number,
    forwardedRef: objectOf(any)
  };

  static defaultProps = {
    onBoundingBoxChange: noop
  };

  handleBoundingBoxChange = (allPolys, newPoly) => {
    this.props.onBoundingBoxChange(allPolys, newPoly, {
      currentTime: this.props.currentTime
    });
  };

  render() {
    const { src, streams, ...props } = this.props;

    return (
      <div style={{ width: this.props.width, height: this.props.height }}>
        <OverlayPositioningProvider
          contentHeight={this.props.videoHeight}
          contentWidth={this.props.videoWidth}
        >
          {this.props.hasStarted && this.props.isActive && (
            <Overlay
              wrapperStyles={{ zIndex: 100 }}
              // toolBarOffset={50}
              onBoundingBoxChange={this.handleBoundingBoxChange}
              overlayBackgroundColor="rgba(238, 110, 105, 0.5)"
              // overlayBorderStyle={overlayBorderStyle}
              // overlayBackgroundBlendMode={overlayBackgroundBlendMode}
              initialBoundingBoxPolys={
                this.props.boundingPolySeries
                  ? getPolysForTime(
                      this.props.boundingPolySeries,
                      this.props.currentTime * 1000
                    )
                  : undefined
              }
              readOnly={!this.props.paused}
              key={this.props.currentTime}
            />
          )}
          <Player
            className={styles.mediaPlayer}
            ref={this.props.forwardedRef}
            {...props}
          >
            {/* prevent video-react from adding its own control bar */}
            <ControlBar autoHide className={styles.hiddenDummyControls} />

            <VideoSource isVideoChild src={src} streams={streams} />
            <BigPlayButton
              position="center"
              className={styles.mediaPlayButton}
            />
          </Player>
        </OverlayPositioningProvider>
      </div>
    );
  }
}

const MediaPlayer = React.forwardRef((props, ref) => {
  return <MediaPlayerComponent {...props} forwardedRef={ref} />;
});

export { MediaPlayer };
