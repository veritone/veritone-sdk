import r from 'regenerator-runtime/runtime';
window.regeneratorRuntime = r;

import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { handleImplicitRedirect } from 'veritone-oauth-helpers';

// handle OAuth implicit flow redirects in dev
if (window.name === '_auth' || window.parent.name === '_auth') {
  handleImplicitRedirect(window.parent.location.hash, window.parent.opener);
}

const req = require.context('../src', true, /story.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(withKnobs);
configure(loadStories, module);
