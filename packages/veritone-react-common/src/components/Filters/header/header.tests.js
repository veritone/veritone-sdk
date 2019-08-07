import React from 'react';
import Close from '@material-ui/icons/Close';
import { shallow } from 'enzyme';

import Header from './Header';

describe('FiltersHeader', function() {
  it('Should render FiltersHeader when it is imported', function() {
    const rightIconButtonElement = <Close />;
    const wrapper = shallow(
      <Header rightIconButtonElement={rightIconButtonElement} />
    );
    expect(wrapper.find('div')).toHaveLength(4);
  });
});
