import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import '../src/styles/global.scss';

const req = require.context('../src', true, /story.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(story => <MuiThemeProvider>{story()}</MuiThemeProvider>);
addDecorator(withKnobs);

configure(loadStories, module);
