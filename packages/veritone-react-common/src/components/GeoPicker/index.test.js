import React from 'react';
import { mount } from 'enzyme';
import GeoPicker from './';

describe('GeoPicker', () => {
  const gmapsAPIKey = 'AIzaSyDQyglufOtb_uzebFNkVWcB1D8-tBKZarQ';

  let logLocation = jest.fn();
  let geoPickerComponent = mount(
    <GeoPicker
      geoType="point"
      onSelectGeolocation={logLocation}
      location={{
        latitude: 33.6118,
        longitude: -117.9144
      }}
      gmapsAPIKey={gmapsAPIKey}
    />
  );

  it('should render something', () => {
    expect(geoPickerComponent.children()).toHaveLength(1);
  });
});
