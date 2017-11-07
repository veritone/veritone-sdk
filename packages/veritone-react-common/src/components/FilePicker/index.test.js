import React from 'react';
import { mount } from 'enzyme';

import FilePicker from './';

describe('FilePicker', () => {
    it('renders without crashing', () => {
        const wrapper = mount(<FilePicker />);
    });

    it('has tab bar with two tabs', () => {
        const wrapper = mount(<FilePicker />);
        const tabsBar = wrapper.find('Tabs');
        expect(tabsBar.find('Tab').length).toEqual(2);
    })
});