import React from 'react';
import { mount } from 'enzyme';
import { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';

import FilePicker from './';
import FileUploader from './FileUploader';

describe('FilePicker', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(<FilePicker />);
    });

    it('has tab bar with two tabs', () => {
        expect(wrapper.find(Tab).length).toEqual(2);
    });

    describe('when "Upload" tab is clicked', () => {
        let uploadTab;
        beforeEach(() => {
            uploadTab = wrapper.find('Tab[label="Upload"]');
        })
        it('should display a FileUploader component', () => {
            uploadTab.simulate('click');
            expect(wrapper.find(FileUploader).length).toEqual(1);
        });
    });

    describe('when "By Url" tab is clicked', () => {
        let byUrlTab;
        beforeEach(() => {
            byUrlTab = wrapper.find('Tab[label="By URL"]');
        })
        it('should hide the FileUploader component', () => {
            byUrlTab.simulate('click');
            expect(wrapper.find(FileUploader).length).toEqual(0);
        });
    });
});

describe('FileUploader', () => {
    let wrapper;
    const sampleFiles = {
        0: {
            
        }
    };

    beforeEach(() => {
        wrapper = mount(<FileUploader />);
    });

    it('should contain a "CHOOSE FILE" button when a file has not been selected', () => {
        const chooseFileButton = wrapper.find(Button);
        expect(chooseFileButton.length).toEqual(1);
        expect(chooseFileButton.text()).toMatch(/choose file/i);
    });

    it('should contain a hidden file input', () => {
        const hiddenInput = wrapper.find('input[type="file"]');
        expect(hiddenInput.length).toEqual(1);
    });
})