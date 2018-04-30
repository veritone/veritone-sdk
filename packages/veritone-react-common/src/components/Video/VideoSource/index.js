import React from 'react';
import { arrayOf, shape, string, func } from 'prop-types';
import { get, find } from 'lodash';
import shaka from 'shaka-player';
export default class VideoSource extends React.Component {
  static propTypes = {
    video: shape({ canPlayType: func }),
    src: string,
    streams: arrayOf(
      shape({
        protocol: string,
        uri: string
      })
    )
  };

  state = {
    src: null
  };

  componentWillMount() {
    shaka.polyfill.installAll();
  }

  componentWillReceiveProps(nextProps) {
    const { video, src, streams } = nextProps;
    const dashUri = this.getStreamUri(streams, 'dash');
    const hlsUri = this.getStreamUri(streams, 'hls');
    const streamUri = dashUri || hlsUri;
    // check if browser supports playing hls & dash with shaka player
    const browserSupportsShaka = shaka.Player.isBrowserSupported();
    let sourceUri;
    if (video && streamUri && browserSupportsShaka) {
      if (streamUri === this.state.streamUri) {
        // media already loaded
        return;
      }
      if (!this.player) {
        this.player = new shaka.Player(video);
      }
      this.player.load(streamUri).catch(err => {
        console.log('error loading video with shaka player', err);
      });
      this.setState({
        streamUri: streamUri
      });
    } else if (hlsUri && video.canPlayType('application/vnd.apple.mpegurl')) {
      // iOS does not work with the shaka-player. check if browser has native HLS support,
      // if it does then set src to HLS manifest (primarily for safari on iOS)
      sourceUri = hlsUri;
    } else {
      sourceUri = src;
    }
    if (sourceUri && sourceUri !== this.state.src) {
      this.setState({
        src: sourceUri
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { video } = this.props;
    if (video && this.state.src && this.state.src !== prevState.src) {
      video.load();
    }
  }

  getStreamUri(streams, protocol) {
    const stream = find(streams, { protocol });
    return get(stream, 'uri');
  }

  render() {
    return this.state.src && <source src={this.state.src} />;
  }
}
