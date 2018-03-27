import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { string, arrayOf, bool, func } from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styles from './styles.scss';

class EditTagsDialog extends Component {

  static propTypes = {
    tags: arrayOf(string),
    isOpen: bool,
    onSave: func,
    onClose: func
  };

  state = {
    tags: this.props.tags || []
  };

  onAddTag = (event) => {
    const newTags = this.state.tags.slice();
    newTags.push(event.target.value);
    this.setState({
      tags: newTags
    });
  };

  onRemoveTag = (event) => {
    const newTags = this.state.tags.slice();
    const tagToRemove = event.target.value;
    const tagIndex = newTags.indexOf(tagToRemove);
    if (tagIndex >= 0) {
      newTags.splice(tagIndex, 1);
    }
    this.setState({
      tags: newTags
    });
  };

  onSave = () => {
    this.props.onSave(this.state.tags);
  };

  hasPendingChanges = () => {
    return JSON.stringify(this.state.tags) == JSON.stringify(this.props.tags);
  };

  render () {
    return (
      <div className={styles.editTagsDialog}>
        <Dialog
          open={this.props.isOpen}
          onClose={this.props.onClose}
          aria-labelledby='edit-tags-dialog'
        >
          <DialogTitle id='edit-tags-dialog'>Edit Tags</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tags provide a useful way to group related media together and make it easier for people to find content.
            </DialogContentText>
            Tags
            <div className={styles.tagsSection}>
              {this.state.tags.map((tag, index) => <span key={index}>{tag}</span>)}
            </div>
            <span>Add New</span>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.onSave} color='primary' diabled={!this.hasPendingChanges()}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(EditTagsDialog);
