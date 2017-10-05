import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

export default function withMuiThemeProvider(Component) {
  return class WrappedComponent extends React.Component {
    static displayName = Component.displayName || Component.name;

    render() {
      return (
        <MuiThemeProvider theme={createMuiTheme()}>
          <Component {...this.props} />
        </MuiThemeProvider>
      );
    }
  };
}
