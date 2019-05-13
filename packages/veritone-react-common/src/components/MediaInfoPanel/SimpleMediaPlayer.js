import React from 'react';
import { arrayOf, string, shape } from 'prop-types';

import shaka from 'shaka-player';

export default class SimpleMediaPlayer extends React.Component {
  componentDidMount() {
    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
      this.shakaPlayer = new shaka.Player(this.video.current);
      this.shakaPlayer
        .getNetworkingEngine()
        .registerRequestFilter(function (type, request) {
          request.allowCrossSiteCredentials = (
            type === shaka.net.NetworkingEngine.RequestType.MANIFEST
          );
        });
    }
    this.loadStreams({});
  }

  componentDidUpdate(prevProps) {
    this.loadStreams(prevProps);
  }

  loadStreams = (prevProps = {}) => {
    const { streams, src } = this.props;
    const supportedStreams = this.getStreams(streams);

    const { streams: prevStreams = [], src: prevSrc } = prevProps || {};
    const prevSupportedStreams = this.getStreams(prevStreams);
    const prevStreamUri = prevSupportedStreams.dash || prevSupportedStreams.hls;

    const streamUri = supportedStreams.dash || supportedStreams.hls;
    if (this.shakaPlayer && this.shouldLoadStream(streamUri, prevStreamUri)) {
      return this.shakaPlayer
        .load(streamUri)
        .catch(() => {
          this.video.current.src = src;
          this.video.current.load();
        });
    }
    if (this.video.current.canPlayType('application/vnd.apple.mpegurl') &&
      this.shouldLoadStream(supportedStreams.hls, prevSupportedStreams.hls)
    ) {
      this.video.current.src = supportedStreams.hls;
      return this.video.current.load();
    }
    if (this.shouldLoadStream(src, prevSrc)) {
      this.video.current.src = src;
      return this.video.current.load();
    }
  }

  shouldLoadStream(value, preValue) {
    return value && value !== preValue;
  }

  getStreams(streams) {
    return streams.reduce((streamUris, { protocol, uri }) => ({
      ...streamUris,
      [protocol]: uri
    }), {});
  }

  video = React.createRef();

  render() {
    const { poster } = this.props;

    return (
      <video poster={poster} ref={this.video} controls height="250" />
    )
  }
}

SimpleMediaPlayer.propTypes = {
  poster: string,
  src: string,
  streams: arrayOf(shape({
    protocol: string,
    uri: string
  }))
}
