import React from 'react';
import { arrayOf, shape, string, func, bool, number } from 'prop-types';
import { get, find } from 'lodash';
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
  };

  state = {
    src: null,
    isStreamUriExpired: false,
  };

  UNSAFE_componentWillMount() {
    shaka.polyfill.installAll();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { video, src, streams, disablePreload } = nextProps;
    this.loadVideo(video, src, streams, disablePreload, this.props.currentTime);
  }

  componentDidUpdate(prevProps, prevState) {
    const { video, src, streams, disablePreload, currentTime } = this.props;
    if (
      !disablePreload &&
      video &&
      this.state.src &&
      this.state.src !== prevState.src
    ) {
      video.load();
    }
    if (this.state.isStreamUriExpired !== prevState.isStreamUriExpired) {
      this.setStreamUri(undefined);
      this.loadVideo(video, src, streams, disablePreload, currentTime);
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.destroy();
    }
  }

  getStreamUri(streams, protocol) {
    const stream = find(streams, { protocol });
    return get(stream, 'uri');
  }

  loadVideo = (video, src, streams, disablePreload, startTime) => {
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
          .registerRequestFilter(function (type, request) {
            if (type === shaka.net.NetworkingEngine.RequestType.MANIFEST) {
              request.allowCrossSiteCredentials = true;
            }
          });
      }
      if (disablePreload) {
        video.onplay = () => {
          video.onplay = null;
          this.player
            .load(streamUri, startTime)
            .then(() => {
              video.play();
              return;
            })
            .catch((err) => {
              console.log('error loading video with shaka player', err);
            });
        };
      } else {
        this.player.load(streamUri, startTime).catch((err) => {
          console.log('error loading video with shaka player', err);
        });
      }
      this.setStreamUri(streamUri);
      this.player.addEventListener('error', (error) => {
        if (error.detail.code === 1001) {
          this.setState({
            isStreamUriExpired: true,
          });
        }
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
  setStreamUri(streamUri) {
    this.setState({
      streamUri,
    });
  }
  render() {
    return this.state.src && <source src={this.state.src} />;
  }
}
