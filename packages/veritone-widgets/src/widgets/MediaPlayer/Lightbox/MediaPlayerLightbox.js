import React from 'react';
import { bool, string, shape, func, arrayOf } from 'prop-types';

import { MediaPlayer } from '../';
import DefaultControlBar from '../DefaultControlBar';

import { Lightbox } from 'veritone-react-common';
import styles from './styles.scss';

export default class MediaPlayerLightbox extends React.Component {
  static propTypes = {
    src: string,
    streams: arrayOf(
      shape({
        protocol: string,
        uri: string
      })
    ),
    live: bool,
    open: bool,
    fullscreen: bool,
    onClose: func,
    readOnly: bool,
    onAddBoundingBox: func,
    onDeleteBoundingBox: func,
    onChangeBoundingBox: func
  };
  static defaultProps = {
    open: true,
    fullscreen: true,
    readOnly: true
  };

  playerRef = React.createRef();

  handleOnAddBoundingBox = (...args) => {
    this.props.onAddBoundingBox && this.props.onAddBoundingBox(...args);
  };

  handleOnDeleteBoundingBox = (...args) => {
    this.props.onDeleteBoundingBox && this.props.onDeleteBoundingBox(...args);
  };

  handleOnChangeBoundingBox = (...args) => {
    this.props.onChangeBoundingBox && this.props.onChangeBoundingBox(...args);
  };

  render() {
    const { live, open, fullscreen, onClose, ...props } = this.props;

    return (
      <Lightbox open={open} fullscreen={fullscreen} onClose={onClose}>
        <div className={styles.popupContainer}>
          <MediaPlayer
            {...props}
            ref={this.playerRef}
            reactPlayerClassName={styles.reactPlayer}
            overlayContentClassName={styles.boundingPolyContent}
            onAddBoundingBox={this.handleOnAddBoundingBox}
            onDeleteBoundingBox={this.handleOnDeleteBoundingBox}
            onChangeBoundingBox={this.handleOnChangeBoundingBox}
          />
          <DefaultControlBar 
             btnRestart={!live}
             btnReplay={!live}
             btnForward={!live}
             btnPlayToggle={!live}
             ctrlProgress={!live}
             displayTime={!live}
            playerRef={this.playerRef}
          />
          {live && <div className={styles.liveLabel}>LIVE</div>}
        </div>
      </Lightbox>
    );
  }
}
