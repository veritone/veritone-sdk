import React from 'react';
import { func } from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

export default function withMuiThemeProvider(Component) {
  class WrappedWithMuiTheme extends React.Component {
    static displayName = Component.displayName || Component.name;
    static propTypes = {
      forwardedRef: func
    };

    render() {
      const { forwardedRef, ...rest } = this.props;
      return (
        <MuiThemeProvider
          theme={createMuiTheme({
            palette: {
              primary: {
                light: blue[300],
                main: blue[500],
                dark: blue[700]
              },
              secondary: {
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
          <Component ref={forwardedRef} {...rest} />
        </MuiThemeProvider>
      );
    }
  }

  function forwardRef(props, ref) {
    return <WrappedWithMuiTheme {...props} forwardedRef={ref} />;
  }

  // Give this component a more helpful display name in DevTools.
  // e.g. "ForwardRef(logProps(MyComponent))"
  const name = Component.displayName || Component.name;
  forwardRef.displayName = `WrappedWithMuiTheme(${name})`;

  return React.forwardRef(forwardRef);
}
