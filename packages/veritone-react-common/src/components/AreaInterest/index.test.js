import React from 'react';
import { mount } from 'enzyme';

import { AreaInterest } from './';
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import FilterCenterFocus from "@material-ui/icons/FilterCenterFocus";
import Delete from "@material-ui/icons/Delete";


describe('RecognizedTextSearchModal', () => {
    const defaultAoI = {
        id: "test id",
        boundingPoly: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 }
        ]
    }
    const onEditAoI = jest.fn();
    const onRemoveAoI = jest.fn();
    it('Should render with the default value filled in', () => {
        const wrapper = mount(<AreaInterest areaOfInterest={defaultAoI} onEditAoI={onEditAoI} onRemoveAoI={onRemoveAoI} />);
        expect(wrapper.find('IconButton').exists()).toBeTruthy();
        console.log(wrapper);
    });
});