import React from 'react';
import {
  arrayOf,
  oneOfType,
  string,
  func,
  node,
  bool,
  shape,
  objectOf,
  any
} from 'prop-types';
import { connect } from 'react-redux';
import { isPlainObject, isEqual, toLower } from 'lodash';
import { shortcutKeyPressed } from 'modules/keyBindings';

@connect(null, { shortcutKeyPressed })
export default class KeyBindings extends React.Component {
  static propTypes = {
    codes: arrayOf(
      oneOfType([
        string,
        shape({
          key: string.isRequired,
          shiftKey: bool,
          altKey: bool,
          ctrlKey: bool
        })
      ])
    ),
    shortcutKeyPressed: func.isRequired,
    stopPropagation: bool,
    className: string,
    style: objectOf(any),
    children: node
  };

  static defaultProps = {
    codes: [],
    stopPropagation: false
  };

  handleKey = e => {
    const { key, shiftKey, altKey, ctrlKey } = e;
    const pressedModifiers = { shiftKey, altKey, ctrlKey };
    const pressedKey = toLower(key);

    const shouldHandleKey = this.props.codes.some(code => {
      if (isPlainObject(code)) {
        // handle key + modifier
        const { key, shiftKey, altKey, ctrlKey } = code;

        const testKey = toLower(key);
        const testModifiers = {
          shiftKey: shiftKey || false,
          altKey: altKey || false,
          ctrlKey: ctrlKey || false
        };

        return (
          // key itself was pressed
          testKey === pressedKey &&
          // correct modifiers were held
          isEqual(testModifiers, pressedModifiers)
        );
      }

      // handle plain key
      return toLower(pressedKey) === toLower(code);
    });

    if (shouldHandleKey) {
      this.props.shortcutKeyPressed(pressedKey, pressedModifiers);
      this.props.stopPropagation && e.stopPropagation();
    }
  };

  render() {
    return (
      <div
        className={this.props.className}
        style={this.props.style}
        tabIndex="0"
        onKeyUp={this.handleKey}
      >
        {this.props.children}
      </div>
    );
  }
}

export const withKeyBindings = options => WrappedComponent => {
  return class WrappedWithKeyBindings extends React.Component {
    render() {
      return (
        <KeyBindings {...this.props} {...options}>
          <WrappedComponent {...this.props} />
        </KeyBindings>
      );
    }
  };
};
