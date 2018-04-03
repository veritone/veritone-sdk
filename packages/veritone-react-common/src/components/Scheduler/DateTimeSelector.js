import React from 'react';
import { string } from 'prop-types';
import { Field, FormSection } from 'redux-form';
import { FormGroup } from 'material-ui/Form';

import DateTimePicker from '../formComponents/DateTimePicker';
import LabeledInputGroup from './LabeledInputGroup';
import styles from './styles.scss';

const DateTimeSelector = ({ name, label }) => (
  <FormSection name={name}>
    <LabeledInputGroup label={label}>
      <FormGroup className={styles.inputsGroup}>
        <Field
          name="dateTime"
          component={DateTimePicker}
          className={styles.leftInput}
        />
      </FormGroup>
    </LabeledInputGroup>
  </FormSection>
);

DateTimeSelector.propTypes = {
  name: string,
  label: string
};

export default DateTimeSelector;
