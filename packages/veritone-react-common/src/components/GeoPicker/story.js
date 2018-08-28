import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';

import GeoPicker from './';

const logLocation = data => console.log('Geolocation', data);
const gmapsAPIKey = 'AIzaSyDQyglufOtb_uzebFNkVWcB1D8-tBKZarQ';

storiesOf('GeoPicker', module).add('Select a radius based distance', () => {
  return (
    <div style={{ width: '900px', height: '500px' }}>
      <GeoPicker
        geoType="radius"
        onSelectGeolocation={logLocation}
        gmapsAPIKey={text('gmapsAPIKey', gmapsAPIKey)}
      />
    </div>
  );
});

storiesOf('GeoPicker', module).add('Select a single point ', () => {
  return (
    <div style={{ width: '900px', height: '500px' }}>
      <GeoPicker
        geoType="point"
        onSelectGeolocation={logLocation}
        gmapsAPIKey={text('gmapsAPIKey', gmapsAPIKey)}
      />
    </div>
  );
});

storiesOf('GeoPicker', module).add('Deserialize a single point ', () => {
  return (
    <div style={{ width: '900px', height: '500px' }}>
      <GeoPicker
        geoType="point"
        onSelectGeolocation={logLocation}
        location={{
          latitude: 33.6118,
          longitude: -117.9144
        }}
        gmapsAPIKey={text('gmapsAPIKey', gmapsAPIKey)}
      />
    </div>
  );
});

storiesOf('GeoPicker', module).add('Deserialize a radius ', () => {
  return (
    <div style={{ width: '900px', height: '500px' }}>
      <GeoPicker
        geoType="radius"
        onSelectGeolocation={logLocation}
        location={{
          latitude: 33.6118,
          longitude: -117.9144,
          distance: 1000,
          units: 'm'
        }}
        gmapsAPIKey={text('gmapsAPIKey', gmapsAPIKey)}
      />
    </div>
  );
});

storiesOf('GeoPicker', module).add('Display a read-only radius', () => {
  return (
    <div style={{ width: '900px', height: '500px' }}>
      <GeoPicker
        geoType="radius"
        location={{
          latitude: 33.6118,
          longitude: -117.9144,
          distance: 1000,
          units: 'm'
        }}
        readOnly
        gmapsAPIKey={text('gmapsAPIKey', gmapsAPIKey)}
      />
    </div>
  );
});

storiesOf('GeoPicker', module).add('Display a read-only point', () => {
  return (
    <div style={{ width: '900px', height: '500px' }}>
      <GeoPicker
        geoType="point"
        location={{
          latitude: 33.6118,
          longitude: -117.9144
        }}
        readOnly
        gmapsAPIKey={text('gmapsAPIKey', gmapsAPIKey)}
      />
    </div>
  );
});
