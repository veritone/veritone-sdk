import r from 'regenerator-runtime/runtime';
window.regeneratorRuntime = r;

import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

// handle OAuth implicit flow redirects in dev
if (window.parent.name === '_auth') {
  const hash = window.parent.location.hash;
  let OAuthToken, error;

  try {
    OAuthToken = hash.match(/access_token=(.+)$/)[1].split('&')[0];
  } catch (e) {
    /**/
  }

  if (!OAuthToken) {
    try {
      error = hash.match(/error=(.+)$/)[1].split('&')[0];
    } catch (e) {
      /**/
    }
  }

  window.parent.opener.postMessage(
    {
      OAuthToken,
      error
    },
    window.origin
  );
}

const req = require.context('../src', true, /story.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(withKnobs);
configure(loadStories, module);
