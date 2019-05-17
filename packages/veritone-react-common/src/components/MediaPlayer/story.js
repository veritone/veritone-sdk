import React from 'react';
import { storiesOf } from '@storybook/react';
import 'video-react/dist/video-react.css';

import MediaPlayerComponent from './';

const hlsStream = [
  {
    protocol: 'hls',
    uri:
      'http://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8'
  }
];
const dashStream = [
  {
    protocol: 'dash',
    uri:
      'http://yt-dash-mse-test.commondatastorage.googleapis.com/media/car-20120827-manifest.mpd'
  }
];
const demoMp4 = 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4';
const demoMp3 = 'https://www.sample-videos.com/audio/mp3/wave.mp3';
const demoPosterImage =
  '//static.veritone.com/veritone-ui/default-nullstate.svg';

storiesOf('MediaPlayer', module)
  .add('MP4 (fluid width)', () => (
    <MediaPlayerComponent
      muted
      autoPlay
      src={demoMp4}
      readOnly
      fluid
      useOverlayControlBar
    />
  ))
  .add('DASH, no preload, minimal controls', () => (
    <MediaPlayerComponent
      muted
      src={demoMp4}
      streams={dashStream}
      readOnly
      fluid
      useOverlayControlBar
      poster={demoPosterImage}
      preload={'none'}
      btnRestart={false}
      btnReplay={false}
      btnForward={false}
      autoHide
      autoHideTime={1000}
    />
  ))
  .add('DASH, autoplay', () => (
    <MediaPlayerComponent
      muted
      autoPlay
      streams={dashStream}
      readOnly
      fluid
      useOverlayControlBar
    />
  ))
  .add('DASH (fixed width, pillarboxed)', () => (
    <MediaPlayerComponent
      muted
      autoPlay
      streams={dashStream}
      width={800}
      height={300}
      readOnly
      useOverlayControlBar
    />
  ))
  .add('HLS', () => (
    <MediaPlayerComponent
      muted
      autoPlay
      streams={hlsStream}
      width={500}
      readOnly
      useOverlayControlBar
    />
  ))
  .add('Audio Only', () => (
    <MediaPlayerComponent
      src={demoMp3}
      muted
      width={500}
      readOnly
      poster={demoPosterImage}
      useOverlayControlBar
    />
  ));
