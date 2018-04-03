import React from 'react';
import { string } from 'prop-types';
import { Field, FormSection } from 'redux-form';
import { MenuItem } from 'material-ui/Menu';
import { FormGroup } from 'material-ui/Form';

import TextField from '../formComponents/TextField';
import Select from '../formComponents/Select';
import LabeledInputGroup from './LabeledInputGroup';
import styles from './styles.scss';

const TimePeriodSelector = ({ name, label }) => (
  <FormSection name={name}>
    <LabeledInputGroup label={label}>
      <FormGroup className={styles.inputsGroup}>
        <Field
          name="number"
          type="number"
          component={TextField}
          className={styles.leftInput}
        />
        <Field component={Select} name="period" className={styles.rightInput}>
          <MenuItem value="hours">Hours</MenuItem>
          <MenuItem value="days">Days</MenuItem>
          <MenuItem value="weeks">Weeks</MenuItem>
        </Field>
      </FormGroup>
    </LabeledInputGroup>
  </FormSection>
);

TimePeriodSelector.propTypes = {
  name: string,
  label: string
};

export default TimePeriodSelector;
