import React, { Fragment } from 'react';
import { shape, string, objectOf, any } from 'prop-types';
import cx from 'classnames';
import { formValues, Field, FieldArray } from 'redux-form';
import { capitalize } from 'lodash';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import AddIcon from 'material-ui-icons/Add';
import TimeIcon from 'material-ui-icons/AccessTime';

import Checkbox from '../formComponents/Checkbox';
import TimeRangePicker from '../formComponents/TimeRangePicker';
import DateTimeSelector from './DateTimeSelector';
import TimePeriodSelector from './TimePeriodSelector';
import styles from './styles.scss';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

@formValues('repeatEvery')
@formValues({ selectedDays: 'weekly.selectedDays' })
export default class RecurringSection extends React.Component {
  static propTypes = {
    repeatEvery: shape({
      number: string.isRequired,
      period: string.isRequired
    }).isRequired
  };

  render() {
    return (
      <Fragment>
        <div className={styles.formSectionRow}>
          <TimePeriodSelector name="repeatEvery" label="Repeat every" />
        </div>

        <div className={styles.formSectionRow}>
          <DateTimeSelector name="start" label="Starts" showIcon />
        </div>

        {this.props.repeatEvery.period === 'day' && (
          <div className={styles.repeatContainer}>
            <div
              className={cx(
                styles.timeRangeContainer,
                styles.daySelectionContainer
              )}
            >
              <TimeIcon className={styles.timeIcon}/>
              <FieldArray name="daily" component={MultiTimeRange} />
            </div>
          </div>
        )}

        <div className={styles.repeatContainer}>
          {this.props.repeatEvery.period === 'week' &&
            days.map(d => (
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
                    name={`weekly.selectedDays.${d}`}
                    label={capitalize(d)}
                  />
                </div>
                <FieldArray name={`weekly.${d}`} component={MultiTimeRange} />
              </div>
            ))}
        </div>

        <div className={styles.formSectionRow}>
          <DateTimeSelector name="end" label="Ends" showIcon />
        </div>
      </Fragment>
    );
  }
}

const MultiTimeRange = ({ fields }) => {
  /* eslint-disable react/jsx-no-bind */
  return (
    <div className={styles.multiTimeRange}>
      {fields.map((field, index) => (
        <div key={field} className={styles.row}>
          <Field name={field} component={TimeRangePicker} />
          {(index > 0 || fields.length > 1) && (
            <IconButton
              onClick={() => fields.remove(index)}
              className={styles.iconButton}
            >
              <ClearIcon />
            </IconButton>
          )}
          {index === fields.length - 1 && (
            <IconButton
              type="button"
              onClick={() =>
                fields.push({
                  start: '',
                  end: ''
                })
              }
              className={styles.iconButton}
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
  fields: objectOf(any)
};
