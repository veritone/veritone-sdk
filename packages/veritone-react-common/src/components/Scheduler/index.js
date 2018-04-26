import React from 'react';
import { withTheme, createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import { oneOf, func, number, string, arrayOf } from 'prop-types';
import { reduxForm, Field, formValues, Form } from 'redux-form';
import blue from 'material-ui/colors/blue';
import {
  noop,
  pick,
  get,
  pickBy,
  mapValues,
  omit,
  difference,
  keys,
  constant,
  includes
} from 'lodash';
import { withProps } from 'recompose';
import { FormControlLabel } from 'material-ui/Form';
import Radio from 'material-ui/Radio';
import { subDays } from 'date-fns';

import RadioGroup from '../formComponents/RadioGroup';
import styles from './styles.scss';
import ImmediateSection from './ImmediateSection';
import RecurringSection from './RecurringSection';
import OnDemandSection from './OnDemandSection';
import ContinuousSection from './ContinuousSection';

const initDate = new Date();

@withProps(props => ({
  initialValues: {
    // This provides defaults to the form. Shallow merged with
    // props.initialValues to allow overriding.
    scheduleType: 'Recurring',
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
    ...omit(props.initialValues, ['start', 'end', 'weekly'])
  }
}))
@reduxForm({
  form: 'scheduler'
})
@formValues('scheduleType')
class Scheduler extends React.Component {
  static propTypes = {
    scheduleType: oneOf(['Recurring', 'Continuous', 'Now', 'Once'])
      .isRequired,
    onSubmit: func, // user-provided callback for result values
    handleSubmit: func.isRequired, // provided by redux-form
    supportedScheduleTypes: arrayOf(string),
    relativeSize: number,  // optional - used to scale text sizes from hosting app
    color: string
  };

  static defaultProps = {
    onSubmit: noop,
    relativeSize: 14,
    color: '#2196F3',
    supportedScheduleTypes: ['any']
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

  getTheme = ( { color, relativeSize } ) => {
    const theme = createMuiTheme({
      typography: {
        htmlFontSize: relativeSize || 13,
        subheading: {
          fontSize: '1em'
        }
      },
      palette: {
        primary: {
          light: blue[300],
          main: blue[500],
          dark: blue[700]
        },
        secondary: {
          light: blue[300],
          main: blue[500],
          dark: blue[700]
        }
      },
    });
    return theme;
  }

  render() {
    const ActiveSectionComponent = {
      Recurring: RecurringSection,
      Continuous: ContinuousSection,
      Now: ImmediateSection,
      Once: OnDemandSection
    }[this.props.scheduleType];

    const RecurringSelection = (
      <FormControlLabel
        key="recurring"
        value="Recurring"
        control={<Radio />}
        label="Recurring"
      />
    );

    const ContinuousSelection = (
      <FormControlLabel
        key="continuous"
        value="Continuous"
        control={<Radio />}
        label="Continuous"
      />
    );

    const ImmediateSelection = (
      <FormControlLabel
        key="immediate"
        value="Now"
        control={<Radio />}
        label="Immediate"
      />
    );

    const OnDemandSelection = (
      <FormControlLabel
        key="ondemand"
        value="Once"
        control={<Radio />}
        label="On Demand"
      />
    );

    const ScheduleTypeSelection = {
      recurring: RecurringSelection,
      continuous: ContinuousSelection,
      immediate: ImmediateSelection,
      'on demand': OnDemandSelection
    };

    let ScheduleSelections;
    if (includes(this.props.supportedScheduleTypes, 'any')) {
      ScheduleSelections = [RecurringSelection, ContinuousSelection, ImmediateSelection, OnDemandSelection];
    } else {
      ScheduleSelections = [];
      this.props.supportedScheduleTypes.forEach(type => {
        if (ScheduleTypeSelection[type]) {
          ScheduleSelections.push(ScheduleTypeSelection[type]);
        }
      })
    }

    return (
      <MuiThemeProvider theme={ this.getTheme( { color: this.props.color, relativeSize: this.props.relativeSize } ) }>
        <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
          <Field
            component={RadioGroup}
            name="scheduleType"
            className={styles.scheduleTypeContainer}
          >
            { ScheduleSelections }
          </Field>
          <div className={styles.activeSectionContainer}>
            <ActiveSectionComponent />
          </div>
        </Form>
      </MuiThemeProvider>
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

export default withTheme()(Scheduler);
