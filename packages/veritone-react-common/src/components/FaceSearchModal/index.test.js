import React from 'react';
import { shallow } from 'enzyme';

import { FaceSearchModal } from './index';

describe('FaceSearchModal', () => {
  const logFilter = jest.fn();
  const cancel = jest.fn();
  const modalState = { queryResults: [], queryString: '', exclude: false };
  it('FaceSearchModal: Should render with the default value filled in', () => {
    const wrapper = shallow(
      <FaceSearchModal
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
