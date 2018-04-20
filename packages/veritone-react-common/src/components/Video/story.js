import React from 'react';
import { storiesOf } from '@storybook/react';

import video from './';

storiesOf('video', module).add('Base', () => (
  <video.Player src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
));
