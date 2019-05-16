import React from 'react';
import { arrayOf, shape, string, func } from 'prop-types';
import { includes } from 'lodash';
import shaka from 'shaka-player';

const supportedProtocols = ['dash', 'hls'];

const getStreams = (streams) => streams
  .reduce((streamObject, { protocol, uri }) => ({
    ...streamObject,
    [protocol]: uri
  }), {});

const getStreamUri = (streams, protocols) => {
  const availableProtocol = protocols.find(protocol => streams[protocol]);
  return availableProtocol && streams[availableProtocol];
};

const shouldLoad = (value, prevValue) => (value !== prevValue);

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
  };

  static defaultProps = {
    streams: []
  }

  state = {
    src: undefined,
    streamUri: undefined,
    hlsUri: undefined,
  }

  static getDerivedStateFromProps({ src, streams, video }) {
    return {
      src: video ? src : undefined,
      streamUri: video ? getStreamUri(
        getStreams(streams),
        supportedProtocols
      ) : undefined,
      hlsUri: (
        video && video.canPlayType('application/vnd.apple.mpegurl')
      ) ? (
        getStreamUri(getStreams(streams), supportedProtocols).hls
      ) : undefined
    }
  }

  componentDidMount() {
    shaka.polyfill.installAll();
    const { video } = this.props;
    if (shaka.Player.isBrowserSupported() && video && this.state.streamUri) {
      this.player = new shaka.Player(video);
      this.loadStreams();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.player) {
      this.loadStreams(prevProps);
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.unload().then(() => this.player = null );
    }
  }

  loadStreams = (prevProps = {}) => {
    const { streams } = this.props;
    const { streams: prevStreams = [] } = prevProps;

    const streamUri = getStreamUri(getStreams(streams), supportedProtocols);
    const prevStreamUri = getStreamUri(
      getStreams(prevStreams), supportedProtocols);

    if (!streamUri && prevStreamUri) {
      this.unloadStream();
    }

    if (includes(streamUri, 'veritone.com/media-streamer/stream')) {
      this.player
        .getNetworkingEngine()
        .registerRequestFilter((type, request) => {
          if (type === shaka.net.NetworkingEngine.RequestType.MANIFEST) {
            request.allowCrossSiteCredentials = true;
            request['Authorization'] = `Bearer ${
              localStorage.getItem('OAuthToken')
            }}`;
          };
        });
    }

    if (shouldLoad(streamUri, prevStreamUri)) {
      return this.player.load(streamUri).catch(() => this.unloadStream());
    }
  }

  render() {
    return (!this.player &&
      <source src={this.state.streamUri || this.state.src} />
    );
  }
}
