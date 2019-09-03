import React from 'react';
import { oneOfType, func, node, objectOf, object, any } from 'prop-types';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  jssPreset,
  ThemeProvider
} from '@material-ui/styles';
import { create } from 'jss';
import { JssProvider } from 'react-jss';
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

export class VeritoneSDKThemeProvider extends React.Component {
  static propTypes = {
    theme: objectOf(any),
    children: node
  };

  jssNamespace = `vsdk-${guid()}`;

  jss = create(jssPreset());

  render() {
    const mergedTheme = createMuiTheme(
      merge({}, defaultVSDKTheme, this.props.theme)
    );

    return (
      <JssProvider jss={this.jss} classNamePrefix={this.jssNamespace}>
        <ThemeProvider theme={mergedTheme}>
          {this.props.children}
        </ThemeProvider>
      </JssProvider>
    );
  }
}

export function withVeritoneSDKThemeProvider(theme) {
  return function decorator(Class) {
    class WrappedWithVeritoneSDKThemeProvider extends React.Component {
      static propTypes = {
        forwardedRef: oneOfType([func, object])
      };

      render() {
        const { forwardedRef, ...rest } = this.props;
        return (
          <VeritoneSDKThemeProvider theme={theme}>
            <Class ref={forwardedRef} {...rest} />
          </VeritoneSDKThemeProvider>
        );
      }
    }

    function forwardRef(props, ref) {
      return (
        <WrappedWithVeritoneSDKThemeProvider {...props} forwardedRef={ref} />
      );
    }

    const name = Class.displayName || Class.name;
    forwardRef.displayName = `WrappedWithVeritoneSDKThemeProvider(${name})`;

    return React.forwardRef(forwardRef);
  };
}
