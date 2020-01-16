import React from 'react';
import { mount } from 'enzyme';
import FilePicker from './';

describe('FilePicker', () => {
  let onClose = jest.fn();
  let onPickFiles = jest.fn();
  let filePickerComponent = mount(
    <FilePicker onPickFiles={onPickFiles} onRequestClose={onClose} />
  );

  it('should have a header', () => {
    expect(filePickerComponent.find('FilePickerHeader')).toHaveLength(1);
  });

  it('should have a footer', () => {
    expect(filePickerComponent.find('FilePickerFooter')).toHaveLength(1);
  });

  it('should have a body', () => {
    expect(filePickerComponent.find('[data-test="filePickerBody"]')).toHaveLength(1);
  });
});
