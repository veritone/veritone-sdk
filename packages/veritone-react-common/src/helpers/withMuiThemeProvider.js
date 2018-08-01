import React from 'react';
import { oneOfType, func, node, objectOf, object, any } from 'prop-types';
import {
  MuiThemeProvider,
  createMuiTheme,
  withTheme,
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

const VSDKStyleWrapper = withTheme()(
  class VSDKStyleWrapperWithoutTheme extends React.Component {
    static propTypes = {
      theme: objectOf(any),
      customTheme: objectOf(any),
      children: node
    };

    constructor() {
      super();
      this._style = `vsdk-${guid()}`;
      this._jss = create(jssPreset());
    }

    render() {
      // need to merge the results of createMuiTheme
      // because some variables like htmlFontSize
      // are used for the calculation of theme properties
      // ex: createMuiTheme({typography: { htmlFontSize: 5 }) => { typography: { fontSize: 10 / 5 }}
      // the values will be incorrect if you merge just the themes without applying createMuiTheme
      const mergedTheme = merge(
        {},
        createMuiTheme(this.props.theme),
        createMuiTheme(this.props.customTheme)
      );

      return (
        <JssProvider jss={this._jss} classNamePrefix={this._style}>
          <MuiThemeProvider theme={mergedTheme}>
            {this.props.children}
          </MuiThemeProvider>
        </JssProvider>
      );
    }
  }
);

export { VSDKStyleWrapper };

export function withMuiThemeProvider(theme) {
  return function decorator(Class) {
    class WrappedWithMuiThemeProvider extends React.Component {
      static propTypes = {
        forwardedRef: oneOfType([func, object])
      };

      render() {
        const { forwardedRef, ...rest } = this.props;
        return (
          <VSDKStyleWrapper customTheme={theme}>
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
