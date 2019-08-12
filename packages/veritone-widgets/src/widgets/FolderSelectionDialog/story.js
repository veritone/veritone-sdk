import React from 'react';
import { func } from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '@material-ui/core/Button';
import BaseStory from '../../shared/BaseStory';
import FolderSelectionDialog, { FolderSelectionDialogWidget } from './';

const DialogButton = (
  { handleOpen } // eslint-disable-line
) => (
  <Button variant="contained" onClick={handleOpen}>
    Open Dialog
  </Button>
);

class Story extends React.Component {
  static propTypes = {
    onSelect: func.isRequired
  };

  state = {
    isOpen: false,
    selectedFolder: null
  };

  handleOpen = () => {
    this.setState(prevState => ({
      isOpen: true
    }));
  };

  handleClose = () => {
    this.setState({
      isOpen: false
    });
  };

  onSelect = selectedFolder => {
    this.props.onSelect(selectedFolder);
    this.setState({ selectedFolder: selectedFolder });
  };

  render() {
    return (
      <React.Fragment>
        <DialogButton handleOpen={this.handleOpen} />
        <FolderSelectionDialog
          rootFolderType='cms'
          open={this.state.isOpen}
          onCancel={this.handleClose}
          onSelect={this.onSelect}
        />
      </React.Fragment>
    );
  }
}

function logSelectedFolder(folder) {
  console.log('selected Folder: ', folder);
}

storiesOf('FolderSelectionDialog', module).add('Base', () => {
  return (
    <BaseStory
      widget={FolderSelectionDialogWidget}
      widgetProps={{
        rootFolderType: "cms",
        onCancel: action('onCancel'),
        onSelect: action('onSelect')
      }}
      widgetInstanceMethods={{
        open: instance => instance.open()
      }}
      componentClass={Story}
      componentProps={{
        onSelect: logSelectedFolder
      }}
    />
  );
});
