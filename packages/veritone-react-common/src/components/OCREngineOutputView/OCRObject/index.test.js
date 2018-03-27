import React from 'react';
import { mount } from 'enzyme';

import OCRObject from './';

describe('OCRObject', () => {
  it('should display the text of the ocr', () => {
    const wrapper = mount(
      <OCRObject text="TEST OCR OBJECT TEXT" startTime={1000} endTime={2000} />
    );

    expect(wrapper.find('.ocrText').text()).toMatch(/TEST OCR OBJECT TEXT/);
  });

  it('should display the duration of the ocr', () => {
    const wrapper = mount(
      <OCRObject text="TEST OCR OBJECT TEXT" startTime={1000} endTime={2000} />
    );

    expect(wrapper.find('.ocrObjectTimestamp').text()).toMatch(/00:01 - 00:02/);
  });

  it('should call onOcrObjectClicked when clicked', () => {
    const objectClicked = jest.fn();
    const wrapper = mount(
      <OCRObject
        text="TEST OCR OBJECT TEXT"
        startTime={1000}
        endTime={2000}
        onOcrClicked={objectClicked}
      />
    );

    wrapper.simulate('click');
    expect(objectClicked).toHaveBeenCalled();
  });
});
