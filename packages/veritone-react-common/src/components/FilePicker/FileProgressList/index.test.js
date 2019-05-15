import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import AbortIcon from '@material-ui/icons/Delete';

import FileProgressList from './';

describe('FileProgressList', function() {
  const percentByFiles = [{
    key: 'audio_file.flac',
    value: {
      type: 'audio',
      percent: 10,
      size: 82356235
    }
  }, {
    key: 'video_file.mp4',
    value: {
      type: 'video',
      percent: 20,
      size: 23856925352
    }
  }, {
    key: 'image_file.png',
    value: {
      type: 'image',
      percent: 80,
      size: 38529
    }
  }, {
    key: 'text_file.txt',
    value: {
      type: 'text',
      percent: 90,
      size: 569182
    }
  }, {
    key: 'error_file.bin',
    value: {
      type: 'text',
      percent: 69,
      size: 56283756,
      error: 'error msg'
    }
  }];

  it('shows the progress list', function() {
    const wrapper = mount(
      <FileProgressList percentByFiles={percentByFiles} />
    );
    percentByFiles.forEach(file => {
      expect(wrapper.find(`[data-test-target="${file.key}"]`)).toHaveLength(1);
    });
    expect(wrapper.find(AbortIcon)).toHaveLength(0);
  });

  it('shows the progress list with abort buttons', function() {
    const wrapper = mount(
      <FileProgressList
        percentByFiles={percentByFiles}
        handleAbort={noop} />
    );
    expect(wrapper.find(AbortIcon)).toHaveLength(5);
  });

  it('shows errored files only', function() {
    const wrapper = mount(
      <FileProgressList
        percentByFiles={percentByFiles}
        showErrors />
    );
    percentByFiles.forEach(file => {
      if (file.value.error) {
        expect(wrapper.find(`[data-test-target="${file.key}"]`)).toHaveLength(1);
      } else {
        expect(wrapper.find(`[data-test-target="${file.key}"]`)).toHaveLength(0);
      }
    });
  });

});
