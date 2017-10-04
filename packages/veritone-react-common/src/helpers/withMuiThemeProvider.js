import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default function withMuiThemeProvider(Component) {
  return class WrappedComponent extends React.Component {
    static displayName = Component.displayName || Component.name;

    render() {
      return (
        <MuiThemeProvider>
          <Component {...this.props} />
        </MuiThemeProvider>
      );
    }
  };
}
