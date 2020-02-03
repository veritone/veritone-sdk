import React from 'react';
import { bool, string, shape, func, arrayOf, any } from 'prop-types';
import { withStyles } from '@material-ui/styles';

import { MediaPlayer } from '../';
import DefaultControlBar from '../DefaultControlBar';

import { Lightbox } from 'veritone-react-common';
import styles from './styles';

class MediaPlayerLightbox extends React.Component {
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
    autoPlay: bool,
    fullscreen: bool,
    onClose: func,
    readOnly: bool,
    onAddBoundingBox: func,
    onDeleteBoundingBox: func,
    onChangeBoundingBox: func,
    classes: shape({ any }),
  };
  static defaultProps = {
    open: true,
    fullscreen: true,
    readOnly: true
  };

  componentDidMount() {
    if (this.props.autoPlay) {
      setTimeout(() => {
        this.playerRef && this.playerRef.current.actions.play();
      });
    }
  }

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
    const { live, open, fullscreen, onClose, classes, ...props } = this.props;

    return (
      <Lightbox open={open} fullscreen={fullscreen} onClose={onClose}>
        <div className={classes.popupContainer} data-test="popupContainer">
          <MediaPlayer
            {...props}
            ref={this.playerRef}
            reactPlayerClassName={classes.reactPlayer}
            overlayContentClassName={classes.boundingPolyContent}
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
            btnFullscreenToggle={false}
            playerRef={this.playerRef}
          />
          {live && <div className={classes.liveLabel} data-test="liveLabel">LIVE</div>}
        </div>
      </Lightbox>
    );
  }
}


export default withStyles(styles)(MediaPlayerLightbox);