import { arrayOf, shape, string, func } from 'prop-types';
import React from 'react';
import {
  Player,
  VolumeMenuButton,
  ControlBar,
  ReplayControl,
  ForwardControl,
  PlayToggle,
  BigPlayButton
} from 'video-react';

import VideoSource from './VideoSource.js';
import RestartMediaButton from './RestartMediaButton.js';

import styles from './styles.scss';

const MediaPlayer = ({ src, streams, playerRef, ...props }) => {
  return (
    <Player className={styles.mediaPlayer} ref={playerRef} {...props}>
      <ControlBar autoHide className={styles.mediaPlayerControls}>
        <RestartMediaButton order={1.1} />
        <ReplayControl seconds={10} order={1.2} />
        <ForwardControl seconds={10} order={1.3} />
        <PlayToggle order={2} />
        <VolumeMenuButton vertical order={7} />
      </ControlBar>
      <VideoSource isVideoChild src={src} streams={streams} />
      <BigPlayButton className={styles.mediaPlayButton} />
    </Player>
  );
};

MediaPlayer.propTypes = {
  src: string,
  streams: arrayOf(
    shape({
      protocol: string,
      uri: string
    })
  ),
  playerRef: func
};

export default MediaPlayer;
