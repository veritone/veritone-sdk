import React from 'react';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { FilePicker as LibFilePicker } from 'veritone-react-common';

import * as filePickerModule from '../../redux/modules/filePicker';
import widget from '../../shared/widget';

class FilePickerDialog extends React.Component {
  static propTypes = {
    open: bool
  };

  render() {
    const { open, ...pickerProps } = this.props;
    return (
      <Dialog open={open}>
        <LibFilePicker {...pickerProps} />
      </Dialog>
    );
  }
}

@connect(
  state => ({
    open: filePickerModule.pickerOpen(state)
  }),
  { setPickerOpen: filePickerModule.setPickerOpen },
  null,
  { withRef: true }
)
class FilePickerWidget extends React.Component {
  static propTypes = {
    open: bool,
    setPickerOpen: func
  };

  open = () => {
    this.props.setPickerOpen(true);
  };

  close = () => {
    this.props.setPickerOpen(false);
  };

  render() {
    return (
      <FilePickerDialog open={this.props.open} onRequestClose={this.close} />
    );
  }
}

export default widget(FilePickerWidget);
