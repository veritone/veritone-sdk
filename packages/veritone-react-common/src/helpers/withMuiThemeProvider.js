import React from 'react';
import { oneOfType, func, node, objectOf, object, any } from 'prop-types';
import {
  MuiThemeProvider,
  createMuiTheme,
  jssPreset
} from '@material-ui/core/styles';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';

import { guid } from './guid';

export class VSDKStyleWrapper extends React.PureComponent {
  static propTypes = {
    theme: objectOf(any),
    children: node
  };

  constructor() {
    super();
    this._style = `vsdk-${guid()}`;
    this._jss = create(jssPreset());
  }

  render() {
    const mergedTheme = this.props.theme
      ? createMuiTheme({
          ...this.props.theme
        })
      : createMuiTheme();

    return (
      <JssProvider jss={this._jss} classNamePrefix={this._style}>
        <MuiThemeProvider theme={mergedTheme}>
          {this.props.children}
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

export function withMuiThemeProvider(theme) {
  return function decorator(Class) {
    class WrappedWithMuiThemeProvider extends React.PureComponent {
      static propTypes = {
        forwardedRef: oneOfType([func, object])
      };

      render() {
        const { forwardedRef, ...rest } = this.props;
        return (
          <VSDKStyleWrapper theme={theme}>
            <Class ref={forwardedRef} {...rest} />
          </VSDKStyleWrapper>
        );
      }
    }

    function forwardRef(props, ref) {
      return <WrappedWithMuiThemeProvider {...props} forwardedRef={ref} />;
    }

    const name = Class.displayName || Class.name;
    forwardRef.displayName = `WrappedWithMuiThemeProvider(${name})`;

    return React.forwardRef(forwardRef);
  };
}
