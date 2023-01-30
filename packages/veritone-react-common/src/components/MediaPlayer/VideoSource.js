import React from 'react';
import { arrayOf, shape, string, func, bool, number } from 'prop-types';
import { get, find, includes } from 'lodash';
import shaka from 'shaka-player';
export default class VideoSource extends React.Component {
  static propTypes = {
    video: shape({
      canPlayType: func.isRequired,
      load: func.isRequired,
    }),
    src: string,
    streams: arrayOf(
      shape({
        protocol: string.isRequired,
        uri: string.isRequired,
      })
    ),
    disablePreload: bool,
    currentTime: number,
    actions: shape({
      seek: func.isRequired,
    }),
  };

  state = {
    src: null,
    expiredSignedUri: false,
  };

  UNSAFE_componentWillMount() {
    shaka.polyfill.installAll();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { video, src, streams, disablePreload } = nextProps;
    this.loadVideo(video, src, streams, disablePreload);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      video,
      src,
      streams,
      disablePreload,
      currentTime,
      actions,
    } = this.props;
    if (
      !disablePreload &&
      video &&
      this.state.src &&
      this.state.src !== prevState.src
    ) {
      video.load();
    }
    if (this.state.expiredSignedUri !== prevState.expiredSignedUri) {
      this.setState({
        streamUri: undefined,
      });
      this.loadVideo(video, src, streams, disablePreload);
      setTimeout(() => {
        if (actions) {
          actions.seek(currentTime);
        }
      }, 500);
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

  loadVideo = (video, src, streams, disablePreload) => {
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
        //TODO if session cookie is not available, will need to set Authorization header on request using auth token
        if (
          includes(streamUri, 'veritone.com/media-streamer/stream') ||
          includes(streamUri, 'veritone.com/v3/stream/')
        ) {
          this.player
            .getNetworkingEngine()
            .registerRequestFilter(function (type, request) {
              if (type === shaka.net.NetworkingEngine.RequestType.MANIFEST) {
                request.allowCrossSiteCredentials = true;
              }
            });
        }
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
            .catch((err) => {
              console.log('error loading video with shaka player', err);
            });
        };
      } else {
        this.player.load(streamUri).catch((err) => {
          console.log('error loading video with shaka player', err);
        });
      }
      this.setState({
        streamUri: streamUri,
      });
      this.player.addEventListener('error', () => {
        this.setState({
          expiredSignedUri: true,
        });
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
        src: sourceUri,
      });
    }
  };

  render() {
    return this.state.src && <source src={this.state.src} />;
  }
}
