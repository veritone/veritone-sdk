import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import variablesCustomTheme from '../styles/modules/_variables';

const themMUI = createMuiTheme({
  palette: {
    primary: blue,
  },
  typography: {
    button: {
      fontWeight: 400,
    },
  },
});

const theme = {
  ...themMUI,
  ...variablesCustomTheme,
};

export default function withMuiThemeProvider(Component) {
  return class WrappedWithMuiTheme extends React.Component {
    static displayName = Component.displayName || Component.name;

    render() {
      return (
        <ThemeProvider theme={theme}>
          <Component {...this.props} />
        </ThemeProvider>
      );
    }
  };
}
