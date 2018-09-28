import React from 'react';
import { string, bool } from 'prop-types';
import { Field, FormSection, formValues } from 'redux-form';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import pluralize from 'pluralize';

import TextField from '../formComponents/TextField';
import Select from '../formComponents/Select';
import LabeledInputGroup from './LabeledInputGroup';
import styles from './styles.scss';

const TimePeriodSelector = ({ name, label, number, period, readOnly }) => (
  <FormSection name={name}>
    <LabeledInputGroup label={label}>
      <FormGroup className={styles.inputsGroup}>
        {period !== 'week' ? (
          <Field
            name="number"
            type="number"
            component={TextField}
            className={styles.leftInput}
            inputProps={{ readOnly }}
          />
        ) : null}
        <Field
          component={Select}
          name="period"
          className={styles.rightInput + ' ' + styles.periodSelect}
          readOnly={readOnly}
        >
          <MenuItem value="hour">{pluralize('Hours', Number(number))}</MenuItem>
          <MenuItem value="day">{pluralize('Days', Number(number))}</MenuItem>
          <MenuItem value="week">{pluralize('Weeks', Number(number))}</MenuItem>
        </Field>
      </FormGroup>
    </LabeledInputGroup>
  </FormSection>
);

TimePeriodSelector.propTypes = {
  name: string,
  label: string,
  number: string,
  period: string,
  readOnly: bool
};

export default formValues(props => ({
  period: `${props.name}.period`,
  number: `${props.name}.number`
}))(TimePeriodSelector);
