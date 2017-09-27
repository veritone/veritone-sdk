import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const req = require.context('../components', true, /story.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

addDecorator(story => (
  <MuiThemeProvider>
    {story()}
  </MuiThemeProvider>
));

configure(loadStories, module);