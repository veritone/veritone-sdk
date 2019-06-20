import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import FileUploader from '../../FilePicker/FileUploader';
import FileList from '../../FilePicker/FileList';
import FileProgressList from '../../FilePicker/FileProgressList';

import UploaderViewContainer from './';

import {
  allFormats,
  percentByFiles
} from './story';

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
    expect(wrapper.contains(FileUploader)).toBe(true);
    expect(wrapper.contains(FileList)).toBe(true);
    expect(wrapper.contains(FileProgressList)).toBe(true);
    // TODO: Needs better test cases...
  });
});