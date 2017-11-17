import React, { Component } from 'react';
import { mount } from 'enzyme';
import FilePickerFooter from './FilePickerFooter';
import Button from 'material-ui/Button';

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