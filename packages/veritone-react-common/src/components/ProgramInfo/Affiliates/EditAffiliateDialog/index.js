import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { get, mapValues, omit, difference, keys, constant } from 'lodash';
import { format } from 'date-fns';
import { string, func, shape } from 'prop-types';
import EditAffiliateForm from './EditAffiliateForm.js';
import styles from './styles.scss';

const initDate = new Date();

export default class EditAffiliateDialog extends Component {
  static propTypes = {
    affiliate: shape({
      id: string.isRequired,
      name: string.isRequired,
      timeZone: string
    }),
    onSave: func.isRequired,
    onDelete: func,
    onClose: func.isRequired
  };

  static defaultProps = {
    affiliate: {}
  };

  state = {
    affiliate: {
      ...this.props.affiliate,
      schedule: {
        // This provides defaults to the form. Shallow merged with
        // props.initialValues to allow overriding.
        scheduleType: get(
          this.props.affiliate.schedule,
          'scheduleType',
          'Recurring'
        ),
        start: get(this.props.affiliate.schedule, 'start')
          ? format(new Date(this.props.affiliate.schedule.start), 'YYYY-MM-DD')
          : format(initDate, 'YYYY-MM-DD'),
        end: get(this.props.affiliate.schedule, 'end')
          ? format(new Date(this.props.affiliate.schedule.end), 'YYYY-MM-DD')
          : undefined,
        repeatEvery: {
          number: '1',
          period: 'week'
        },
        weekly: {
          // make sure we set a default start/end for any days which aren't given
          // explicit default values in props.initialValues.weekly
          ...difference(
            // for days not given explicit initial values in props,..
            [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday'
            ],
            keys(get(this.props.affiliate.schedule, 'weekly'))
            // ... provide them with default start/end ranges
          ).reduce(
            (r, day) => ({
              ...r,
              [day]: [
                { start: '', end: '', timeZone: this.props.affiliate.timeZone }
              ]
            }),
            {}
          ),
          // and assume any days given explicit initial values should be selected
          selectedDays: mapValues(
            get(this.props.affiliate.schedule, 'weekly'),
            constant(true)
          ),
          // then merge back with the days given explicit initial values in props
          ...get(this.props.affiliate.schedule, 'weekly')
        },
        // shallow-merge the properties we didn't have special merge logic for
        ...omit(this.props.affiliate.schedule, ['start', 'end', 'weekly'])
      }
    }
  };

  handleOnSubmit = affiliate => {
    this.props.onSave(affiliate);
  };

  render() {
    const { onDelete, onClose } = this.props;
    const { affiliate } = this.state;

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
          <EditAffiliateForm
            initialValues={affiliate}
            defaultTimeZone={affiliate.timeZone}
            onSubmit={this.handleOnSubmit}
            onDelete={onDelete}
            onCancel={onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }
}
