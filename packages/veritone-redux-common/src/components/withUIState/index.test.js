/* eslint-disable react/prop-types, react/display-name */

import React from 'react';
import { createStore, combineReducers } from 'redux';
import { mount } from 'enzyme';

import uiStateReducer, { namespace, getStateForKey } from 'modules/ui-state';
import withUIState from './';

const makeFakeConnect = function(fakeDispatch = action => action) {
  return injectedProps => Component => props => (
    <Component dispatch={fakeDispatch} {...props} {...injectedProps} />
  );
};

describe('withUIState', function() {
  it('renders the wrapped component', function() {
    const TestComponent = () => <div id="works" />;

    const DecoratedComponent = withUIState({}, makeFakeConnect())(
      TestComponent
    );
    const wrapper = mount(<DecoratedComponent uiStateKey="test-component" />);

    expect(wrapper.find('#works')).toHaveLength(1);
  });

  it('injects ui state into the wrapped component (default) on mount', function() {
    const store = createStore(
      combineReducers(
        {
          [namespace]: uiStateReducer
        },
        {}
      )
    );

    const TestComponent = ({ uiState }) => <div id={uiState.id} />;

    const DecoratedComponent = withUIState({
      defaultState: { id: 'works' }
    })(TestComponent);

    const wrapper = mount(<DecoratedComponent store={store} />);

    expect(wrapper.find('#works')).toHaveLength(1);
  });

  it("clears the component's ui state on unmount if persist = false", function() {
    const store = createStore(
      combineReducers(
        {
          [namespace]: uiStateReducer
        },
        {}
      )
    );

    const emptyState = store.getState();

    const TestComponent = ({ uiState }) => {
      return <div id={uiState.id} />;
    };

    const DecoratedComponent = withUIState({
      defaultState: { id: 'works' },
      persist: false
    })(TestComponent);

    const wrapper = mount(<DecoratedComponent store={store} />);

    wrapper.unmount();
    expect(store.getState()).toEqual(emptyState);
  });

  it("reloads the component's previous ui state on mount if persist = true", function() {
    const store = createStore(
      combineReducers(
        {
          [namespace]: uiStateReducer
        },
        {}
      )
    );

    class TestComponent extends React.Component {
      UNSAFE_componentWillUpdate(nextProps) {
        if (this.props.set !== nextProps.set) {
          this.props.setUIState({
            id: 'new-state'
          });
        }
      }

      render() {
        return <div id={this.props.uiState.id} />;
      }
    }

    const DecoratedComponent = withUIState({
      defaultState: { id: 'initial' },
      persist: true
    })(TestComponent);

    const wrapper = mount(
      <DecoratedComponent store={store} uiStateKey="my-component" />
    );
    expect(wrapper.find('#initial')).toHaveLength(1);

    wrapper.setProps({ set: true });
    wrapper.update();
    expect(wrapper.find('#new-state')).toHaveLength(1);
    wrapper.unmount();

    // next time that component is mounted, it has the same state
    const newWrapper = mount(
      <DecoratedComponent store={store} uiStateKey="my-component" />
    );

    expect(newWrapper.find('#new-state')).toHaveLength(1);
  });

  it('injects setUIState into the wrapped component + it works', function() {
    const store = createStore(
      combineReducers(
        {
          [namespace]: uiStateReducer
        },
        {}
      )
    );

    class TestComponent extends React.Component {
      componentDidMount() {
        this.props.setUIState({
          id: 'works'
        });
      }

      render() {
        return <div id={this.props.uiState.id} />;
      }
    }

    const DecoratedComponent = withUIState({
      defaultState: { id: 'doesnt-work' }
    })(TestComponent);

    const wrapper = mount(
      <DecoratedComponent store={store} uiStateKey="my-component" />
    );
    expect(wrapper.find('#works')).toHaveLength(1);
  });

  it('injects resetUIState into the wrapped component + it works', function() {
    const store = createStore(
      combineReducers(
        {
          [namespace]: uiStateReducer
        },
        {}
      )
    );

    class TestComponent extends React.Component {
      componentDidMount() {
        this.props.setUIState({
          id: 'new-state'
        });
      }

      UNSAFE_componentWillUpdate(nextProps) {
        if (this.props.reset !== nextProps.reset) {
          this.props.resetUIState();
        }
      }

      render() {
        return <div id={this.props.uiState.id} />;
      }
    }

    const DecoratedComponent = withUIState({
      defaultState: { id: 'initial' }
    })(TestComponent);

    const wrapper = mount(<DecoratedComponent store={store} />);

    expect(wrapper.find('#new-state')).toHaveLength(1);
    wrapper.setProps({ reset: true });
    wrapper.update();
    expect(wrapper.find('#initial')).toHaveLength(1);
  });

  it('allows a key to be set on the class decorator', function() {
    const store = createStore(
      combineReducers(
        {
          [namespace]: uiStateReducer
        },
        {}
      )
    );

    const TestComponent = ({ uiState }) => <div id={uiState.id} />;

    const DecoratedComponent = withUIState({
      key: 'my-key',
      defaultState: { id: 'works' }
    })(TestComponent);

    mount(<DecoratedComponent store={store} />);

    expect(getStateForKey(store.getState(), 'my-key')).toEqual({ id: 'works' });
  });
});
