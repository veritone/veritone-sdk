import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { string, bool, func, any, instanceOf } from 'prop-types';
import { isFunction } from 'lodash';
import DateTimePicker from 'components/formComponents/DateTimePicker';

import styles from './styles.scss';

// This functional component will handle field type render logic
// TODO: add fields here as needed for different field types
export default function SourceTypeField({ id, type, onChange, ...rest }) {
  function handleChange(e) {
    if (isFunction(onChange)) {
      return onChange(e, id, { ...rest, type });
    }
  }

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

  const foundSupportedType = supportedTypes.find(supportedType =>
    type.includes(supportedType)
  );

  if (!foundSupportedType) {
    return <UnsupportedTypeField type={type} {...rest} />;
  }

  let FieldTypeComponent = {
    dateTime: DateTimeTypeField,
    boolean: BoolTypeField,
    geoPoint: GeoPointField,
    number: NumberField,
    integer: NumberField
  }[foundSupportedType];

  if (!FieldTypeComponent) {
    FieldTypeComponent = BaseField;
  }

  return <FieldTypeComponent id={id} onChange={handleChange} {...rest} />;
}

SourceTypeField.propTypes = {
  id: string.isRequired,
  type: string.isRequired,
  title: string,
  value: any, // eslint-disable-line react/forbid-prop-types
  onChange: func,
  required: bool
};

const DateTimeTypeField = ({ id, title, value, onChange, ...rest }) => {
  return (
    <FormControl className={styles.dateTimeContainer}>
      <InputLabel className={styles.textFieldLabel} shrink htmlFor={id}>
        {title}
      </InputLabel>
      <DateTimePicker
        id={id}
        showIcon
        showTimezone
        input={{
          value: value ? new Date(value) : new Date(),
          onChange: onChange
        }}
        {...rest}
      />
    </FormControl>
  );
};

DateTimeTypeField.propTypes = {
  id: string.isRequired,
  title: string,
  value: instanceOf(Date),
  onChange: func
};

const BoolTypeField = ({ id, title, value, onChange, ...rest }) => {
  return (
    <FormControlLabel
      label={title}
      control={
        <Checkbox
          id={id}
          onChange={onChange}
          checked={value}
          color="primary"
          {...rest}
        />
      }
    />
  );
};

BoolTypeField.propTypes = {
  id: string.isRequired,
  title: string,
  value: bool,
  onChange: func
};

const GeoPointField = props => {
  return <BaseField helperText="eg. 12.0, 2.0" {...props} />;
};

const NumberField = props => {
  return <BaseField {...props} type="number" />;
};

const BaseField = ({ id, title, ...rest }) => {
  const inputProps = {
    label: title || id,
    fullWidth: true,
    margin: 'normal',
    type: id.toLowerCase().includes('password') ? 'password' : 'text'
  };

  return (
    <TextField
      id={id}
      key={id}
      InputLabelProps={{ className: styles.textFieldLabel }}
      {...inputProps}
      {...rest}
    />
  );
};

BaseField.propTypes = {
  id: string.isRequired,
  title: string
};

const UnsupportedTypeField = ({ type, title }) => {
  return (
    <div className={styles.unsupportedMsg}>
      {`Unsupported Type: ${type}${title ? ` for ${title}` : ''}`}
    </div>
  );
};

UnsupportedTypeField.propTypes = {
  type: string.isRequired,
  title: string
};
