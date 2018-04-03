import React from 'react';
// import { any, objectOf, func } from 'prop-types';
import { reduxForm, Field, formValues } from 'redux-form';
import {
  FormHelperText,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup
} from 'material-ui/Form';
import Radio from 'material-ui/Radio';

import DateTimePicker from '../formComponents/DateTimePicker';
import RadioGroup from '../formComponents/RadioGroup';
import styles from './styles.scss';

@reduxForm({
  form: 'scheduler',
  initialValues: {
    scheduleType: 'immediate'
  }
})
@formValues('scheduleType')
export default class Scheduler extends React.Component {
  render() {
    const activeSection = {
      recurring: <div>recurring section</div>,
      continuous: <div>continuous section</div>,
      immediate: <div>immediate section</div>,
      ondemand: <div>ondemand section</div>,
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
        { activeSection }
      </div>
    );
  }
}
