import React from 'react';
import { noop } from 'lodash';
import { mount } from 'enzyme';
import Button from '@material-ui/core/Button';
import AttachMoneyIcon from '@material-ui/icons/Apps';

import SectionTree, { SectionTreeTab } from './SectionTree';

describe('SectionTree', function() {
  const testSectionTree = {
    children: {
      overview: {
        label: 'Overview',
        iconClassName: 'icon-overview'
      },
      billing: {
        label: 'Billing Dashboard',
        icon: <AttachMoneyIcon />
      },
      engines: {
        label: 'Engines',
        iconClassName: 'icon-engines',
        children: {
          documentation: {
            label: 'Documentation',
            children: {
              api: {
                label: 'API'
              }
            }
          },
          deployments: {
            label: 'Deployments'
          }
        }
      }
    }
  };

  const defaultProps = {
    sections: testSectionTree,
    activePath: [],
    onNavigate: noop
  };

  it('should render SectionTreeTabs for the root children by default', function() {
    const wrapper = mount(<SectionTree {...defaultProps} />);
    // console.log(wrapper.find('SectionTreeTab').debug())

    expect(
      wrapper.containsAllMatchingElements([
        /* eslint-disable react/jsx-key */
        <SectionTreeTab label="Overview" />,
        <SectionTreeTab label="Billing Dashboard" />,
        <SectionTreeTab label="Engines" />
      ])
    ).toBeTruthy();
  });

  it('should render a SectionTreeTab for each child of the props.activePath tree node', function() {
    let wrapper = mount(
      <SectionTree {...defaultProps} activePath={['engines']} />
    );

    expect(
      wrapper.containsAllMatchingElements([
        /* eslint-disable react/jsx-key */
        <SectionTreeTab label="Documentation" />,
        <SectionTreeTab label="Deployments" />
      ])
    ).toBeTruthy();

    // deep
    wrapper = mount(
      <SectionTree
        {...defaultProps}
        activePath={['engines', 'documentation']}
      />
    );

    expect(
      wrapper.containsMatchingElement(<SectionTreeTab label="API" />)
    ).toBeTruthy();
  });

  it('Should render a header tab with back button if >0 levels deep', function() {
    let wrapper = mount(<SectionTree {...defaultProps} />);

    expect(
      wrapper.containsMatchingElement(
        <SectionTreeTab data-testtarget="back-button" />
      )
    ).toBeFalsy();

    wrapper = mount(<SectionTree {...defaultProps} activePath={['engines']} />);
    expect(
      wrapper.containsMatchingElement(
        <SectionTreeTab data-testtarget="back-button" />
      )
    ).toBeTruthy();
  });

  it('should show the label of the current path on the back button', function() {
    let wrapper = mount(
      <SectionTree {...defaultProps} activePath={['engines']} />
    );

    expect(
      wrapper.containsMatchingElement(
        <SectionTreeTab data-testtarget="back-button" label="Engines" />
      )
    ).toBeTruthy();

    wrapper = mount(
      <SectionTree
        {...defaultProps}
        activePath={['engines', 'documentation']}
      />
    );

    expect(
      wrapper.containsMatchingElement(
        <SectionTreeTab data-testtarget="back-button" label="Documentation" />
      )
    ).toBeTruthy();
  });

  it(
    'should render the root and show the current item as selected when the currently ' +
      'selected root item has no children',
    function() {
      let wrapper = mount(
        <SectionTree {...defaultProps} activePath={['billing']} />
      );

      expect(
        wrapper.containsMatchingElement(
          <SectionTreeTab label="Billing Dashboard" selected />
        )
      ).toBeTruthy();
    }
  );

  it(
    'should render the parent path and show the current item as selected when the ' +
      'currently selected item has no children',
    function() {
      let wrapper = mount(
        <SectionTree
          {...defaultProps}
          activePath={['engines', 'deployments']}
        />
      );

      expect(
        wrapper.containsMatchingElement(
          <SectionTreeTab label="Deployments" selected />
        )
      ).toBeTruthy();

      wrapper = mount(
        <SectionTree
          {...defaultProps}
          activePath={['engines', 'documentation', 'api']}
        />
      );

      expect(
        wrapper.containsMatchingElement(<SectionTreeTab label="API" selected />)
      ).toBeTruthy();
    }
  );

  it('should not show a back button when displaying the root, unless root is the last-matched path', function() {
    let wrapper = mount(<SectionTree {...defaultProps} activePath={[]} />);

    expect(
      wrapper.containsMatchingElement(
        <SectionTreeTab data-testtarget="back-button" />
      )
    ).toBeFalsy();

    // root is last matched
    wrapper = mount(
      <SectionTree {...defaultProps} activePath={['engines', 'asdf']} />
    );

    expect(
      wrapper.containsMatchingElement(
        <SectionTreeTab data-testtarget="back-button" />
      )
    ).toBeTruthy();
  });

  it('should show a back button with the item name when the currently selected item has no children', function() {
    let wrapper = mount(
      <SectionTree {...defaultProps} activePath={['engines', 'deployments']} />
    );

    expect(
      wrapper.containsMatchingElement(
        <SectionTreeTab data-testtarget="back-button" label="Deployments" />
      )
    ).toBeTruthy();

    wrapper = mount(
      <SectionTree
        {...defaultProps}
        activePath={['engines', 'documentation', 'api']}
      />
    );

    expect(
      wrapper.containsMatchingElement(
        <SectionTreeTab data-testtarget="back-button" label="API" />
      )
    ).toBeTruthy();
  });

  it('should, given a partial path, render the items of the deepest matching path', function() {
    const wrapper = mount(
      <SectionTree
        {...defaultProps}
        activePath={['engines', 'documentation', 'fake', '123']}
      />
    );

    expect(
      wrapper.containsMatchingElement(<SectionTreeTab label="API" />)
    ).toBeTruthy();
  });

  it(
    'should, given a partial path, render a back button that navigates to the ' +
      'parent of the deepest matching path, with the label of the deepest matching path',
    function() {
      const handler = jest.fn();
      const wrapper = mount(
        <SectionTree
          {...defaultProps}
          activePath={['engines', 'documentation', 'fake', '123']}
          onNavigate={handler}
        />
      );

      expect(
        wrapper.containsMatchingElement(
          <SectionTreeTab data-testtarget="back-button" label="Documentation" />
        )
      ).toBeTruthy();

      wrapper
        .find('SectionTreeTab[data-testtarget="back-button"]')
        .first()
        .simulate('click');

      expect(handler).toHaveBeenCalledWith(['engines']);
    }
  );

  it('should, given a partial path, handle navigation to siblings on the deepest matched path', function() {
    const handler = jest.fn();
    const wrapper = mount(
      <SectionTree
        {...defaultProps}
        activePath={['engines', 'fake', '123']}
        onNavigate={handler}
      />
    );

    expect(
      wrapper.containsAllMatchingElements([
        <SectionTreeTab label="Documentation" />,
        <SectionTreeTab label="Deployments" />
      ])
    ).toBeTruthy();

    wrapper.find('SectionTreeTab[label="Deployments"]').simulate('click');

    expect(handler).toHaveBeenCalledWith(['engines', 'deployments']);
  });

  it('should call props.onNavigate for backward navigation, dropping the last path index', function() {
    const handler = jest.fn();
    const wrapper = mount(
      <SectionTree
        {...defaultProps}
        activePath={['engines', 'documentation']}
        onNavigate={handler}
      />
    );
    wrapper
      .find('SectionTreeTab')
      .first()
      .simulate('click');

    expect(handler).toHaveBeenCalledWith(['engines']);
  });

  it('should call props.onNavigate for backward navigation, dropping the last path index (no children)', function() {
    const handler = jest.fn();
    const wrapper = mount(
      <SectionTree
        {...defaultProps}
        activePath={['engines', 'deployments']}
        onNavigate={handler}
      />
    );
    wrapper
      .find('SectionTreeTab[data-testtarget="back-button"]')
      .first()
      .simulate('click');

    expect(handler).toHaveBeenCalledWith(['engines']);
  });

  it('should call props.onNavigate for navigation between sibling paths', function() {
    const handler = jest.fn();
    const wrapper = mount(
      <SectionTree {...defaultProps} activePath={[]} onNavigate={handler} />
    );
    wrapper.find('SectionTreeTab[label="Engines"]').simulate('click');

    expect(handler).toHaveBeenCalledWith(['engines']);

    wrapper.find('SectionTreeTab[label="Billing Dashboard"]').simulate('click');

    expect(handler).toHaveBeenCalledWith(['billing']);
  });
});

describe('SectionTreeTab', function() {
  const defaultProps = {
    label: 'test-label',
    id: 'some-id'
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

  it('adds selected styling with props.selected', function() {
    const wrapper = mount(<SectionTreeTab {...defaultProps} selected />);
    expect(wrapper.find(Button).first().props().classes.root).toContain('selected');
  });

  it('calls props.onClick with props.id', function() {
    const handler = jest.fn();
    const wrapper = mount(
      <SectionTreeTab {...defaultProps} id="some-id" onClick={handler} />
    );
    wrapper.simulate('click');

    expect(handler).toHaveBeenCalledWith('some-id');
  });
});
