import React from 'react';
import { oneOf, func } from 'prop-types';
import { reduxForm, Field, formValues } from 'redux-form';
import { pick, get, pickBy } from 'lodash';
import { withProps } from 'recompose';
import { FormControlLabel } from 'material-ui/Form';
import Radio from 'material-ui/Radio';
import { subDays } from 'date-fns';

import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';
import RadioGroup from '../formComponents/RadioGroup';
import styles from './styles.scss';
import ImmediateSection from './ImmediateSection';
import RecurringSection from './RecurringSection';
import OnDemandSection from './OnDemandSection';
import ContinuousSection from './ContinuousSection';

const initDate = new Date();

@withMuiThemeProvider
@withProps(props => ({
  initialValues: {
    // This provides defaults to the form. Shallow merged with
    // props.initialValues to allow overriding.
    scheduleType: 'recurring',
    start: subDays(initDate, 3),
    end: initDate,
    maxSegment: {
      number: '5',
      period: 'week'
    },
    repeatEvery: {
      number: '1',
      period: 'day'
    },
    daily: [
      {
        start: '00:00',
        end: '01:00'
      }
    ],
    weekly: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].reduce(
      (r, day) => ({ ...r, [day]: [{ start: '', end: '' }] }),
      {}
    ),
    ...props.initialValues
  }
}))
@reduxForm()
@formValues('scheduleType')
export default class Scheduler extends React.Component {
  static propTypes = {
    scheduleType: oneOf(['recurring', 'continuous', 'immediate', 'ondemand'])
      .isRequired,
    handleSubmit: func.isRequired, // provided by redux-form
    onSubmit: func // user submit callback
  };

  prepareData = result => {
    const recurringPeriod = get(result, 'repeatEvery.period');
    const selectedDays = Object.keys(
      pickBy(
        get(result, 'weekly.selectedDays', {}),
        (day, included) => !!included
      )
    );

    const recurringRepeatSectionFields = {
      hour: [],
      day: ['daily'],
      week: selectedDays.map(day => `weekly.${day}`)
    }[recurringPeriod];

    const wantedFields = {
      recurring: [
        'scheduleType',
        'start',
        'end',
        'maxSegment',
        'repeatEvery',
        ...recurringRepeatSectionFields
      ],
      continuous: ['scheduleType', 'start', 'end', 'maxSegment'],
      immediate: ['scheduleType', 'maxSegment'],
      ondemand: ['scheduleType']
    }[result.scheduleType];

    return pick(result, wantedFields);
  };

  handleSubmit = result => {
    this.props.onSubmit(this.prepareData(result));
  };

  render() {
    const ActiveSectionComponent = {
      recurring: RecurringSection,
      continuous: ContinuousSection,
      immediate: ImmediateSection,
      ondemand: OnDemandSection
    }[this.props.scheduleType];

    return (
      <form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
        <div className={styles.header}>Set Ingestion Schedule</div>
        <Field
          component={RadioGroup}
          name="scheduleType"
          className={styles.scheduleTypeContainer}
        >
          <FormControlLabel
            value="recurring"
            control={<Radio />}
            label="Recurring"
          />
          <FormControlLabel
            value="continuous"
            control={<Radio />}
            label="Continuous"
          />
          <FormControlLabel
            value="immediate"
            control={<Radio />}
            label="Immediate"
          />
          <FormControlLabel
            value="ondemand"
            control={<Radio />}
            label="On Demand"
          />
        </Field>
        <div className={styles.activeSectionContainer}>
          <ActiveSectionComponent />
        </div>
      </form>
    );
  }
}
