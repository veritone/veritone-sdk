import React from 'react';
import { has, includes, pick, get } from 'lodash';

import { any, arrayOf, objectOf, func, string, number, bool } from 'prop-types';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { DateTimePicker } from '../../../formComponents';

import styles from './styles.scss';

export default class DynamicSelect extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired, //pass in the array of source types and their schemas
    currentSourceType: number, // id of initial sourceType if there is a default
    onSelectChange: func.isRequired,
    onSourceDetailChange: func.isRequired,
    fieldValues: objectOf(any),
    errorFields: objectOf(any),
    helperText: string,
    selectLabel: string
  };
  static defaultProps = {
    fieldValues: {}
  };

  state = {
    oneSourceType: false
  };

  componentWillMount() {
    if (this.props.sourceTypes.length === 1) {
      this.setState({ oneSourceType: true });
    }
  }

  handleSourceTypeChange = event => {
    const sourceTypeIndex = event.target.value;
    this.props.onSelectChange(sourceTypeIndex);
  };

  handleDetailChange = fieldId => event => {
    this.props.onSourceDetailChange({
      [fieldId]: event.target.value
    });
  };

  renderFields = () => {
    const definition = get(
      this.props.sourceTypes[this.props.currentSourceType],
      'sourceSchema.definition'
    );
    const properties = definition && definition.properties;
    const requiredFields = has(definition, 'required')
      ? definition.required
      : [];

    if (!definition || !properties) {
      return [];
    }

    return Object.keys(this.props.fieldValues).map((fieldId, index) => {
      return (
        <SourceTypeField
          id={fieldId}
          type={properties[fieldId].type.toLowerCase()}
          required={includes(requiredFields, fieldId)}
          value={this.props.fieldValues[fieldId]}
          onChange={this.handleDetailChange(fieldId)}
          title={properties[fieldId].title || ''}
          error={
            has(this.props.errorFields, fieldId) &&
            this.props.errorFields[fieldId]
              ? true
              : false
          }
          key={fieldId}
        />
      );
    });
  };

  render() {
    const { sourceTypes, currentSourceType } = this.props;
    const sourceTypesMenu = sourceTypes.map((type, index) => {
      return (
        <MenuItem value={index} id={type.id} key={type.id}>
          {type.name}
        </MenuItem>
      );
    });

    return (
      <FormControl className={styles.dynamicFormStyle}>
        {this.props.selectLabel &&
          !this.state.oneSourceType && (
            <InputLabel className={styles.inputLabel} htmlFor="select-id">
              {this.props.selectLabel}
            </InputLabel>
          )}
        {!this.state.oneSourceType && (
          <Select
            className={styles.selectField}
            fullWidth
            inputProps={{
              name: sourceTypes[currentSourceType].name,
              id: 'select-id'
            }}
            value={currentSourceType}
            onChange={this.handleSourceTypeChange}
          >
            {sourceTypesMenu}
          </Select>
        )}
        {this.state.oneSourceType && (
          <div className={styles.sourceTypeNameLabel}>Source Type</div>
        )}
        {this.state.oneSourceType && (
          <div className={styles.sourceTypeNameContainer}>
            <div className={styles.sourceTypeName}>
              {sourceTypes[currentSourceType].name}
            </div>
          </div>
        )}
        {this.props.helperText &&
          !this.state.oneSourceType && (
            <FormHelperText>{this.props.helperText}</FormHelperText>
          )}
        {this.renderFields()}
      </FormControl>
    );
  }
}

// This functional component will handle field type render logic
// TODO: add fields here as needed for different field types
export function SourceTypeField({ id, type, required, title, ...rest }) {
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
      <div
        className={styles.unsupportedMsg}
      >{`Unsupported Type: ${type} for ${title}`}</div>
    );
  }

  if (type.includes('dateTime')) {
    return (
      <FormControl className={styles.dateTimeContainer}>
        <InputLabel
          className={styles.textFieldLabel + ' ' + styles.dateTimeLabel}
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
  id: string,
  type: string,
  required: bool,
  onChange: func,
  title: string
};
