import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';


import r from 'regenerator-runtime/runtime';
window.regeneratorRuntime = r;

const req = require.context('../src', true, /story.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(withKnobs);
configure(loadStories, module);
