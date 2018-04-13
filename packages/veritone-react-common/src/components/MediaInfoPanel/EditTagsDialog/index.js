import React, { Component } from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import Input from 'material-ui/Input';
import { string, arrayOf, bool, func, shape } from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withMuiThemeProvider from '../../../helpers/withMuiThemeProvider';
import TagPill from './tagPill';
import styles from './styles.scss';

@withMuiThemeProvider
class EditTagsDialog extends Component {
  static propTypes = {
    tags: arrayOf(
      shape({
        value: string
      })
    ),
    isOpen: bool,
    onSave: func,
    onClose: func
  };

  static defaultProps = {
    tags: []
  };

  state = {
    tags: this.props.tags || [],
    newTagTextAreaVisible: false,
    newTagValue: ''
  };

  onAddTag = () => {
    const newTagValue = this.state.newTagValue;
    if (!newTagValue || !newTagValue.length) {
      this.setState({
        newTagTextAreaVisible: false,
        newTagValue: ''
      });
      return;
    }
    const newTags = this.state.tags.slice();
    this.addTagAsUnique(newTagValue, newTags);
    this.setState({
      tags: newTags,
      newTagTextAreaVisible: false,
      newTagValue: ''
    });
  };

  addTagAsUnique = (tagValue, tags) => {
    if (tagValue && tagValue.length) {
      this.removeTag(tagValue, tags);
      tags.push({ value: tagValue });
    }
  };

  onRemoveTag = tagValue => {
    const newTags = this.state.tags.slice();
    this.removeTag(tagValue, newTags);
    this.setState({
      tags: newTags
    });
  };

  removeTag = (tagValue, tags) => {
    const tagIndex = tags.findIndex(tag => tag.value === tagValue);
    if (tagIndex >= 0) {
      tags.splice(tagIndex, 1);
    }
  };

  onSave = () => {
    const tagToSave = this.state.tags.slice();
    this.addTagAsUnique(this.state.newTagValue, tagToSave);
    console.log(tagToSave);
    this.props.onSave(tagToSave);
  };

  onCancel = () => {
    this.props.onClose();
  };

  hasPendingChanges = () => {
    return (
      JSON.stringify(this.state.tags) !== JSON.stringify(this.props.tags) ||
      (this.state.newTagTextAreaVisible &&
        this.state.newTagValue &&
        this.state.newTagValue.length)
    );
  };

  enableNewTagTextArea = () => {
    this.setState({
      newTagTextAreaVisible: true
    });
  };

  onNewTagValueChange = event => {
    this.setState({
      newTagValue: event.target.value
    });
  };

  onNewTagKeyDown = event => {
    if (event.key === 'Enter') {
      this.onAddTag();
    }
  };

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.onCancel}
        disableBackdropClick
        aria-labelledby="edit-tags-dialog"
        classes={{
          paper: styles.editTagsDialogPaper
        }}
      >
        <DialogTitle
          classes={{
            root: styles.dialogTitle
          }}
        >
          <div className={styles.dialogTitleLabel}>Edit Tags</div>
          <IconButton
            onClick={this.onCancel}
            aria-label="Close"
            classes={{
              root: styles.closeButton
            }}
          >
            <Icon className="icon-close-exit" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            classes={{
              root: styles.dialogHintText
            }}
          >
            Tags provide a useful way to group related media together and make
            it easier for people to find content.
          </DialogContentText>
          <div className={styles.tagsLabel}>Tags</div>
          <div className={styles.tagsSection}>
            {this.state.tags &&
              this.state.tags.map(tag => (
                <TagPill
                  className={styles.tagPill}
                  key={tag.value}
                  text={tag.value}
                  onRemove={this.onRemoveTag}
                />
              ))}
            {!this.state.newTagTextAreaVisible && (
              <span
                onClick={this.enableNewTagTextArea}
                className={styles.addNewTagButton}
              >
                Add New
              </span>
            )}
            {this.state.newTagTextAreaVisible && (
              <Input
                autoFocus
                value={this.state.newTagValue}
                onChange={this.onNewTagValueChange}
                classes={{
                  root: styles.tagTextInput
                }}
                inputProps={{
                  onKeyDown: this.onNewTagKeyDown
                }}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={this.onSave}
            color="primary"
            disabled={!this.hasPendingChanges()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditTagsDialog);
