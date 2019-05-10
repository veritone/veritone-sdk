import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { bool, func, string } from 'prop-types';
import styles from './styles.scss';

class FilePickerFooter extends Component {
  static propTypes = {
    disabled: bool,
    onCancel: func,
    onSubmit: func,
    title: string
  };

  static defaultProps = {
    title: 'Upload'
  };

  render() {
    return (
      <div className={styles.filePickerFooter}>
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
