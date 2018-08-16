import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
  string,
  bool,
  func,
  any,
  instanceOf,
  oneOfType,
  oneOf,
  arrayOf,
  shape
} from 'prop-types';
import { isFunction, isArray, get, isUndefined, isString } from 'lodash';
import DateTimePicker from 'components/formComponents/DateTimePicker';

import styles from './styles.scss';

// This functional component will handle field type render logic
// TODO: add fields here as needed for different field types
export default class SourceTypeField extends React.Component {
  static propTypes = {
    id: string.isRequired,
    type: string.isRequired,
    title: string,
    value: any, // eslint-disable-line react/forbid-prop-types
    onChange: func,
    required: bool,
    options: arrayOf(any),
    query: string,
    peerSelection: arrayOf(any),
    getFieldOptions: func.isRequired,
    isDirty: bool
  };

  state = {
    options: isArray(this.props.options) ?
      this.props.options.map(e => {
        return isString(e) ? { id: e, name: e } : e
      }) : undefined
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    const { query, peerSelection } = this.props;
    if (query) {
      this.props.getFieldOptions(query).then(results => {
        const newState = {};
        if (isArray(results)) {
          newState.options = results.map(result => isString(result) ? { id: result, name: result } : result);
        }
        this.setState(newState);
      });
    }
  }

  handleChange = e => {
    const { id, type, ...rest } = this.props;
    if (isFunction(onChange)) {
      return onChange(e, id, { ...rest, type });
    }
  }

  render() {
    const { id, type, query, options, peerSelection, getFieldOptions, ...rest } = this.props;
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

    // Select Field Types
    let isMultiple = false;
    let filteredOptions = this.state.options;
    if (isArray(peerSelection)) {
      filteredOptions = isArray(this.state.options) && this.state.options.filter(result => !isUndefined(peerSelection.find(selection => selection === result.id)));
    }
    if (filteredOptions || query) {
      FieldTypeComponent = SelectField;
      isMultiple = type === 'array';
    }

    if (!FieldTypeComponent) {
      FieldTypeComponent = BaseField;
    }

    return <FieldTypeComponent id={id} onChange={this.handleChange} options={filteredOptions || []} multiple={isMultiple} {...rest} />;
  }
}

const SelectField = ({ id, title, value, onChange, options, multiple, required, isDirty, error, ...rest }) => {
  const inputProps = {
    name: title,
    id: 'schema-' + id,
    key: 'schema-' + id
  };
  return (
    <FormControl className={styles.selectContainer} required={required} error={isDirty && required && (isUndefined(value) || value === '')} {...rest}>
      <InputLabel htmlFor={'schema-' + id}>{title}</InputLabel>
      <Select
        multiple={multiple}
        value={multiple ? 
          (isArray(value) ? value : []) :
          value
        }
        required={required}
        onChange={onChange}
        disabled={!options || !options.length}
        {...inputProps}
        {...rest}
      >
        {
          (!required && !multiple) ? 
          (
            <MenuItem key="null"></MenuItem>
          ) : null
        }
        {isArray(options) && options.map(e => {
          return (
            <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

SelectField.propTypes = {
  id: string.isRequired,
  title: string,
  value: any,
  onChange: func.isRequired,
  options: arrayOf(any).isRequired,
  isDirty: bool
};

const DateTimeTypeField = ({ id, title, value, onChange, isDirty, ...rest }) => {
  return (
    <FormControl fullWidth className={styles.dateTimeContainer}>
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
  value: oneOfType([instanceOf(Date), oneOf([''])]),
  onChange: func
};

const BoolTypeField = ({ id, title, value, onChange, isDirty, ...rest }) => {
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
  value: oneOfType([bool, oneOf([''])]),
  onChange: func
};

const GeoPointField = props => {
  return <BaseField helperText="eg. 12.0, 2.0" {...props} />;
};

const NumberField = props => {
  return <BaseField {...props} type="number" />;
};

const BaseField = ({ id, title, isDirty, ...rest }) => {
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
