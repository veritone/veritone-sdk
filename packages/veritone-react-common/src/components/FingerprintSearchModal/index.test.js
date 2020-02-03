import React from 'react';
import { shallow } from 'enzyme';

import { FingerprintSearchModal } from './index';

describe('FingerprintSearchModal', () => {
  const logFilter = jest.fn();
  const cancel = jest.fn();
  const modalState = { queryResults: [], queryString: '', exclude: false };
  it('FingerprintSearchModal: Should render with the default value filled in', () => {
    const wrapper = shallow(
      <FingerprintSearchModal
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
