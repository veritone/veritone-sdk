import React, { Component } from 'react';
import Button from 'material-ui/es/Button';
import { number, func } from 'prop-types';
import styles from './styles.scss';

class FilePickerFooter extends Component {
  static propTypes = {
    fileCount: number,
    onCancel: func,
    onSubmit: func
  };

  static defaultProps = {
    fileCount: 0
  };

  render() {
    return (
      <div className={styles.filePickerFooter}>
        <Button onClick={this.props.onCancel}>Cancel</Button>
        <Button
          raised
          disabled={this.props.fileCount < 1}
          color="primary"
          onClick={this.props.onSubmit}
        >
          Upload
        </Button>
      </div>
    );
  }
}

export default FilePickerFooter;
