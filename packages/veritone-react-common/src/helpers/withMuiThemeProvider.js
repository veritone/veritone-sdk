import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

export default function withMuiThemeProvider(Component) {
  return class WrappedWithMuiTheme extends React.Component {
    static displayName = Component.displayName || Component.name;

    render() {
      return (
        <MuiThemeProvider
          theme={createMuiTheme({
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
          })}
        >
          <Component {...this.props} />
        </MuiThemeProvider>
      );
    }
  };
}
