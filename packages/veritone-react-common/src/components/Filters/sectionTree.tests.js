import React from 'react';
import { shallow } from 'enzyme';
import LooksOne from '@material-ui/icons/LooksOne';
import { noop } from 'lodash';

import SectionTree, { SectionTreeTab } from './SectionTree';

describe('SectionTree', function() {
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
    sections: testSectionTree,
    formComponents: {
      'select-station-form': <div>select station form</div>
    },
    checkboxCount: {
      'select-station-form': 3,
      'default-checkboxes-1': 9
    },
    onCheckboxChange: noop
  };
  const wrapper = shallow(<SectionTree {...defaultProps} />);

  it('should render SectionTreeTabs for the root children by default', function() {
    expect(
      wrapper.containsAllMatchingElements([
        /* eslint-disable react/jsx-key */
        <SectionTreeTab label="Section 1" />,
        <SectionTreeTab label="Section 2" />,
        <SectionTreeTab label="Section 3" />
      ])
    ).toBeTruthy();
  });

  it('should convert valueArray into checkbox list when formComponentId contains default-checkboxes', function() {
    expect(
      wrapper.containsAllMatchingElements([
        <SectionTreeTab checkboxValues={['cat', 'dog', 'hamster']} />,
        <SectionTreeTab checkboxValues={[1, 2, 3]} />
      ])
    ).toBeTruthy();
  });

  it('should display numbers when checkboxCount is provided with values and type is display-count', function() {
    expect(
      wrapper.containsAllMatchingElements([
        <SectionTreeTab
          formComponentIdAtLeaf="select-station-form"
          checkboxCount={{
            'select-station-form': 3,
            'default-checkboxes-1': 9
          }}
        />,
        <SectionTreeTab
          formComponentIdAtLeaf="default-checkboxes-1"
          checkboxCount={{
            'select-station-form': 3,
            'default-checkboxes-1': 9
          }}
        />
      ])
    ).toBeTruthy();
  });
});

describe('SectionTreeTab', function() {
  const defaultProps = {
    label: 'test-label',
    icon: <LooksOne />,
    type: 'display-count',
    checkboxCount: {
      'select-station-form': 3,
      'default-checkboxes-1': 9
    },
    checkboxValues: [1, 2, 3],
    formComponentIdAtLeaf: 'select-station-form',
    formComponents: {
      'select-station-form': <div>Some form</div>
    }
  };

  it('show props.label', function() {
    const wrapper = shallow(
      <SectionTreeTab {...defaultProps} label="test-label" />
    );
    expect(
      wrapper
        .find('span')
        .filterWhere(node => node.props().data === 'test-label')
    ).toHaveLength(1);
  });

  it('show props.icon', function() {
    const wrapper = shallow(
      <SectionTreeTab {...defaultProps} icon={<div id="test-icon" />} />
    );
    expect(
      wrapper.containsMatchingElement(<div id="test-icon" />)
    ).toBeTruthy();
  });

  it('if type is not specified as display-count, do not show checkboxCount', function() {
    const wrapper = shallow(<SectionTreeTab {...defaultProps} type="" />);
    expect(
      wrapper
        .find('span')
        .filterWhere(node => node.props().data === 'test-count')
    ).toHaveLength(0);
  });

  it('do now show checkboxCount if checkboxCount object properties are numbers', function() {
    const wrapper = shallow(<SectionTreeTab {...defaultProps} />);

    expect(
      wrapper.findWhere(node => node.props().data === 'test-count')
    ).toHaveLength(1);
  });

  it('display either DefaultCheckboxes or custom component', function() {
    const wrapper = shallow(
      <SectionTreeTab
        {...defaultProps}
        formComponentIdAtLeaf="default-checkboxes-1"
      />
    );

    expect(wrapper.find('DefaultCheckboxes')).toHaveLength(1);
  });
});
