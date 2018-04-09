import React, { Fragment } from 'react';
import { shape, string, objectOf, bool, any } from 'prop-types';
import { formValues, Field, FieldArray } from 'redux-form';
import { capitalize } from 'lodash';

import Checkbox from '../formComponents/Checkbox';
import TimeRangePicker from '../formComponents/TimeRangePicker';
import DateTimeSelector from './DateTimeSelector';
import TimePeriodSelector from './TimePeriodSelector';
import styles from './styles.scss';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

@formValues('repeatEvery')
@formValues({ selectedDays: 'weekly.selectedDays' })
export default class ImmediateSection extends React.Component {
  static propTypes = {
    repeatEvery: shape({
      number: string.isRequired,
      period: string.isRequired
    }).isRequired,
    selectedDays: objectOf(bool)
  };

  render() {
    return (
      <Fragment>
        <div className={styles.formSectionRow}>
          <TimePeriodSelector name="repeatEvery" label="Repeat every" />
        </div>
        <div className={styles.formSectionRow}>
          <DateTimeSelector name="start" label="Starts" />
        </div>
        {this.props.repeatEvery.period === 'day' && (
          <Fragment>
            <FieldArray name="daily" component={MultiTimeRange} />
          </Fragment>
        )}
        {this.props.repeatEvery.period === 'week' && (
          <Fragment>
            {days.map(d => (
              <Fragment key={d}>
                <Field component={Checkbox} name={`weekly.selectedDays.${d}`} label={ capitalize(d) } />
                <FieldArray name={`weekly.${d}`} component={MultiTimeRange} />
              </Fragment>
            ))}
          </Fragment>
        )}
        <div className={styles.formSectionRow}>
          <DateTimeSelector name="end" label="Ends" />
        </div>
        <div className={styles.formSectionRow}>
          <TimePeriodSelector name="maxSegment" label="Max segment"/>
        </div>
      </Fragment>
    );
  }
}

const MultiTimeRange = ({ fields }) => {
  /* eslint-disable react/jsx-no-bind */
  return (
    <Fragment>
      {fields.map((field, index) => (
        <Fragment key={field}>
          <Field name={field} component={TimeRangePicker} />
          {(index > 0 || fields.length > 1) && (
            <button type="button" onClick={() => fields.remove(index)}>
              X
            </button>
          )}
        </Fragment>
      ))}
      <button
        type="button"
        onClick={() =>
          fields.push({
            start: '',
            end: ''
          })
        }
      >
        +
      </button>
    </Fragment>
  );
};

MultiTimeRange.propTypes = {
  fields: objectOf(any)
};
