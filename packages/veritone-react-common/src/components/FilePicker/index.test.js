import React from 'react';
import { mount } from 'enzyme';

import FilePicker from './';
import FileUploader from './FileUploader';

describe('FilePicker', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(<FilePicker />);
    });

    it('renders without crashing', () => {
        expect(wrapper).toBeDefined();
    });

    it('has tab bar with two tabs', () => {
        const tabsBar = wrapper.find('Tabs');
        expect(tabsBar.find('Tab').length).toEqual(2);
    })
});

describe('FileUploader', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(<FileUploader />);
    });

    it('renders without crashing', () => {
        expect(wrapper).toBeDefined();
    });

    it('should contain a "CHOOSE FILE" button when a file has not been selected', () => {
        const chooseFileButton = wrapper.find('Button');
        expect(chooseFileButton.length).toEqual(1);
        expect(chooseFileButton.text()).toBe('Choose File');
    });
})