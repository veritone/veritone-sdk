import React from 'react';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import Today from '@material-ui/icons/Today';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { capitalize } from 'lodash';
import cx from 'classnames';
import DialogActions from '@material-ui/core/DialogActions';
import { any, bool, string, func, shape, objectOf } from 'prop-types';
import { Checkbox, TextField, TimeRangePicker } from '../../../formComponents';
import styles from './styles.scss';

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const EditAffiliateForm = reduxForm({
  form: 'affiliate',
  initialValues: {}
})(({ handleSubmit, onCancel, children, submitting, invalid }) => (
  <form onSubmit={handleSubmit}>
    <div className={styles.scheduleConfig}>
      <div className={styles.scheduleDateFieldSection}>
        <FormLabel
          focused={false}
          classes={{
            root: styles.scheduleDateFieldLabel
          }}
        >
          Schedule Start Date
        </FormLabel>
        <Today className={styles.todayIcon} />
        <Field type="date" name="schedule.start" component={TextField} />
      </div>
      <div className={styles.scheduleDateFieldSection}>
        <FormLabel
          focused={false}
          classes={{
            root: styles.scheduleDateFieldLabel
          }}
        >
          Schedule End Date
        </FormLabel>
        <Today className={styles.todayIcon} />
        <Field
          type="date"
          name="schedule.end"
          component={TextField}
          InputProps={{
            classes: {
              input: styles.dateFieldInput
            }
          }}
        />
      </div>
      <div className={styles.scheduleTitle}>Schedule</div>
      {days.map(d => (
        <div
          key={d}
          className={cx(
            styles.timeRangeContainer,
            styles.weekSelectionContainer
          )}
        >
          <div style={{ width: 150 }}>
            <Field
              component={Checkbox}
              color="primary"
              name={`schedule.weekly.selectedDays.${d}`}
              label={capitalize(d)}
            />
          </div>
          <FieldArray
            name={`schedule.weekly.${d}`}
            component={MultiTimeRange}
          />
        </div>
      ))}
    </div>
    <br />
    <DialogActions
      classes={{
        root: styles.actionButtons,
        action: styles.actionButton
      }}
    >
      <Button
        classes={{
          label: styles.actionButtonLabel
        }}
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        color="primary"
        disabled={submitting || invalid}
        classes={{
          label: styles.actionButtonLabel
        }}
      >
        Save
      </Button>
    </DialogActions>
  </form>
));

EditAffiliateForm.propTypes = {
  handleCancel: func,
  initialValues: shape({
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
  }),
  onSubmit: func
};

const MultiTimeRange = ({ fields, readOnly }) => {
  /* eslint-disable react/jsx-no-bind */
  return (
    <div className={styles.multiTimeRange}>
      {fields.map((field, index) => (
        <div key={field} className={styles.row}>
          <Field name={field} component={TimeRangePicker} readOnly={readOnly} />
          {(index > 0 || fields.length > 1) && (
            <IconButton onClick={() => fields.remove(index)}>
              <ClearIcon />
            </IconButton>
          )}
          {!readOnly &&
            index === fields.length - 1 && (
              <IconButton
                type="button"
                onClick={() =>
                  fields.push({
                    start: '',
                    end: ''
                  })
                }
              >
                <AddIcon />
              </IconButton>
            )}
        </div>
      ))}
    </div>
  );
};

MultiTimeRange.propTypes = {
  fields: objectOf(any),
  readOnly: bool
};

export default EditAffiliateForm;
