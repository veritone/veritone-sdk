import React from 'react';
import cx from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import { func, string, bool, shape, any } from 'prop-types';
import { withStyles } from '@material-ui/styles';

import styles from './styles/index';

class RefreshButton extends React.Component {
  static propTypes = {
    onRefresh: func.isRequired,
    disabled: bool,
    className: string,
    classes: shape({ any }),
  };

  state = {
    animating: false,
    animationTimeout: null
  };

  componentWillUnmount() {
    clearTimeout(this.state.animationTimeout);
  }

  handleClick = () => {
    clearTimeout(this.state.animationTimeout);

    this.setState({
      animating: true,
      animationTimeout: setTimeout(
        () => this.setState({ animating: false }),
        750
      )
    });

    this.props.onRefresh();
  };

  render() {
    const { classes } = this.props;
    return (
      <IconButton
        className={cx(this.props.className, {
          [classes['spin']]: this.state.animating
        })}
        disabled={this.props.disabled}
        onClick={this.handleClick}
      >
        <RefreshIcon />
      </IconButton>
    );
  }
}

export default withStyles(styles)(RefreshButton);
