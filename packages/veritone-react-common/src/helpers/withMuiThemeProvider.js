import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { blue } from 'material-ui/colors';

export default function withMuiThemeProvider(Component) {
  return class WrappedWithMuiTheme extends React.Component {
    static displayName = Component.displayName || Component.name;

    render() {
      return (
        <MuiThemeProvider
          theme={createMuiTheme({
            palette: {
              primary: blue
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
