import React from 'react';
import { string } from 'prop-types';
import { Field } from 'redux-form';
import { FormGroup } from 'material-ui/Form';

import DateTimePicker from '../formComponents/DateTimePicker';
import LabeledInputGroup from './LabeledInputGroup';
import styles from './styles.scss';

const DateTimeSelector = ({ name, label }) => (
  <LabeledInputGroup label={label}>
    <FormGroup className={styles.inputsGroup}>
      <Field
        name={name}
        component={DateTimePicker}
        className={styles.leftInput}
        showTimezone
      />
    </FormGroup>
  </LabeledInputGroup>
);

DateTimeSelector.propTypes = {
  name: string,
  label: string
};

export default DateTimeSelector;
