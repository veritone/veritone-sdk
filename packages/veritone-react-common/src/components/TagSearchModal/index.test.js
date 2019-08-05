import React from 'react';
import { shallow} from 'enzyme';

import { TagSearchModal } from './';

describe('TagSearchModal', () => {
    const logFilter = jest.fn();
    const cancel = jest.fn();
    const modalState = { queryResults: [], queryString: '', exclude: false }
    it('TagSearchModal: Should render with the default value filled in', () => {
        const wrapper = shallow(
            <TagSearchModal
                open={ true }
                modalState={ modalState }
                cancel={ cancel }
                applyFilter={ logFilter }
            />);

        expect(wrapper.find('SearchAutocompleteContainer').exists());
        expect(wrapper.find('FormControlLabel').exists());
       
    });
});
