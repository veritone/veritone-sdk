import React from 'react';
import { mount } from 'enzyme';
import FilePicker from './';

describe('FilePicker', () => {
  let onClose = jest.fn();
  let onUploadFiles = jest.fn();
  let filePickerComponent = mount(
    <FilePicker onUploadFiles={onUploadFiles} onRequestClose={onClose} />
  );

  it('should have a header', () => {
    expect(filePickerComponent.find('FilePickerHeader')).toHaveLength(1);
  });

  it('should have a footer', () => {
    expect(filePickerComponent.find('FilePickerFooter')).toHaveLength(1);
  });

  it('should have a body', () => {
    expect(filePickerComponent.find('.filePickerBody')).toHaveLength(1);
  });
});
