import React, { Component } from 'react';
import { mount } from 'enzyme';

import FileList from './FileList';
import FileListItem, { formatBytes } from './FileListItem';

let createMockFile = (name, size, mimeType) => {
    name = name || 'mock.txt';
    size = size || 1024;
    mimeType = mimeType || 'plain/txt';

    const range = (count) => {
        var output = '';
        for (var i = 0; i < count; i++) {
            output += 'a';
        }
        return output;
    }

    let blob = new Blob([range(size)], { type: mimeType });
    blob.lastModifiedDate = new Date();
    blob.name = name;

    return blob;
};

const mockFiles = [
    createMockFile('_89716241_thinkstockphotos-523060154.jpg', 1024, 'image/jpeg'),
    createMockFile('funny_picture.jpg', 2048, 'image/jpeg'),
    createMockFile('photo.jpeg', 12398, 'image/jpeg')
];

describe('FileList', () => {
    it('should render a list of files if an array of files are passed to it', () => {
        let wrapper = mount(<FileList files={mockFiles}/>);
        expect(wrapper.find(FileListItem).length).toEqual(mockFiles.length);
    });
});

describe('FileListItem', () => {
    it('should display the file name', () => {
        let wrapper = mount(<FileListItem file={mockFiles[0]} />);
        expect(wrapper.find('.fileListItemNameText').text()).toEqual(mockFiles[0].name);
    });

    it('should display the size of the file', () => {
        let wrapper = mount(<FileListItem file={mockFiles[0]} />);
        expect(wrapper.find('.fileListItemFileSizeText').text()).toEqual(formatBytes(mockFiles[0].size));
    });

    it('should display a remove button', () => {
        let wrapper = mount(<FileListItem file={mockFiles[0]} />);
        expect(wrapper.find('button').exists()).toEqual(true);
    });

    it('handleRemoveFile should be called when the remove button is clicked', () => {
        const spy = jest.spyOn(FileListItem.prototype, 'handleRemoveFile');
        const onRemoveFile = jest.fn();
        let removeButton = mount(<FileListItem file={mockFiles[0]} onRemoveFile={onRemoveFile}/>).find('button');
        removeButton.simulate('click');
        expect(spy).toHaveBeenCalled();
    });
});