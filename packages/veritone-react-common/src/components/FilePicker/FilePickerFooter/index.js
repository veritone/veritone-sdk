import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { bool, func, string } from 'prop-types';
import cx from 'classnames';
import styles from './styles.scss';

class FilePickerFooter extends Component {
  static propTypes = {
    disabled: bool,
    onCancel: func,
    onSubmit: func,
    title: string,
    hasIntercom: bool
  };

  static defaultProps = {
    title: 'Upload'
  };

  render() {
    return (
      <div className={cx(styles.filePickerFooter, {
        [styles.hasIntercom]: this.props.hasIntercom
      })}>
        <Button onClick={this.props.onCancel}>Cancel</Button>
        <Button
          variant="raised"
          disabled={this.props.disabled}
          color="primary"
          onClick={this.props.onSubmit}
        >
          {this.props.title}
        </Button>
      </div>
    );
  }
}

export default FilePickerFooter;
