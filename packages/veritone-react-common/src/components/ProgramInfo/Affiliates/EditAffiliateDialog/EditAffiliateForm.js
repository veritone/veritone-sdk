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
})(
  ({
    handleSubmit,
    onDelete,
    onCancel,
    defaultTimeZone,
    readOnly,
    children,
    submitting,
    invalid
  }) => (
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
          <Field
            type="date"
            name="schedule.start"
            component={TextField}
            disabled={readOnly}
          />
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
            disabled={readOnly}
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
                disabled={readOnly}
              />
            </div>
            <FieldArray
              name={`schedule.weekly.${d}`}
              defaultTimeZone={defaultTimeZone}
              component={MultiTimeRange}
              readOnly={readOnly}
            />
          </div>
        ))}
      </div>
      <br />
      <DialogActions
        classes={{
          root: styles.actionButtons
        }}
      >
        {onDelete && (
          <Button
            color="secondary"
            variant="contained"
            disabled={submitting}
            onClick={onDelete}
            classes={{
              label: styles.actionButtonLabel,
              root: styles.deleteActionButton,
              containedSecondary: styles.containedSecondaryColorOverride
            }}
          >
            Delete Affiliate
          </Button>
        )}
        <Button
          classes={{
            label: styles.actionButtonLabel,
            root: styles.actionButton
          }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={submitting || invalid}
          classes={{
            label: styles.actionButtonLabel,
            root: styles.actionButton
          }}
        >
          Save
        </Button>
      </DialogActions>
    </form>
  )
);

EditAffiliateForm.propTypes = {
  handleCancel: func,
  initialValues: shape({
    id: string.isRequired,
    name: string.isRequired,
    timeZone: string,
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
  defaultTimeZone: string,
  readOnly: bool,
  onSubmit: func
};

const MultiTimeRange = ({ fields, defaultTimeZone, readOnly }) => {
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
                    end: '',
                    timeZone: defaultTimeZone
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
  defaultTimeZone: string,
  readOnly: bool
};

export default EditAffiliateForm;
