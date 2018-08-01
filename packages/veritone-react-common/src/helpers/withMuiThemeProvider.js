import React from 'react';
import { oneOfType, func, node, objectOf, object, any } from 'prop-types';
import {
  MuiThemeProvider,
  createMuiTheme,
  jssPreset
} from '@material-ui/core/styles';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import blue from '@material-ui/core/colors/blue';
import merge from 'lodash/merge';

import { guid } from './guid';

export const defaultVSDKTheme = {
  palette: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700]
    }
  },
  typography: {
    button: {
      fontWeight: 400
    }
  }
};

export class VSDKStyleWrapper extends React.Component {
  static propTypes = {
    theme: objectOf(any),
    children: node
  };

  getJSSNamespace = () => `vsdk-${guid()}`;

  getJSS = () => create(jssPreset());

  render() {
    const mergedTheme = createMuiTheme(
      merge({}, defaultVSDKTheme, this.props.theme)
    );

    return (
      <JssProvider jss={this.getJSS()} classNamePrefix={this.getJSSNamespace()}>
        <MuiThemeProvider theme={mergedTheme}>
          {this.props.children}
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

export function withMuiThemeProvider(theme) {
  return function decorator(Class) {
    class WrappedWithMuiThemeProvider extends React.Component {
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
