// https://material-ui.com/demos/progress/#delaying-appearance
// when props.loading is set to true, will delay for props.delay ms before
// showing a loading indicator.

import React from 'react';
import { number, bool, objectOf, any } from 'prop-types';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class DelayedProgress extends React.Component {
  static propTypes = {
    loading: bool,
    delay: number,
    circularProgressProps: objectOf(any)
  };
  static defaultProps = {
    delay: 800,
    loading: false
  };

  render() {
    return (
      <Fade
        in={this.props.loading}
        style={{
          transitionDelay: this.props.loading ? `${this.props.delay}ms` : '0ms'
        }}
        unmountOnExit
      >
        <CircularProgress {...this.props.circularProgressProps} />
      </Fade>
    );
  }
}
