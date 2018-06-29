import React from 'react';
import cx from 'classnames';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { string, bool, func } from 'prop-types';
import { pick } from 'lodash';
import DateTimePicker from 'components/formComponents/DateTimePicker';

import styles from './styles.scss';

// This functional component will handle field type render logic
// TODO: add fields here as needed for different field types
export default function SourceTypeField({
  id,
  type,
  required,
  title,
  ...rest
}) {
  const supportedTypes = [
    'object',
    'string',
    'number',
    'integer',
    'boolean',
    'array',
    'dateTime',
    'geoPoint'
  ];

  if (!supportedTypes.some(supportedType => type.includes(supportedType))) {
    return (
      <div className={styles.unsupportedMsg}>
        {`Unsupported Type: ${type}${title ? ` for ${title}` : ''}`}
      </div>
    );
  }

  if (type.includes('dateTime')) {
    return (
      <FormControl className={styles.dateTimeContainer}>
        <InputLabel
          className={cx(styles.textFieldLabel, styles.dateTimeLabel)}
          htmlFor={id}
        >
          {title}
        </InputLabel>
        <DateTimePicker
          id={id}
          showIcon
          showTimezone
          input={{
            value: rest.value ? new Date(rest.value) : new Date(),
            onChange: rest.onChange
          }}
          {...rest}
        />
      </FormControl>
    );
  }

  if (type.includes('boolean')) {
    return (
      <FormControlLabel
        label={title}
        control={
          <Checkbox
            id={id}
            {...pick(rest, ['onChange'])}
            checked={rest.value}
            color="primary"
          />
        }
      />
    );
  }

  const inputProps = {
    label: title || id,
    fullWidth: true,
    margin: 'normal'
  };

  if (required) {
    inputProps.required = true;
  }

  if (type.includes('string')) {
    inputProps.type = id.toLowerCase().includes('password')
      ? 'password'
      : 'text';
  } else if (type.includes('number') || type.includes('integer')) {
    inputProps.type = 'number';
  }

  if (type.includes('geoPoint')) {
    rest.helperText = 'eg. 12.0, 2.0';
  }

  return (
    <TextField
      id={id}
      key={id}
      InputLabelProps={{ className: styles.textFieldLabel }}
      {...inputProps}
      {...rest}
    />
  );
}

SourceTypeField.propTypes = {
  id: string.isRequired,
  type: string.isRequired,
  required: bool,
  onChange: func,
  title: string
};
