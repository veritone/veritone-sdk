import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { get } from 'lodash';
import { string, arrayOf, func, shape } from 'prop-types';
import Scheduler from '../../../Scheduler';
import styles from './styles.scss';

export default class EditAffiliateView extends Component {
  static propTypes = {
    affiliate: shape({
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
        daily: arrayOf(
          shape({
            start: string,
            end: string
          })
        ),
        weekly: shape({
          selectedDays: arrayOf(string)
        })
      }).isRequired
    }),
    onSave: func,
    onClose: func
  };

  static defaultProps = {
    affiliate: {}
  };

  state = {
    affiliate: {
      ...this.props.affiliate
    }
  };

  render() {
    const { onClose } = this.props;
    const { affiliate } = this.state;

    // TODO: use when ready
    // eslint-disable-next-line no-unused-vars
    const { onSave } = this.props;

    return (
      <Dialog
        open
        onClose={onClose}
        disableBackdropClick
        aria-labelledby="edit-affiliate-dialog"
        classes={{
          paper: styles.editAffiliateDialogPaper
        }}
      >
        <DialogTitle
          classes={{
            root: styles.dialogTitle
          }}
        >
          <div>{affiliate.name}</div>
          <div className={styles.dialogTitleActions}>
            <IconButton onClick={onClose} aria-label="Close">
              <Icon className="icon-close-exit" />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent
          classes={{
            root: styles.dialogContent
          }}
        >
          <div className={styles.affiliateConfiguration}>
            <Scheduler
              scheduleType={get(affiliate, 'schedule.scheduleType')}
            />
          </div>
        </DialogContent>
        <DialogActions
          classes={{
            root: styles.actionButtons,
            action: styles.actionButton
          }}
        >
          <Button
            onClick={onClose}
            color="primary"
            classes={{
              label: styles.actionButtonLabel
            }}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSaveButtonClick}
            classes={{
              label: styles.actionButtonLabel
            }}
          >
            SAVE
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
