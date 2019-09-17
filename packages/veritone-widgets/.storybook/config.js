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

function withPendo(story) {
  console.log("Adding pendo");

  (function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=[];
      v=['initialize','identify','updateOptions','pageLoad'];for(w=0,x=v.length;w<x;++w)(function(m){
      o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
      y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
      z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');

    // Call this whenever information about your visitors becomes available
    // Please use Strings, Numbers, or Bools for value types.
    pendo.initialize({
      visitor: {
        id:              'TEST-ID'   // Required if user is logged in
        // email:        // Optional
        // role:         // Optional

        // You can add any additional visitor level key-values here,
        // as long as it's not one of the above reserved names.
      },

      account: {
        id:           'TEST-ID' // Highly recommended
        // name:         // Optional
        // planLevel:    // Optional
        // planPrice:    // Optional
        // creationDate: // Optional

        // You can add any additional account level key-values here,
        // as long as it's not one of the above reserved names.
      }
    });
  })('cefc4ec9-0826-4b42-7b3e-9b3538e741d0');

  return (
    <div>
      { story() }
    </div>
  );
}

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(withPendo);
addDecorator(withKnobs);
configure(loadStories, module);
