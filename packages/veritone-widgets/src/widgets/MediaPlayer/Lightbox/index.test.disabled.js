// DISABLE THIS TEST FOR NOW BECAUSE IT IS PREVENTING PUBLISHES
// TODO: FIX THIS TEST
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import MediaPlayerLightbox from './MediaPlayerLightbox.js';

const customValue = { value: 'this is a test' };
const multipleStreams = [
  {
    protocol: 'dash',
    uri:
      'http://yt-dash-mse-test.commondatastorage.googleapis.com/media/car-20120827-manifest.mpd'
  },
  {
    protocol: 'hls',
    uri:
      'http://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8'
  }
];

describe('Media Player Lightbox Widget', () => {
  const handleOnClose = jest.fn();
  const handleOnBackdropClick = jest.fn();
  const handleOnCloseButtonClick = jest.fn();
  const mockStore = configureMockStore();
  const store = mockStore({
    player: {
      videoHeight: 200,
      videoWidth: 300,
      hasStarted: true,
      isActive: true
    }
  });

  const wrapper = mount(
    <Provider store={store}>
      <MediaPlayerLightbox
        open
        live
        fullscreen
        data={customValue}
        streams={multipleStreams}
        boundingPolySeries={[]}
        onClose={handleOnClose}
        onBackdropClick={handleOnBackdropClick}
        onCloseButtonClick={handleOnCloseButtonClick}
      />
    </Provider>
  );

  it('Missing Lightbox', () => {
    expect(wrapper.find('Lightbox')).toHaveLength(1);
  });

  it('Missing Lightbox Container', () => {
    expect(wrapper.find('div[data-test="popupContainer"]')).toHaveLength(1);
  });

  it('Missing Lighbox Close Button', () => {
    expect(wrapper.find('button[aria-label="Close"]')).toHaveLength(1);
  });

  it('Missing Controllers', () => {
    expect(wrapper.find('DefaultControlBar')).toHaveLength(1);
  });

  it('Missing Live Label', () => {
    const liveLabel = wrapper.find('div[data-test="liveLabel"]');
    expect(liveLabel).toHaveLength(1);
    expect(liveLabel.text()).toEqual('LIVE');
  });

  it('Missing Media Player', () => {
    expect(wrapper.find('MediaPlayerComponent').length).toBeGreaterThanOrEqual(1);
  });

  it('Mising Overlay Position Provider - MediaPlayer structure has changed and it may effect MediaPlayerLightbox', () => {
    expect(wrapper.find('OverlayPositioningProvider')).toHaveLength(1);
  });

  it('Mising Bounding Poly Overlay - MediaPlayer structure has changed and it may effect MediaPlayerLightbox', () => {
    expect(wrapper.find('Overlay')).toHaveLength(1);
  });

  it('Mising React Player - MediaPlayer structure has changed and it may effect MediaPlayerLightbox', () => {
    expect(wrapper.find('Player')).toHaveLength(1);
  });

  it('Missing reactPlayer class - it looks like bounding Poly layout has changed & it may cause caling problems in MediaPlayerLightbox', () => {
    expect(wrapper.find('Player').props()).toHaveProperty('className', expect.stringMatching('reactPlayer'));
  });
});
