import React from 'react';
import { string, bool } from 'prop-types';
import { Field } from 'redux-form';
import FormGroup from '@material-ui/core/FormGroup';

import DateTimePicker from '../formComponents/DateTimePicker';
import LabeledInputGroup from './LabeledInputGroup';
import styles from './styles.scss';

const DateTimeSelector = ({ name, label, showIcon, readOnly }) => (
  <LabeledInputGroup label={label} hasIconOffset={showIcon}>
    <FormGroup className={styles.inputsGroup}>
      <Field
        name={name}
        component={DateTimePicker}
        className={styles.leftInput}
        showTimezone
        showIcon={showIcon}
        readOnly={readOnly}
      />
    </FormGroup>
  </LabeledInputGroup>
);

DateTimeSelector.propTypes = {
  name: string,
  label: string,
  showIcon: bool,
  readOnly: bool
};

export default DateTimeSelector;
