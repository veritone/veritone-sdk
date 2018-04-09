import React from 'react';
import { oneOf } from 'prop-types';
import { reduxForm, Field, formValues } from 'redux-form';
import { withProps } from 'recompose';
import { FormControlLabel } from 'material-ui/Form';
import Radio from 'material-ui/Radio';

import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';
import RadioGroup from '../formComponents/RadioGroup';
import styles from './styles.scss';
import ImmediateSection from './ImmediateSection';
import RecurringSection from './RecurringSection';
import OnDemandSection from './OnDemandSection';
import ContinuousSection from './ContinuousSection';

@withMuiThemeProvider
@withProps(props => ({
  initialValues: {
    // merge initial values configured by user w/ initials needed by the form
    ...props.initialValues,
    daily: [
      {
        start: '00:00',
        end: '01:00'
      }
    ],
    weekly: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].reduce(
      (r, day) => ({ ...r, [day]: [{ start: '', end: '' }] }),
      {}
    )
  }
}))
@reduxForm()
@formValues('scheduleType')
export default class Scheduler extends React.Component {
  static propTypes = {
    scheduleType: oneOf(['recurring', 'continuous', 'immediate', 'ondemand'])
      .isRequired
  };
  render() {
    const ActiveSectionComponent = {
      recurring: RecurringSection,
      continuous: ContinuousSection,
      immediate: ImmediateSection,
      ondemand: OnDemandSection
    }[this.props.scheduleType];

    return (
      <div>
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
      </div>
    );
  }
}
