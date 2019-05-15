import React, { Component, cloneElement } from 'react';
import { string, bool, func, objectOf, any, node } from 'prop-types';

import Cancel from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

import classNames from 'classnames';
import styles from './styles.scss';

export default class Lightbox extends Component {
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
    data: objectOf(any)
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
      contentClassName
    } = this.props;

    return (
      <div
        className={classNames(styles.lightbox, className, {
          [styles.open]: this.state.open,
          [styles.hidden]: this.state.hidden,
          [styles.fullscreen]: fullscreen
        })}
      >
        <div
          className={classNames(styles.background)}
          onClick={this.handleBackdropClick}
        />
        <div className={classNames(styles.content, contentClassName)}>
          {cloneElement(children)}
          {closeButton && (
            <IconButton
              aria-label="Close"
              onClick={this.handleCloseButtonClick}
              className={classNames(styles.closeButton, buttonClassName)}
            >
              <Cancel className={classNames(styles.closeButtonIcon)} />
            </IconButton>
          )}
        </div>
      </div>
    );
  }
}
