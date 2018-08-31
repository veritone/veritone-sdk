import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { string, arrayOf, func, shape, objectOf, bool } from 'prop-types';
import styles from './styles.scss';

export default class BulkAddAffiliatesDialog extends Component {
  static propTypes = {
    affiliates: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        schedule: shape({
          scheduleType: string,
          start: string,
          end: string,
          repeatEvery: shape({
            number: string,
            period: string
          }),
          weekly: shape({
            selectedDays: objectOf(bool)
          })
        }).isRequired
      })
    ),
    onAdd: func,
    onClose: func
  };

  static defaultProps = {
    affiliates: []
  };

  openFilePicker = () => {
    console.log('openFilePicker');
  };

  handleBulkAddAffiliates = () => {
    if (!this.props.affiliates.length) {
      this.props.onAdd([]);
      return;
    }
    console.log('handleBulkAddAffiliates');
    this.props.onAdd([]);
  };

  render() {
    const { onClose } = this.props;

    return (
      <div>
        <Dialog
          open
          onClose={onClose}
          disableBackdropClick
          aria-labelledby="bulk-add-affiliates-dialog"
          classes={{
            paper: styles.bulkAddAffiliatesDialogPaper
          }}
        >
          <DialogTitle
            classes={{
              root: styles.dialogTitle
            }}
          >
            <div>Bulk Add Affiliates</div>
            <IconButton onClick={onClose} aria-label="Close">
              <Icon className="icon-close-exit" />
            </IconButton>
          </DialogTitle>
          <DialogContent
            classes={{
              root: styles.dialogContent
            }}
          >
            <div className={styles.bulkAddHelperText}>
              Use the provided template to bulk add affiliates.
            </div>
          </DialogContent>
          <DialogActions
            classes={{
              root: styles.actionButtons,
              action: styles.actionButton
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={this.openFilePicker}
              classes={{
                label: styles.actionButtonLabel
              }}
            >
              <Icon className="icon-cloud_upload" />
              Browse To Upload
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
