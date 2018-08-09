import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Input from '@material-ui/core/Input';
import { get } from 'lodash';
import { string, arrayOf, bool, func, shape } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TagPill from './tagPill';
import styles from './styles.scss';

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
    this.setState(prevState => {
      const newTags = prevState.tags.slice();
      this.addTagAsUnique(newTagValue, newTags);
      return {
        tags: newTags,
        newTagTextAreaVisible: false,
        newTagValue: ''
      };
    });
  };

  addTagAsUnique = (tagValue, tags) => {
    if (tagValue && tagValue.length) {
      this.removeTag(tagValue, tags);
      tags.push({ value: tagValue });
    }
  };

  onRemoveTag = tagValue => {
    this.setState(prevState => {
      const newTags = prevState.tags.slice();
      this.removeTag(tagValue, newTags);
      return {
        tags: newTags
      };
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
            {get(this.state, 'tags', []).filter(
              item => !item.hasOwnProperty('redactionStatus')
            ).length > 0 &&
              get(this.state, 'tags', [])
                .filter(item => !item.hasOwnProperty('redactionStatus'))
                .map(tag => {
                  if (tag.hasOwnProperty('value')) {
                    return (
                      <TagPill
                        key={tag.value}
                        text={tag.value}
                        onRemove={this.onRemoveTag}
                      />
                    );
                  } else if (Object.keys(tag).length) {
                    const tagKey = Object.keys(tag)[0];
                    return (
                      <TagPill
                        key={`${tagKey}:${tag[tagKey]}`}
                        text={`${tagKey}:${tag[tagKey]}`}
                      />
                    );
                  }
                })}
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
