import React from 'react';
import { arrayOf, shape, string, func, bool } from 'prop-types';
import { get, find } from 'lodash';
import shaka from 'shaka-player';

export default class VideoSource extends React.Component {
  static propTypes = {
    video: shape({
      canPlayType: func.isRequired,
      load: func.isRequired
    }),
    src: string,
    streams: arrayOf(
      shape({
        protocol: string.isRequired,
        uri: string.isRequired
      })
    ),
    disablePreload: bool
  };

  state = {
    src: null
  };

  UNSAFE_componentWillMount() {
    shaka.polyfill.installAll();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { video, src, streams, disablePreload } = nextProps;
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
        this.player
          .getNetworkingEngine()
          .registerRequestFilter(function(type, request) {
            if (type === shaka.net.NetworkingEngine.RequestType.MANIFEST) {
              request.allowCrossSiteCredentials = true;
            }
          });
      }
      if (disablePreload) {
        video.onplay = () => {
          video.onplay = null;
          this.player
            .load(streamUri)
            .then(() => {
              video.play();
              return;
            })
            .catch(err => {
              console.log('error loading video with shaka player', err);
            });
        };
      } else {
        this.player.load(streamUri).catch(err => {
          console.log('error loading video with shaka player', err);
        });
      }
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

  componentDidUpdate(_prevProps, prevState) {
    const { video, disablePreload } = this.props;
    if (
      !disablePreload &&
      video &&
      this.state.src &&
      this.state.src !== prevState.src
    ) {
      video.load();
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.unload();
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
