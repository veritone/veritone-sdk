import React from 'react';
import { arrayOf, shape, string, number, bool } from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';
import cx from 'classnames';
import {
  Player,
  VolumeMenuButton,
  ControlBar,
  ReplayControl,
  ForwardControl,
  PlayToggle,
  BigPlayButton
} from 'video-react';

import { Overlay, OverlayPositioningProvider } from 'veritone-react-common';
import VideoSource from './VideoSource';
import RestartMediaButton from './RestartMediaButton';
import { getPolysForTime } from './helpers';

import './videoReactStyles.scss';
import styles from './styles.scss';

@connect(state => ({
  videoHeight: state.player.videoHeight,
  videoWidth: state.player.videoWidth,
  hasStarted: state.player.hasStarted,
  currentTime: state.player.currentTime,
  paused: state.player.paused,
}))
class MediaPlayer extends React.Component {
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
    width: number,
    height: number,
    videoHeight: number,
    videoWidth: number,
    hasStarted: bool,
    paused: bool,
    currentTime: number
  };

  handleAddBoundingBox = (allPolys, newPoly) => {
    console.log(newPoly)
  };

  playerRef = React.createRef();

  render() {
    const { src, streams, ...props } = this.props;
    const manager = get(this.playerRef, 'current.manager');
    let player, actions, store;
    if (manager) {
      player = manager.getState().player;
      actions = manager.getActions();
      store = manager.store;
    }

    return (
      <div style={{ width: this.props.width, height: this.props.height }}>
        <OverlayPositioningProvider
          contentHeight={this.props.videoHeight}
          contentWidth={this.props.videoWidth}
        >
          {this.props.hasStarted && (
            <Overlay
              wrapperStyles={{ zIndex: 100 }}
              // toolBarOffset={50}
              onBoundingBoxChange={this.handleAddBoundingBox}
              overlayBackgroundColor="rgba(238, 110, 105, 0.5)"
              // overlayBorderStyle={overlayBorderStyle}
              // overlayBackgroundBlendMode={overlayBackgroundBlendMode}
              initialBoundingBoxPolys={getPolysForTime(
                this.props.boundingPolySeries,
                this.props.currentTime * 1000
              )}
              readOnly={!this.props.paused}
              key={this.props.currentTime}
            />
          )}
          <Player
            className={styles.mediaPlayer}
            ref={this.playerRef}
            {...props}
          >
            <ControlBar autoHide className={styles.hiddenDummyControls} />
            <VideoSource isVideoChild src={src} streams={streams} />
            <BigPlayButton
              position="center"
              className={styles.mediaPlayButton}
            />
          </Player>
        </OverlayPositioningProvider>
        <div
          className={cx('video-react', {
            'video-react-has-started': this.props.hasStarted
          })}
        >
          {manager && (
            <ControlBar
              className={cx(styles.mediaPlayerControls, styles.mediaPlayer)}
              player={player}
              manager={manager}
              actions={actions}
              store={store}
            >
              <RestartMediaButton order={1.1} />
              <ReplayControl seconds={10} order={1.2} />
              <ForwardControl seconds={10} order={1.3} />
              <PlayToggle order={2} />
              <VolumeMenuButton vertical order={7} />
            </ControlBar>
          )}
        </div>
      </div>
    );
  }
}

export { MediaPlayer };
