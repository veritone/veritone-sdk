/* eslint-disable react/prop-types, react/display-name */

import React from 'react';
import { mount } from 'enzyme';

import { shortcutKeyPressed } from 'modules/keyBindings';
import KeyBindings, { withKeyBindings } from './';

const fakeDispatch = jest.fn();
const mockStore = {
  dispatch: fakeDispatch,
  getState: () => ({}),
  subscribe: a => a
};

afterEach(() => {
  fakeDispatch.mockReset();
});

describe('KeyBindings component', function() {
  it('Renders its children', function() {
    const TestComponent = () => <div id="works" />;

    const wrapper = mount(
      <KeyBindings store={mockStore}>
        <TestComponent />
      </KeyBindings>
    );

    expect(wrapper.find('#works')).toHaveLength(1);
  });

  it('Dispatches actions for handled keys (simple)', function() {
    const wrapper = mount(
      <KeyBindings codes={['a', 'b']} store={mockStore}>
        <div />
      </KeyBindings>
    );

    wrapper.simulate('keyUp', { key: 'a' });
    expect(fakeDispatch).toHaveBeenCalledWith(shortcutKeyPressed('a'));

    wrapper.simulate('keyUp', { key: 'b' });
    expect(fakeDispatch).toHaveBeenCalledWith(shortcutKeyPressed('b'));
  });

  it('Dispatches actions for handled keys (with modifiers)', function() {
    const wrapper = mount(
      <KeyBindings codes={[{ key: 'a', shiftKey: true }]} store={mockStore}>
        <div />
      </KeyBindings>
    );

    wrapper.simulate('keyUp', {
      key: 'a',
      shiftKey: true,
      ctrlKey: false,
      altKey: false
    });

    expect(fakeDispatch).toHaveBeenCalledWith(
      shortcutKeyPressed('a', {
        shiftKey: true,
        ctrlKey: false,
        altKey: false
      })
    );
  });

  it('Dispatches correctly with multiple modifiers', function() {
    const wrapper = mount(
      <KeyBindings codes={[{ key: 'a', shiftKey: true }]} store={mockStore}>
        <div />
      </KeyBindings>
    );

    wrapper.simulate('keyUp', {
      key: 'a',
      shiftKey: true,
      // extra modifier
      ctrlKey: true,
      altKey: false
    });

    expect(fakeDispatch).not.toHaveBeenCalled();
  });
});

describe('withKeyBindings decorator', function() {
  it('renders the wrapped component', function() {
    const TestComponent = () => <div id="works" />;

    const DecoratedComponent = withKeyBindings({})(TestComponent);
    const wrapper = mount(<DecoratedComponent store={mockStore} />);

    expect(wrapper.find('#works')).toHaveLength(1);
  });
});
