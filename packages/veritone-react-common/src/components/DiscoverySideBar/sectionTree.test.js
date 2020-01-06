import React from 'react';
import { noop } from 'lodash';
import { mount } from 'enzyme';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';

import SectionTree, { SectionTreeTab } from './SectionTree';

describe('SectionTree', function() {
  const testSectionTree = {
    children: [
      {
        label: 'Section 1',
        children: [
          {
            label: 'SubSection 1',
            children: [
              {
                label: 'Sub-SubSection 1',
                children: [{ formComponentId: 'test-form-Sub-SubSection-1' }]
              }
            ]
          },
          {
            label: 'SubSection 2',
            children: [{ formComponentId: 'test-form-SubSection-2' }]
          }
        ]
      },
      {
        label: 'Section 2',
        children: []
      }
    ]
  };

  const defaultProps = {
    sections: testSectionTree,
    formComponents: {
      'test-form-Sub-SubSection-1': <div id="Sub-SubSection-1" />,
      'test-form-SubSection-2': <div id="SubSection-2" />
    },
    activePath: [],
    onNavigate: noop
  };

  it('should render SectionTreeTabs for the root children by default', function() {
    const wrapper = mount(<SectionTree {...defaultProps} />);
    // console.log(wrapper.find('SectionTreeTab').debug())

    expect(
      wrapper.containsAllMatchingElements([
        /* eslint-disable react/jsx-key */
        <SectionTreeTab label="Section 1" />,
        <SectionTreeTab label="Section 2" />
      ])
    ).toBeTruthy();
  });

  it('should render a SectionTreeTab for each child of the props.activePath tree node', function() {
    const wrapper = mount(
      <SectionTree {...defaultProps} activePath={[0, 0]} />
    );

    expect(
      wrapper.containsMatchingElement(
        <SectionTreeTab label="Sub-SubSection 1" />
      )
    ).toBeTruthy();
  });

  it('Should render a header tab with back button if >0 levels deep', function() {
    let wrapper = mount(<SectionTree {...defaultProps} />);
    expect(
      wrapper.containsMatchingElement(
        <SectionTreeTab data-testtarget="back-button" />
      )
    ).toBeFalsy();

    wrapper = mount(<SectionTree {...defaultProps} activePath={[0]} />);
    expect(
      wrapper.containsMatchingElement(
        <SectionTreeTab data-testtarget="back-button" />
      )
    ).toBeTruthy();
  });

  it('Should render the correct form component at a tree leaf', function() {
    const wrapper = mount(
      <SectionTree {...defaultProps} activePath={[0, 0, 0]} />
    );
    expect(wrapper.find('#Sub-SubSection-1')).toHaveLength(1);
  });

  it('should call props.onNavigate for forward navigation, appending the new path index', function() {
    const handler = jest.fn();
    const wrapper = mount(
      <SectionTree {...defaultProps} activePath={[]} onNavigate={handler} />
    );
    wrapper
      .find('SectionTreeTab')
      .first()
      .simulate('click');

    expect(handler).toHaveBeenCalledWith([0]);
  });

  it('should callprops.onNavigate for backward navigation, dropping the last path index', function() {
    const handler = jest.fn();
    const wrapper = mount(
      <SectionTree
        {...defaultProps}
        activePath={[0, 0, 0]}
        onNavigate={handler}
      />
    );
    wrapper
      .find('SectionTreeTab')
      .first()
      .simulate('click');

    expect(handler).toHaveBeenCalledWith([0, 0]);
  });

  it('does not show tabs with visible === false', function() {
    const visibleTestTree = {
      children: [
        {
          label: 'Section 1',
          children: [
            {
              label: 'SubSection 1',
              children: []
            },
            {
              visible: false,
              label: 'SubSection 2',
              children: []
            }
          ]
        },
        {
          visible: false,
          label: 'Section 2',
          children: []
        },
        {
          visible: true,
          label: 'Section 3',
          children: []
        }
      ]
    };

    const wrapper = mount(
      <SectionTree {...defaultProps} sections={visibleTestTree} />
    );

    expect(
      wrapper.containsAllMatchingElements([
        <SectionTreeTab label="Section 1" />,
        <SectionTreeTab label="Section 3" />
      ])
    ).toBe(true);

    wrapper.setProps({ activePath: [0] });

    expect(
      wrapper.containsMatchingElement(<SectionTreeTab label="SubSection 1" />)
    ).toBe(true);
    expect(
      wrapper.containsMatchingElement(<SectionTreeTab label="SubSection 2" />)
    ).toBe(false);
  });
});

describe('SectionTreeTab', function() {
  const defaultProps = {
    label: 'test-label',
    id: 0
  };

  it('shows props.label', function() {
    const wrapper = mount(
      <SectionTreeTab {...defaultProps} label="test-label" />
    );
    expect(wrapper.text()).toMatch(/test-label/);
  });

  it('shows props.leftIcon', function() {
    const wrapper = mount(
      <SectionTreeTab {...defaultProps} leftIcon={<div id="test-left" />} />
    );
    expect(
      wrapper.containsMatchingElement(<div id="test-left" />)
    ).toBeTruthy();
  });

  it('shows props.rightIcon', function() {
    const wrapper = mount(
      <SectionTreeTab {...defaultProps} rightIcon={<div id="test-right" />} />
    );
    expect(
      wrapper.containsMatchingElement(<div id="test-right" />)
    ).toBeTruthy();
  });

  it('adds dark styling with props.dark', function() {
    const wrapper = mount(<SectionTreeTab {...defaultProps} dark />);

    expect(wrapper.find(Button).props().classes.root).toContain('dark');
  });

  it('calls props.onClick with props.id', function() {
    const handler = jest.fn();
    const wrapper = mount(
      <SectionTreeTab {...defaultProps} id={12} onClick={handler} />
    );
    wrapper.simulate('click');

    expect(handler).toHaveBeenCalledWith(12);
  });

  it('shows the count/clear button if props.filterCount is >0', function() {
    let wrapper = mount(<SectionTreeTab {...defaultProps} filterCount={0} />);
    expect(wrapper.find(Chip).length).toEqual(0);

    wrapper = mount(<SectionTreeTab {...defaultProps} filterCount={5} />);
    expect(wrapper.find(Chip).length).toEqual(1);
  });
});
