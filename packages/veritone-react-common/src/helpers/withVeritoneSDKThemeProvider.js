import React from 'react';
import { oneOfType, func, node, objectOf, object, any } from 'prop-types';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  jssPreset,
  ThemeProvider,
  createGenerateClassName,
  StylesProvider
} from '@material-ui/styles';
import { create } from 'jss';
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

const jss = create({
  ...jssPreset()
});

const generateClassName = createGenerateClassName({
  productionPrefix: `vsdk-${guid()}`,
  seed: `vsdk-${guid()}`
})

export class VeritoneSDKThemeProvider extends React.Component {
  static propTypes = {
    theme: objectOf(any),
    children: node,
    generateClassName: func
  };

  render() {
    const mergedTheme = createMuiTheme(
      merge({}, defaultVSDKTheme, this.props.theme)
    );

    return (
      <StylesProvider
        jss={jss}
        generateClassName={this.props.generateClassName || generateClassName}
      >
        <ThemeProvider theme={mergedTheme}>
          {this.props.children}
        </ThemeProvider>
      </StylesProvider>
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
