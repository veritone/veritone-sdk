import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import '../src/styles/global.scss';
import {
  VSDKStyleWrapper,
  defaultVSDKTheme
} from '../src/helpers/withMuiThemeProvider';

const req = require.context('../src', true, /story.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}


const withStyles = story => (
  <VSDKStyleWrapper customTheme={defaultVSDKTheme}>{story()}</VSDKStyleWrapper>
);

addDecorator(withStyles);
addDecorator(withKnobs);
configure(loadStories, module);
