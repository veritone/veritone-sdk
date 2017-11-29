import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import FilePicker from './';

// I believe the Dialog library uses react portals which aren't supported by
// enzyme and the momment according to this
// https://github.com/airbnb/enzyme/blob/master/docs/common-issues.md
// will look into other ways of testing.
// Not sure if this is the best way to test this but it is better than nothing
// I suppose.

// fixme-- dialog as outer component
describe('FilePicker', () => {
  let onClose = jest.fn();
  let onUploadFiles = jest.fn();
  let filePickerComponent = ReactTestUtils.renderIntoDocument(
    <FilePicker isOpen onUploadFiles={onUploadFiles} onCloseModal={onClose} />
  );

  it('should have a header', () => {
    ReactTestUtils.findRenderedComponentWithType(
      filePickerComponent,
      FilePicker
    );

    let filePickerHeader = document.body.getElementsByClassName(
      'filePickerHeader'
    );
    expect(filePickerHeader.length).toEqual(1);
  });

  it('should have a footer', () => {
    ReactTestUtils.findRenderedComponentWithType(
      filePickerComponent,
      FilePicker
    );

    let filePickerFooter = document.body.getElementsByClassName(
      'filePickerFooter'
    );
    expect(filePickerFooter.length).toEqual(1);
  });

  it('should have a body', () => {
    ReactTestUtils.findRenderedComponentWithType(
      filePickerComponent,
      FilePicker
    );

    let filePickerBody = document.body.getElementsByClassName('filePickerBody');
    expect(filePickerBody.length).toEqual(1);
  });
});
