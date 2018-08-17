import React from 'react';
import { oneOf, func, arrayOf } from 'prop-types';
import { reduxForm, Field, formValues, Form } from 'redux-form';
import {
  noop,
  pick,
  get,
  pickBy,
  mapValues,
  omit,
  difference,
  keys,
  constant
} from 'lodash';
import { withProps } from 'recompose';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { subDays } from 'date-fns';

import RadioGroup from '../formComponents/RadioGroup';
import styles from './styles.scss';
import ImmediateSection from './ImmediateSection';
import RecurringSection from './RecurringSection';
import OnDemandSection from './OnDemandSection';
import ContinuousSection from './ContinuousSection';

const initDate = new Date();

function getDefaultScheduleType(props) {
  // There may be inconsistencies in what scheduleType is currently selected and what's available
  // This logic selects the schedule type that's valid
  const scheduleType = props.initialValues && props.initialValues.scheduleType;

  // if scheduleType exists and is included in the list of supported types,
  // we're good
  if (
    scheduleType &&
    ((props.supportedScheduleTypes || []).includes('Any') ||
      (props.supportedScheduleTypes || []).includes(scheduleType))
  ) {
    return scheduleType;
  }

  if (!scheduleType) {
    // default to first supported type if not set
    return props.supportedScheduleTypes.includes('Any')
      ? 'Recurring' // recurring is default
      : props.supportedScheduleTypes[0]; // must specify at least one
  }

  // ScheduleType isn't supported by the current
  // supportedScheduleTypes list; fall back to the first supported type or
  // recurring by default.
  return get(props.supportedScheduleTypes, 0, 'Recurring');
}

@withProps(props => {
  const scheduleType = getDefaultScheduleType(props);

  return {
    // Handle empty array passed to supportedScheduleTypes
    supportedScheduleTypes:
      get(props.supportedScheduleTypes, 'length') === 0
        ? ['Any']
        : props.supportedScheduleTypes,
    initialValues: {
      // This provides defaults to the form. Shallow merged with
      // props.initialValues to allow overriding.
      scheduleType,
      start: get(props, 'initialValues.start')
        ? new Date(props.initialValues.start)
        : subDays(initDate, 3),
      end: get(props, 'initialValues.end')
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
          keys(get(props, 'initialValues.weekly'))
          // ... provide them with default start/end ranges
        ).reduce((r, day) => ({ ...r, [day]: [{ start: '', end: '' }] }), {}),
        // and assume any days given explicit initial values should be selected
        selectedDays: mapValues(
          get(props, 'initialValues.weekly'),
          constant(true)
        ),
        // then merge back with the days given explicit initial values in props
        ...get(props, 'initialValues.weekly')
      },
      // shallow-merge the properties we didn't have special merge logic for
      ...omit(props.initialValues, ['start', 'end', 'weekly', 'scheduleType'])
    }
  };
})
@reduxForm({
  form: 'scheduler'
})
@formValues('scheduleType')
class Scheduler extends React.Component {
  static propTypes = {
    scheduleType: oneOf(['Recurring', 'Continuous', 'Now', 'Once']).isRequired,
    onSubmit: func, // user-provided callback for result values
    handleSubmit: func.isRequired, // provided by redux-form
    supportedScheduleTypes: arrayOf(
      oneOf(['Recurring', 'Continuous', 'Now', 'Once', 'Any'])
    )
  };

  static defaultProps = {
    onSubmit: noop,
    supportedScheduleTypes: ['Any']
  };

  prepareResultData(formResult) {
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

  handleSubmit = vals => {
    this.props.onSubmit(this.prepareResultData(vals));
  };

  render() {
    const ActiveSectionComponent = {
      Recurring: RecurringSection,
      Continuous: ContinuousSection,
      Now: ImmediateSection,
      Once: OnDemandSection
    }[this.props.scheduleType];

    const showAllScheduleTypes = this.props.supportedScheduleTypes.includes(
      'Any'
    );

    return (
      <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
        <Field
          component={RadioGroup}
          name="scheduleType"
          className={styles.scheduleTypeContainer}
        >
          {(showAllScheduleTypes ||
            this.props.supportedScheduleTypes.includes('Recurring')) && (
            <FormControlLabel
              key="recurring"
              value="Recurring"
              control={<Radio color="primary" />}
              label="Recurring"
            />
          )}

          {(showAllScheduleTypes ||
            this.props.supportedScheduleTypes.includes('Continuous')) && (
            <FormControlLabel
              key="continuous"
              value="Continuous"
              control={<Radio color="primary" />}
              label="Continuous"
            />
          )}

          {(showAllScheduleTypes ||
            this.props.supportedScheduleTypes.includes('Now')) && (
            <FormControlLabel
              key="immediate"
              value="Now"
              control={<Radio color="primary" />}
              label="Immediate"
            />
          )}

          {(showAllScheduleTypes ||
            this.props.supportedScheduleTypes.includes('Once')) && (
            <FormControlLabel
              key="ondemand"
              value="Once"
              control={<Radio color="primary" />}
              label="On Demand"
            />
          )}
        </Field>
        <div className={styles.activeSectionContainer}>
          <ActiveSectionComponent />
        </div>
      </Form>
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

export default Scheduler;
