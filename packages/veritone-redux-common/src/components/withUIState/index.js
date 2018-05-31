import React from 'react';
import { isFunction, omit, noop, isEmpty } from 'lodash';
import { connect as libConnect } from 'react-redux';

import {
  getStateForKey,
  setStateForKey,
  clearStateForKey
} from 'modules/ui-state';
import { guid } from 'helpers/misc';
import { string, func, objectOf, any } from 'prop-types';

const withUIState = (
  {
    // specify a key here to use the same key for every instance of this component.
    //   (careful, this won't work if multiple instances exist at the same time!
    //    It's meant for ie. wrapping an entire page container)
    // otherwise, specify it on the component itself <Component uiStateKey="my-key" />
    // if no key is specified, a random one will be assigned for every instance.
    key = null,
    // persist state across unmount/mount? rendered component must be passed a
    // `uiStateKey` prop for persistence to work
    persist = false, // todo: allow config of persistance from a prop
    defaultState = {}
  } = {},
  connect = libConnect
) => WrappedComponent => {
  // unique per instance of the component and consistent across renders
  @connect(
    () => {
      const randomKey = guid();

      return function mapStateToProps(state, ownProps) {
        const stateKey = ownProps.uiStateKey || key || randomKey;

        if (
          process.env.NODE_ENV !== 'production' &&
          persist &&
          !ownProps.uiStateKey
        ) {
          console.warn("Warning: persist won't work without a uiStateKey");
        }

        return {
          uiStateKey: stateKey,
          uiState: getStateForKey(state, stateKey),
          defaultState: isFunction(defaultState)
            ? defaultState(ownProps)
            : defaultState
        };
      };
    },
    {
      setStateForKey,
      clearStateForKey
    }
  )
  class WrappedWithUIState extends React.Component {
    static propTypes = {
      uiStateKey: string.isRequired,
      uiState: objectOf(any),
      setStateForKey: func,
      clearStateForKey: func,
      defaultState: objectOf(any)
    };

    static defaultProps = {
      uiState: {},
      setStateForKey: noop,
      clearStateForKey: noop
    };

    UNSAFE_componentWillMount() {
      this.isMounting = true;

      if (persist) {
        return this.props.setStateForKey(
          this.props.uiStateKey,
          isEmpty(this.props.uiState)
            ? this.props.defaultState
            : this.props.uiState
        );
      }

      this.resetUIState();
    }

    componentDidMount() {
      this.isMounting = false;
    }

    componentWillUnmount() {
      if (!persist) {
        this.props.clearStateForKey(this.props.uiStateKey);
      }
    }

    setUIState = state => {
      this.props.setStateForKey(this.props.uiStateKey, state);
    };

    resetUIState = () => {
      this.props.setStateForKey(this.props.uiStateKey, this.props.defaultState);
    };

    render() {
      const restProps = omit(this.props, [
        'setStateForKey',
        'clearStateForKey',
        'defaultState'
      ]);

      return (
        <WrappedComponent
          {...restProps}
          uiState={
            // ensure child never sees empty state
            // (it renders once before the intitial store
            // state gets set)
            this.isMounting ? this.props.defaultState : this.props.uiState
          }
          setUIState={this.setUIState}
          resetUIState={this.resetUIState}
        />
      );
    }
  }

  return WrappedWithUIState;
};

export default withUIState;
