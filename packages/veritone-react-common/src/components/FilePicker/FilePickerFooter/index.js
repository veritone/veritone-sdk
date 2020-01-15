import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import { bool, func, string, shape, any } from 'prop-types';
import cx from 'classnames';
import styles from './styles';

class FilePickerFooter extends Component {
  static propTypes = {
    disabled: bool,
    onCancel: func,
    onSubmit: func,
    title: string,
    hasIntercom: bool,
    classes: shape({ any }),
  };

  static defaultProps = {
    title: 'Upload'
  };

  render() {
    const {
      hasIntercom,
      onCancel,
      disabled,
      onSubmit,
      title,
      classes
    } = this.props;
    return (
      <div className={cx(classes.filePickerFooter, {
        [classes.hasIntercom]: hasIntercom
      })}>
        <Button
          data-veritone-element={`picker-footer-cancel-button`}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          data-veritone-element={`picker-footer-${title}-button`}
          variant="contained"
          disabled={disabled}
          color="primary"
          onClick={onSubmit}
        >
          {title}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(FilePickerFooter);
