import React from 'react';
import { shallow, mount } from 'enzyme';

import { appBarHeight } from '../AppBar';
import TopBar, { topBarHeight } from './';

describe('TopBar', function () {
  it('exists', function () {
    const wrapper = shallow(<TopBar />);
    expect(wrapper.length).toBeTruthy();
  });

  it('exports a height and uses it', function () {
    expect(typeof topBarHeight).toBe('number');

    const wrapper = mount(<TopBar />);
    expect(wrapper.find('[data-test="container"]').get(0).props.style.height).toBe(topBarHeight);
  });

  it('adds top offset with props.appBarOffset', function () {
    const wrapper = mount(<TopBar appBarOffset />);
    expect(wrapper.find('[data-test="container"]').get(0).props.style.top).toBe(appBarHeight);
  });

  it('adds left offset with props.leftOffset', function () {
    const wrapper = mount(<TopBar leftOffset={100} />);
    expect(wrapper.find('[data-test="container"]').get(0).props.style.marginLeft).toBe(100);
  });

  it('changes elevation with props.elevation', function () {
    const wrapper = shallow(<TopBar elevation={15} />);
    expect(wrapper.props().elevation).toBe(15);
  });

  it('shows a button to expand a menu with props.menuButton, calls props.onRequestOpenMenu on click', function () {
    let wrapper = mount(<TopBar />);
    expect(wrapper.find('button.menuButton')).toHaveLength(0);

    const open = jest.fn();
    wrapper = mount(<TopBar menuButton onRequestOpenMenu={open} />);
    wrapper.find('button.menuButton').simulate('click');
    expect(wrapper.find('button.menuButton')).toHaveLength(1);
    expect(open).toHaveBeenCalled();
  });

  it('shows a button to expand a menu with props.backButton, calls props.onRequestOpenMenu on click', function () {
    let wrapper = mount(<TopBar />);
    expect(wrapper.find('[data-test="backButton"]')).toHaveLength(0);

    const open = jest.fn();
    wrapper = mount(<TopBar backButton onClickBackButton={open} />);
    wrapper.find('button[data-test="backButton"]').simulate('click');
    expect(wrapper.find('button[data-test="backButton"]')).toHaveLength(1);
    expect(open).toHaveBeenCalled();
  });

  it('adds .selected to container and leftText with props.selected', function () {
    let wrapper = mount(<TopBar selected leftText="test" />);
    // container
    expect(wrapper.find('[data-test-selected="selected"]').length).toBeGreaterThan(1);

    // leftText
    expect(
      wrapper.findWhere(n => n.text() === 'test')
        .length
    ).toBeGreaterThan(1);
  });

  it('shows text passed via props.leftText', function () {
    let wrapper = mount(<TopBar leftText="test text" />);
    expect(
      wrapper.findWhere(n => n.text() === 'test text').length
    ).toBeGreaterThanOrEqual(1);
  });

  it('shows elements passed to props.rightIconButtons', function () {
    let wrapper = mount(
      <TopBar
        rightIconButtons={[
          <div id="one" key="1" />,
          <div id="two" key="2" />,
          <div id="three" key="3" />
        ]}
      />
    );

    expect(wrapper.find('#one').exists()).toBeTruthy();
    expect(wrapper.find('#two').exists()).toBeTruthy();
    expect(wrapper.find('#three').exists()).toBeTruthy();
  });

  it('shows a menu with props.rightMenu and props.rightMenuItems', function () {
    const handler = jest.fn();
    const handler2 = jest.fn();

    let wrapper = mount(
      <TopBar
        rightMenu
        rightMenuItems={[
          { label: 'one', handler: handler },
          { label: 'two', handler: handler2 }
        ]}
      />
    );

    // button exists
    expect(wrapper.find('button.rightMenuButton').exists()).toBeTruthy();

    // fixme: uncomment after Enzyme supports portals
    // (https://github.com/airbnb/enzyme/issues/1150)

    // wrapper.find('.rightMenuButton').first().simulate('click');
    // expect(wrapper.find('Menu').exists()).toBeTruthy();
    // expect(
    //   wrapper
    //     .find('ListItemText')
    //     .findWhere(n => n.text === 'one')
    //     .exists()
    // ).toBeTruthy();
    //
    // expect(
    //   wrapper
    //     .find('ListItemText')
    //     .findWhere(n => n.text === 'two')
    //     .exists()
    // ).toBeTruthy();
    //
    // wrapper.find('MenuItem').forEach(n => n.simulate('click'));
    //
    // expect(handler).toHaveBeenCalled();
    // expect(handler2).toHaveBeenCalled();
  });

  it('renders an action button', function () {
    let wrapper = mount(
      // eslint-disable-next-line
      <TopBar renderActionButton={() => <div id="action-button" />} />
    );

    expect(wrapper.find('#action-button').exists()).toBeTruthy();
  });
});
