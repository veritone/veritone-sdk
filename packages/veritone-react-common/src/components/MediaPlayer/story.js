import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import { find, findIndex } from 'lodash';
import faker from 'faker';
import 'video-react/dist/video-react.css';

import { guid } from '../../helpers/guid';

import MediaPlayerComponent from './';

function randomPolyBox() {
  const rand = faker.random.number;
  const options = { min: 0, max: 1, precision: 0.0001 };

  return Array(4)
    .fill()
    .map(() => ({
      x: rand(options),
      y: rand(options)
    }));
}

const timeSeries = [
  {
    startTimeMs: 0,
    object: {
      id: guid(),
      overlayObjectType: 'a',
      boundingPoly: randomPolyBox()
    },
    stopTimeMs: 5000
  },
  {
    startTimeMs: 2000,
    object: {
      id: guid(),
      overlayObjectType: 'a',
      boundingPoly: randomPolyBox()
    },
    stopTimeMs: 8000
  },
  {
    startTimeMs: 8000,
    object: {
      id: guid(),
      overlayObjectType: 'b',
      boundingPoly: randomPolyBox()
    },
    stopTimeMs: 12000
  },
  {
    startTimeMs: 9000,
    object: {
      id: guid(),
      overlayObjectType: 'c',
      boundingPoly: randomPolyBox()
    },
    stopTimeMs: 14000
  },
  {
    startTimeMs: 10000,
    object: {
      id: guid(),
      overlayObjectType: 'a',
      boundingPoly: randomPolyBox()
    },
    stopTimeMs: 14000
  },
  {
    startTimeMs: 17000,
    object: {
      id: guid(),
      overlayObjectType: 'c',
      boundingPoly: randomPolyBox()
    },
    stopTimeMs: 19000
  },
  {
    startTimeMs: 20000,
    object: {
      id: guid(),
      overlayObjectType: 'b',
      boundingPoly: randomPolyBox()
    },
    stopTimeMs: 25000
  },
  {
    startTimeMs: 21000,
    object: {
      id: guid(),
      overlayObjectType: 'b',
      boundingPoly: randomPolyBox()
    },
    stopTimeMs: 24000
  },
  {
    startTimeMs: 21000,
    object: {
      id: guid(),
      overlayObjectType: 'a',
      boundingPoly: randomPolyBox()
    },
    stopTimeMs: 25000
  },
  {
    startTimeMs: 25000,
    object: {
      id: guid(),
      overlayObjectType: 'c',
      boundingPoly: randomPolyBox()
    },
    stopTimeMs: 30000
  },
  {
    startTimeMs: 28000,
    object: {
      id: guid(),
      overlayObjectType: 'a',
      boundingPoly: randomPolyBox()
    },
    stopTimeMs: 30000
  }
];

const multipleStreams = [
  {
    protocol: 'dash',
    uri:
      'http://yt-dash-mse-test.commondatastorage.googleapis.com/media/car-20120827-manifest.mpd'
  },
  {
    protocol: 'hls',
    uri:
      'http://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8'
  }
];
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
const alternateDemoMp4 =
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
const demoMp3 = 'https://www.sample-videos.com/audio/mp3/wave.mp3';
const demoPosterImage =
  '//static.veritone.com/veritone-ui/default-nullstate.svg';

const stylesByObjectType = {
  a: {
    backgroundColor: 'rgba(40, 95, 255, 0.5)'
  },
  b: {
    backgroundColor: 'rgba(80, 185, 60, 0.5)'
  },
  c: {
    backgroundColor: 'rgba(255, 140, 40, 0.5)'
  }
};

storiesOf('MediaPlayer', module)
  .add('MP4 (fluid width)', () => (
    <MediaPlayerComponent
      src={demoMp4}
      autoPlay
      readOnly
      useOverlayControlBar
      fluid />
  ));