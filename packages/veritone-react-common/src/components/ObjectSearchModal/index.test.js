import React from 'react';
import { shallow } from 'enzyme';

import { ObjectSearchModal } from './index';

describe('ObjectSearchModal', () => {
  const logFilter = jest.fn();
  const cancel = jest.fn();
  const modalState = { queryResults: [], queryString: '', exclude: false };
  it('ObjectSearchModal: Should render with the default value filled in', () => {
    const wrapper = shallow(
      <ObjectSearchModal
        open={true}
        modalState={modalState}
        cancel={cancel}
        applyFilter={logFilter}
      />
    );

    expect(wrapper.find('SearchAutocomplete').exists());
    expect(wrapper.find('FormControlLabel').exists());
  });
});
