import React from 'react';
import { shallow } from 'enzyme';

import { LogoSearchModal } from './index';

describe('LogoSearchModal', () => {
  const logFilter = jest.fn();
  const cancel = jest.fn();
  const modalState = { queryResults: [], queryString: '', exclude: false };
  it('LogoSearchModal: Should render with the default value filled in', () => {
    const wrapper = shallow(
      <LogoSearchModal
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
