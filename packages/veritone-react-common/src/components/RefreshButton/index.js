import React from 'react';
import cx from 'classnames';
import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui-icons/Refresh';
import { func, string, bool } from 'prop-types';
import styles from './styles/index.scss';

export default class RefreshButton extends React.Component {
  static propTypes = {
    onRefresh: func.isRequired,
    disabled: bool,
    className: string
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
    return (
      <IconButton
        className={cx(this.props.className, {
          [styles['spin']]: this.state.animating
        })}
        disabled={this.props.disabled}
        onClick={this.handleClick}
      >
        <RefreshIcon />
      </IconButton>
    );
  }
}