import React, { Fragment } from 'react';
import { number } from 'prop-types';
import { storiesOf } from '@storybook/react';
import { number as numberKnob } from '@storybook/addon-knobs';
import Button from '@material-ui/core/Button';

import DelayedProgress from './';

class Story extends React.Component {
  static propTypes = {
    delay: number
  };

  state = {
    loading: false
  };

  timer = null; // eslint-disable-line

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleLoad = () => {
    this.setState({ loading: true });

    this.timer = setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 3000);
  };

  render() {
    return (
      <Fragment>
        <p>Delay before indicator appears: {this.props.delay}ms</p>
        <Button onClick={this.handleLoad}>Simulate a 3-second load</Button>
        <div>
          <DelayedProgress
            delay={this.props.delay}
            loading={this.state.loading}
            circularProgressProps={{
              size: 50
            }}
          />
        </div>
      </Fragment>
    );
  }
}

storiesOf('DelayedProgress', module).add('Base', () => {
  const delay = numberKnob(
    'delay before showing',
    DelayedProgress.defaultProps.delay
  );

  return <Story delay={delay} />;
});
