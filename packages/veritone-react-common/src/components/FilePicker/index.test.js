import React, { Component } from 'react';
import { mount } from 'enzyme';

import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';

import FilePicker from './';
import FileUploader from './FileUploader';
import FilePickerHeader from './FilePickerHeader/FilePickerHeader';
import FilePickerFooter from './FilePickerFooter/FilePickerFooter';


describe('FilePickerHeader', () => {
    let wrapper, onSelectTab, onCloseModal;
    beforeEach(() => {
        onSelectTab = jest.fn();
        onCloseModal = jest.fn();
        wrapper = mount(<FilePickerHeader selectedTab="upload" 
                                          onSelectTab={onSelectTab}
                                          onCloseModal={onCloseModal}/>);
    })

    it('should have a title of "File Picker"', () => {
        const filePickerTitle = wrapper.find('.filePickerTitle');
        expect(filePickerTitle.exists()).toEqual(true);
        expect(filePickerTitle.text() === "File Picker");
    });

    it('should have a Tabs bar with two tabs', () => {
        const tabsBar = wrapper.find(Tabs);
        expect(tabsBar.exists);
        expect(tabsBar.find(Tab)).toHaveLength(2);
    });

    it('onSelectTab should be called when a tab is clicked', () => {
        const urlUploadTab = wrapper.find(Tab).at(1);
        urlUploadTab.simulate('click');
        expect(onSelectTab).toHaveBeenCalled();
    });

    it('should have a close "x" button', () => {
        const xButton = wrapper.find(".icon-close-exit");
        expect(xButton.exists()).toEqual(true);
    });

    it('onCloseModal should be called when the close button is clicked', () => {
        const xButton = wrapper.find(".icon-close-exit");
        xButton.simulate('click');
        expect(onCloseModal).toHaveBeenCalled();
    });
})

describe('FilePickerFooter', () => {
    let wrapper, onCloseModal;
    beforeEach(() => {
        onCloseModal = jest.fn();
        wrapper = mount(<FilePickerFooter />);
    })

    it('should have an "Upload" button', () => {
        const uploadButton = wrapper.find(Button);
    })
})