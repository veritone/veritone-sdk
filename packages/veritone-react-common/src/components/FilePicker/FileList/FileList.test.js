import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import { formatBytes } from '../../../helpers/format.js';

import FileListItem from './FileListItem';
import FileList from './';

let createMockFile = (name, size, mimeType) => {
  let blobName = name || 'mock.txt';
  let blobSize = size || 1024;
  let blobMimeType = mimeType || 'plain/txt';

  const range = count => {
    let output = '';
    for (let i = 0; i < count; i++) {
      output += 'a';
    }
    return output;
  };

  let blob = new Blob([range(blobSize)], { type: blobMimeType });
  blob.lastModifiedDate = new Date();
  blob.name = blobName;

  return blob;
};

const mockFiles = [
  createMockFile(
    '_89716241_thinkstockphotos-523060154.jpg',
    1024,
    'image/jpeg'
  ),
  createMockFile('funny_picture.jpg', 2048, 'image/jpeg'),
  createMockFile('photo.jpeg', 12398, 'image/jpeg')
];

describe('FileList', () => {
  it('should render a list of files if an array of files are passed to it', () => {
    let wrapper = mount(<FileList files={mockFiles} onRemoveFile={noop} />);
    expect(wrapper.find(FileListItem).length).toEqual(mockFiles.length);
  });
});

describe('FileListItem', () => {
  it('should display the file name', () => {
    let wrapper = mount(
      <FileListItem file={mockFiles[0]} index={0} onRemoveFile={noop} />
    );
    expect(wrapper.find('[data-test="itemNameText"]').text()).toEqual(mockFiles[0].name);
  });

  it('should display the size of the file', () => {
    let wrapper = mount(
      <FileListItem file={mockFiles[0]} index={0} onRemoveFile={noop} />
    );
    expect(wrapper.find('[data-test="itemFileSizeText"]').text()).toEqual(
      formatBytes(mockFiles[0].size)
    );
  });

  it('should display a remove button', () => {
    let wrapper = mount(
      <FileListItem file={mockFiles[0]} index={0} onRemoveFile={noop} />
    );
    expect(wrapper.find('button').exists()).toEqual(true);
  });

  it('onRemoveFIle should be called when the remove button is clicked', () => {
    const onRemoveFile = jest.fn();
    let removeButton = mount(
      <FileListItem file={mockFiles[0]} onRemoveFile={onRemoveFile} index={0} />
    ).find('button');
    removeButton.simulate('click');
    // Should return index 0
    expect(onRemoveFile).lastCalledWith(0);
  });
});
