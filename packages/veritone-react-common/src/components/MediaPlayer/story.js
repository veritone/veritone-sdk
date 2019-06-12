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

const disabledShortcuts = {
  shortcuts: [
    {
      keyCode: 32, // spacebar
      handle: () => {}
    },
    {
      keyCode: 75, // k
      handle: () => {}
    },
    {
      keyCode: 70, // f
      handle: () => {}
    },
    {
      keyCode: 37, // Left arrow
      handle: () => {}
    },
    {
      keyCode: 74, // j
      handle: () => {}
    },
    {
      keyCode: 39, // Right arrow
      handle: () => {}
    },
    {
      keyCode: 76, // l
      handle: () => {}
    },
    {
      keyCode: 36, // Home
      handle: () => {}
    },
    {
      keyCode: 35, // End
      handle: () => {}
    },
    {
      keyCode: 38, // Up arrow
      handle: () => {}
    },
    {
      keyCode: 40, // Down arrow
      handle: () => {}
    },
    {
      keyCode: 190, // Shift + >
      shift: true,
      handle: () => {}
    },
    {
      keyCode: 188, // Shift + <
      shift: true,
      handle: () => {}
    }
  ]
};

const customShortcuts = {
  shortcuts: [
    {
      keyCode: 32, // spacebar
      handle: (player, actions) => {
        actions.toggleFullscreen(player);
      }
    }
  ]
};

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
  .add('Disable keyboard shortcuts', () => (
    <MediaPlayerComponent
      src={demoMp3}
      muted
      width={500}
      readOnly
      poster={demoPosterImage}
      useOverlayControlBar
      shortcutProps={disabledShortcuts}
    />
  ))
  .add('Custom keyboard shortcuts', () => (
    <MediaPlayerComponent
      src={demoMp3}
      muted
      width={500}
      readOnly
      poster={demoPosterImage}
      useOverlayControlBar
      shortcutProps={customShortcuts}
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
