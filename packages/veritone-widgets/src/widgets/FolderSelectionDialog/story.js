import React  from 'react';
//import { func } from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '@material-ui/core/Button';
import BaseStory from '../../shared/BaseStory';
import FolderSelectionDialog, {FolderSelectionDialogWidget} from './';


const DialogButton = (
  { handleOpen } // eslint-disable-line
) => (
  <Button variant="contained" onClick={handleOpen}>
    Open Dialog
  </Button>
);

class Story extends React.Component {
  state = {
    isOpen: false,
  };

  handleOpen = () => {

    this.setState(prevState => ({
      isOpen: true,
    }));

  };

  handleClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  


  render() {
    return (
      <div>
      
        <DialogButton handleOpen={this.handleOpen} />
        <FolderSelectionDialog
          open={this.state.isOpen}
          onCancel={this.handleClose}
        />
      </div>
    );
  }
}

storiesOf('FolderSelectionDialog', module).add('Base', () => {

  return (
    <BaseStory
        widget={FolderSelectionDialogWidget} 
        widgetProps={{
          onCancel: action('onCancel')
        }}
        widgetInstanceMethods={{
          open: instance => instance.open()
        }}
        componentClass={Story}
        
    />
  );
});


