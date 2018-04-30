import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';

import VideoSource from './VideoSource';
import MediaPlayer from './MediaPlayer';
import video from './';

const multipleStreams = [
  {
    protocol: 'dash',
    uri:
      'http://yt-dash-mse-test.commondatastorage.googleapis.com/media/car-20120827-manifest.mpd'
  },
  {
    protocol: 'hls',
    uri: 'http://local.veritone.com:9000/stream/400004518/master.m3u8'
  }
];
const hlsStream = [
  {
    protocol: 'hls',
    uri: 'http://local.veritone.com:9000/stream/400004518/master.m3u8'
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

storiesOf('Video', module).add('Base', () => (
  <video.Player autoPlay src={demoMp4} />
));

storiesOf('Video', module).add('Styled Media Player', () => (
  <MediaPlayer streams={multipleStreams} width={500} fluid={false} autoPlay />
));

storiesOf('Video', module).add('DASH', () => (
  <video.Player>
    <VideoSource isVideoChild autoPlay streams={dashStream} />
  </video.Player>
));

storiesOf('Video', module).add('HLS', () => (
  <video.Player>
    <VideoSource isVideoChild autoPlay streams={hlsStream} />
  </video.Player>
));

storiesOf('Video', module).add('Switch Source', () => {
  const label = 'Videos';
  const options = [demoMp4, alternateDemoMp4];
  const value = select(label, options, options[0]);

  return (
    <div>
      <video.Player autoPlay>
        <VideoSource isVideoChild src={value} />
      </video.Player>
    </div>
  );
});
