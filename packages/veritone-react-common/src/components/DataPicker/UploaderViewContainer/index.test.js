import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import FileUploader from '../../FilePicker/FileUploader';
import ExtensionPanel from '../../FilePicker/FileUploader/ExtensionPanel';
import FileList from '../../FilePicker/FileList';
import FileProgressList from '../../FilePicker/FileProgressList';
import FilePickerHeader from '../../FilePicker/FilePickerHeader';
import FilePickerFooter from '../../FilePicker/FilePickerFooter';

import {
  allFormats,
  percentByFiles
} from './story';

import UploaderViewContainer from './';

describe('UploaderViewContainer', () => {
  it('Initial/Selecting state renders properly', () => {
    const wrapper = mount(
      <UploaderViewContainer
        accept={allFormats}
        uploadPickerState={'selecting'}
        uploadedFiles={[]}
        onFilesSelected={noop}
        handleAbort={noop}
        onReject={noop}
        onCancel={noop}
        onDeleteFile={noop}
        onUpload={noop}
        percentByFiles={[]}
      />
    );
    expect(wrapper.exists(FileUploader)).toBe(true);
    expect(wrapper.exists(FileList)).toBe(false);
    expect(wrapper.exists(FileProgressList)).toBe(false);
    expect(wrapper.exists(ExtensionPanel)).toBe(false);
    
    wrapper.find('[data-veritone-element="uploader-extension-open-btn"]')
      .hostNodes()
      .simulate('click');
    expect(wrapper.exists(ExtensionPanel)).toBe(true);
    const extCategories = wrapper.find('[data-veritone-element="extension-list-category"]').hostNodes();
    expect(extCategories.length).toBe(4);
    extCategories.forEach(cat => {
      expect(wrapper.find('[data-veritone-element="extension-list-item"]')
      .hostNodes()
      .length)
      .toBeGreaterThan(1)
    });
  });

  it('Uploading renders properly', () => {
    const wrapper = mount(
      <UploaderViewContainer
        accept={allFormats}
        uploadPickerState={'uploading'}
        uploadedFiles={[]}
        onFilesSelected={noop}
        handleAbort={noop}
        onReject={noop}
        onCancel={noop}
        onDeleteFile={noop}
        onUpload={noop}
        multiple
        percentByFiles={percentByFiles}
      />
    );

    expect(wrapper.exists(FilePickerHeader)).toBe(true);
    expect(wrapper.find(FilePickerHeader).text()).toBe('Uploading');
    expect(wrapper.exists(FileProgressList)).toBe(true);
    expect(wrapper.exists('[data-veritone-element="picker-header-close-btn"]')).toBe(false);
    expect(wrapper.exists('[data-veritone-element="picker-header-msg"]')).toBe(false);
    percentByFiles.forEach(file => {
      expect(wrapper.exists(`[data-test-target="${file.key}"]`)).toBe(true);
    });
    expect(wrapper.exists(FilePickerFooter)).toBe(true);
  });

  it('Error state renders properly', () => {
    const errorMsg = 'Fake error msg';
    const wrapper = mount(
      <UploaderViewContainer
        accept={allFormats}
        uploadPickerState={'complete'}
        uploadError
        uploadStatusMsg={errorMsg}
        onFilesSelected={noop}
        handleAbort={noop}
        onReject={noop}
        onCancel={noop}
        onDeleteFile={noop}
        onUpload={noop}
        multiple
        percentByFiles={percentByFiles}
      />
    );

    expect(wrapper.exists(FilePickerHeader)).toBe(true);
    expect(wrapper.exists(FileProgressList)).toBe(true);
    expect(wrapper.exists('[data-veritone-element="picker-header-close-btn"]')).toBe(false);
    expect(wrapper.exists('[data-veritone-element="picker-header-msg"]')).toBe(true);
    expect(wrapper.find('[data-veritone-element="picker-header-title"]').text()).toBe('Upload failure');
    expect(wrapper.find('[data-veritone-element="picker-header-msg"]').text()).toBe(errorMsg);

    percentByFiles.forEach(file => {
      expect(wrapper.exists(`[data-test-target="${file.key}"]`)).toBe(!!file.value.error);
    });

    expect(wrapper.exists('[data-veritone-element="picker-retry-controls"]')).toBe(true);
  });
});