import { arrayOf, shape, string, func, bool } from 'prop-types';
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

import VideoSource from './VideoSource';
import RestartMediaButton from './RestartMediaButton';

import Dialog from '@material-ui/core/Dialog';
//import HighlightOff from '@material-ui/icons/HighlightOff';
//import IconButton from '@material-ui/core/IconButton';

import styles from './styles.scss';

const mediaPlayerPropTypes = {
  src: string,
  streams: arrayOf(
    shape({
      protocol: string,
      uri: string
    })
  ),
  playerRef: func
}

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

MediaPlayer.propTypes = mediaPlayerPropTypes;

const PopupMediaPlayer = ({src, streams, playerRef, open, live, onClose, ...props}) => {
  return (
    <Dialog open={open} maxWidth={false} onClose={onClose}>
      <div className={styles.popupContainer}>
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
        { live && (<div className={styles.liveLabel}>LIVE</div>) }
      </div>
    </Dialog>
  );
}

PopupMediaPlayer.propTypes = {
  ...mediaPlayerPropTypes,
  open: bool,
  live: bool,
  onClose: func,
}

PopupMediaPlayer.defaultProps = {
  open: true
}

export { MediaPlayer, PopupMediaPlayer };
