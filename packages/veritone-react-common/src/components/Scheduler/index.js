import React from 'react';
import { compose } from 'redux';
import { oneOf, func } from 'prop-types';
import { reduxForm, Field, formValues } from 'redux-form';
import { pick, get, pickBy, mapValues, omit, difference, keys, constant } from 'lodash';
import { withProps, hoistStatics } from 'recompose';
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

const withDecorators = compose(
  ...[
    withMuiThemeProvider,
    withProps(props => ({
      initialValues: {
        // This provides defaults to the form. Shallow merged with
        // props.initialValues to allow overriding.
        scheduleType: 'Recurring',
        start: props.initialValues.start
          ? new Date(props.initialValues.start)
          : subDays(initDate, 3),
        end: props.initialValues.end
          ? new Date(props.initialValues.end)
          : initDate,
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
            keys(props.initialValues.weekly)
            // ... provide them with default start/end ranges
          ).reduce((r, day) => ({ ...r, [day]: [{ start: '', end: '' }] }), {}),
          // and assume any days given explicit initial values should be selected
          selectedDays: mapValues(props.initialValues.weekly, constant(true)),
          // then merge back with the days given explicit initial values in props
          ...props.initialValues.weekly,
        },
        // shallow-merge the properties we didn't have special merge logic for
        ...omit(props.initialValues, ['start', 'end', 'weekly'])
      }
    })),
    reduxForm({
      form: 'scheduler'
    }),
    formValues('scheduleType')
  ].map(hoistStatics)
);

@withDecorators
export default class Scheduler extends React.Component {
  static propTypes = {
    scheduleType: oneOf(['Recurring', 'Continuous', 'Now', 'Once'])
      .isRequired,
    handleSubmit: func.isRequired // provided by redux-form
  };

  static prepareResultData(formResult) {
    const recurringPeriod = get(formResult, 'repeatEvery.period');
    const selectedDays = Object.keys(
      pickBy(get(formResult, 'weekly.selectedDays', {}), included => !!included)
    );

    const recurringRepeatSectionFields = {
      hour: [],
      day: ['daily'],
      week: selectedDays.map(day => `weekly.${day}`)
    }[recurringPeriod];

    const wantedFields = {
      Recurring: [
        'scheduleType',
        'start',
        'end',
        'repeatEvery',
        ...recurringRepeatSectionFields
      ],
      Continuous: ['scheduleType', 'start', 'end'],
      Now: ['scheduleType'],
      Once: ['scheduleType']
    }[formResult.scheduleType];

    const result = pick(formResult, wantedFields);
    return result.scheduleType === 'Recurring'
      ? filterRecurringPeriods(result, recurringPeriod)
      : result;
  }

  render() {
    const ActiveSectionComponent = {
      Recurring: RecurringSection,
      Continuous: ContinuousSection,
      Now: ImmediateSection,
      Once: OnDemandSection
    }[this.props.scheduleType];

    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className={styles.header}>Set Ingestion Schedule</div>
        <Field
          component={RadioGroup}
          name="scheduleType"
          className={styles.scheduleTypeContainer}
        >
          <FormControlLabel
            value="Recurring"
            control={<Radio />}
            label="Recurring"
          />
          <FormControlLabel
            value="Continuous"
            control={<Radio />}
            label="Continuous"
          />
          <FormControlLabel
            value="Now"
            control={<Radio />}
            label="Immediate"
          />
          <FormControlLabel
            value="Once"
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

function filterRecurringPeriods(result, recurringPeriod) {
  if (recurringPeriod === 'hour') {
    return result;
  }

  if (recurringPeriod === 'day') {
    // filter out incomplete ranges that don't have both start and end
    return {
      ...result,
      daily: result.daily.filter(day => day.start && day.end)
    };
  }

  if (recurringPeriod === 'week') {
    return {
      ...result,
      weekly: pickBy(
        // filter out incomplete ranges that don't have both start and end
        mapValues(result.weekly, week =>
          week.filter(day => day.start && day.end)
        ),
        // remove days with no complete ranges
        schedules => !!schedules.length
      )
    };
  }

  return result;
}
