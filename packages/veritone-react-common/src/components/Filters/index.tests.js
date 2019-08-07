import React from 'react';
import { noop } from 'lodash';
import { shallow } from 'enzyme';
import LooksOne from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Header from './header/Header';
import SectionTree from './SectionTree';
import Filters from './';

const testSectionTree = {
  children: [
    {
      label: 'Section 1',
      icon: <LooksOne />,
      type: 'display-count',
      children: [{ formComponentId: 'select-station-form' }]
    },
    {
      label: 'Section 2',
      type: 'display-count',
      valueArray: ['cat', 'dog', 'hamster'],
      children: [{ formComponentId: 'default-checkboxes-1' }]
    },
    {
      label: 'Section 3',
      valueArray: [1, 2, 3],
      children: [{ formComponentId: 'default-checkboxes-2' }]
    }
  ]
};

const defaultProps = {
  formComponents: {},
  selectedFilters: [],
  checkboxCount: {},
  onClick: noop,
  closeFilter: noop,
  onCheckboxChange: noop,
  filtersSections: testSectionTree
};

describe('Filters', function() {
  it('Should render a Header', function() {
    const wrapper = shallow(<Filters {...defaultProps} />);

    expect(wrapper.find(Header)).toHaveLength(1);
  });

  it('Should render a rightIconButton into the header', function() {
    const wrapper = shallow(
      <Filters {...defaultProps} rightIconButtonElement={<IconButton />} />
    );

    expect(
      wrapper
        .find(Header)
        .dive()
        .find(IconButton)
    ).toHaveLength(1);
  });

  it('Should close filters when rightIconButton clicked', function() {
    const handler = jest.fn();
    const wrapper = shallow(
      <Filters {...defaultProps} closeFilter={handler} />
    );

    wrapper
      .find(Header)
      .dive()
      .find(IconButton)
      .simulate('click');

    expect(handler).toHaveBeenCalled();
  });

  it('Should display SectionTree component when it is rendered', function() {
    const wrapper = shallow(<Filters {...defaultProps} />);

    expect(wrapper.find(SectionTree)).toHaveLength(1);
  });
  it('Apply Filter button should be clickable', function() {
    const handler = jest.fn();
    const wrapper = shallow(<Filters {...defaultProps} onClick={handler} />);

    const event = {
      target: {
        getAttribute: () => JSON.stringify([{ a: 1 }])
      }
    };

    wrapper.find(Button).simulate('click', event);
    expect(handler).toHaveBeenCalled();
  });
});
