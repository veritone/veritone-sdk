import React, { Component, cloneElement } from 'react';
import { string, bool, func, objectOf, any, node, shape } from 'prop-types';

import Cancel from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import styles from './styles';

class Lightbox extends Component {
  static propTypes = {
    open: bool,
    fullscreen: bool,
    closeButton: bool,
    selfClosing: bool,
    closeOnBackdropClick: bool,
    onClose: func,
    onBackdropClick: func,
    onCloseButtonClick: func,
    children: node.isRequired,
    className: string,
    buttonClassName: string,
    contentClassName: string,
    data: objectOf(any),
    classes: shape({ any }),
  };

  static defaultProps = {
    open: true,
    fullscreen: true,
    closeButton: true,
    selfClosing: true,
    closeOnBackdropClick: true
  };

  state = {
    hidden: false,
    open: this.props.open
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    nextProps.open !== this.props.open && this.setVisibility(nextProps.open);
  }

  setVisibility = visible => {
    if (!visible) {
      const { data, onClose } = this.props;
      this.setState({ open: false });
      setTimeout(() => {
        this.setState({ hidden: true });
        onClose && onClose(data);
      }, 200);
    } else {
      this.setState({ hidden: false });
      setTimeout(() => {
        this.setState({ open: true });
      }, 50);
    }
  };

  handleBackdropClick = event => {
    const {
      data,
      onBackdropClick,
      selfClosing,
      closeOnBackdropClick
    } = this.props;

    onBackdropClick && onBackdropClick(event, data);
    selfClosing && closeOnBackdropClick && this.setVisibility(false);
  };

  handleCloseButtonClick = event => {
    const { data, selfClosing, onCloseButtonClick } = this.props;

    onCloseButtonClick && onCloseButtonClick(event, data);
    selfClosing && this.setVisibility(false);
  };

  render() {
    const {
      children,
      fullscreen,
      closeButton,
      className,
      buttonClassName,
      contentClassName,
      classes
    } = this.props;

    return (
      <div
        className={classNames(classes.lightbox, className, {
          [classes.open]: this.state.open,
          [classes.hidden]: this.state.hidden,
          [classes.fullscreen]: fullscreen
        })}
        data-test={classNames({
          open: this.state.open,
          hidden: this.state.hidden,
        })}
      >
        <div
          className={classNames(classes.background)}
          onClick={this.handleBackdropClick}
          data-test="background"
        />
        <div className={classNames(classes.content, contentClassName)}>
          {cloneElement(children)}
          {closeButton && (
            <IconButton
              aria-label="Close"
              onClick={this.handleCloseButtonClick}
              className={classNames(classes.closeButton, buttonClassName)}
            >
              <Cancel className={classNames(classes.closeButtonIcon)} />
            </IconButton>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Lightbox);
