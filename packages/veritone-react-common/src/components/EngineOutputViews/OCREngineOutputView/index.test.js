import React from 'react';
import { mount } from 'enzyme';

import OCREngineOutputView from './';
import { ocrAssets } from '../story.data.js';

describe('OCREngineOutputView', () => {
  it('should have a header', () => {
    const wrapper = mount(
      <OCREngineOutputView
        assets={ ocrAssets }
      />
    );

    expect(wrapper.find('.ocrViewHeader')).toHaveLength(1);
  });

  it('should have a content area', () => {
    const wrapper = mount(
      <OCREngineOutputView
        assets={ ocrAssets }
      />
    );

    expect(wrapper.find('.ocrContent')).toHaveLength(1);
  });

  it('should display a list of ocr objects', () => {
    const wrapper = mount(
      <OCREngineOutputView
        assets={ ocrAssets }
      />
    );

    expect(wrapper.find('.ocrContainer')).toHaveLength(ocrAssets[0].series.length);
  });
});