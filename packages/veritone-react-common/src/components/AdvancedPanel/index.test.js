import React from 'react';
import { shallow} from 'enzyme';

import { AdvancedPanel } from './';

describe('Advanced Panel', () => {
    const handleClose = jest.fn();
    const handleReset = jest.fn();
    const advancedOptions = {};
    const onAddAdvancedSearchParams = jest.fn();
    const searchByTag = "search by tag mock";
    it('Advanced Search: Should render with the default value filled in', () => {
        const open = true;
        const wrapper = shallow(
            <AdvancedPanel
                open={open} 
                handleClose={handleClose}
                handleReset={handleReset}
                advancedOptions={advancedOptions}
                onAddAdvancedSearchParams={onAddAdvancedSearchParams}
                searchByTag={searchByTag}
            />
        );
        expect(wrapper.find('InfoOutlineIcon').exists()).toBeTruthy();
        // console.log(wrapper);
    });
});
