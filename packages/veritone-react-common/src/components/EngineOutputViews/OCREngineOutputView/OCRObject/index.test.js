import React from 'react';
import { mount } from 'enzyme';

describe('OCRObject', () => {
  it('should display the text of the ocr', () => {
    const objectClicked = jest.fn();
    const wrapper = mount(
      <OCRObject
        text="TEST OCR OBJECT TEXT"
        startTime={1000}
        endTime={2000}
        onOcrObjectClick={objectClicked}
      />
    );
  });
});