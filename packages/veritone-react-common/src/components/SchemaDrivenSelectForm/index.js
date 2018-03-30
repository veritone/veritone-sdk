import React from 'react';
import { has, includes } from 'lodash';

import {
  any, 
  arrayOf, 
  objectOf,
  func,
  string,
  number
} from 'prop-types';

import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { FormHelperText, FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';

import styles from './styles.scss';


export default class DynamicSelect extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired, //pass in the array of source types and their schemas
    // sourceTypeId: string, // id of initial sourceType if there is a default 
    currentSource: number, // id of initial sourceType if there is a default 
    onInputChange: func.isRequired, //used to provide state to the parent
    fieldValues: objectOf(any), // if the sourceType is for editing, pass in an object mapping the fields to a value, currently under "details" from a graphql source query
    errorFields: objectOf(any), // since the parent handles the submit button, the parent can pass down which fields are in an error state
    helperText: string,
    selectLabel: string
  };
  static defaultProps = {
    fieldValues: {}
  };

  state = {
    oneSourceType: false,
  };

  componentWillMount() {
    const state = {};

    if (!this.props.sourceTypes.length) { //TODO: currently will error out and not render if sourceTypes is empty
      console.error('Source types was empty.');
    } else if (this.props.sourceTypes.length === 1) {
      state.oneSourceType = true
    }

    this.setState(state);
  };

  handleSourceTypeChange = (event) => {
    const sourceTypeIndex = event.target.value;

    if (sourceTypeIndex !== this.props.currentSource) {
      const currentFields = {};
      const properties = this.props.sourceTypes[sourceTypeIndex].sourceSchema.definition.properties;
    
      Object.keys(properties).forEach((field) => {
        currentFields[field] = '';
      });

      this.props.onInputChange({
        sourceTypeIndex,
        fieldValues: currentFields
      });
    }
  };

  handleFieldChange = fieldId => (event) => {
    this.props.onInputChange({
      fieldValues: {
        ...this.props.fieldValues,
        [fieldId]: event.target.value
      }
    });
  };

  handleTooltip = () => {
    console.log('tooltip clicked');
  };
  
  renderFields = () => {
    const definition = this.props.sourceTypes[this.props.currentSource].sourceSchema.definition;
    const properties = definition.properties;
    let requiredFields = [];

    if (has(definition,'required')) {
      requiredFields = definition.required;
    }

    return Object.keys(properties).map((fieldId, index) => {
      return (
        <SourceTypeField 
          id={fieldId} 
          type={properties[fieldId].type.toLowerCase()} 
          required={includes(requiredFields, fieldId)} 
          value={this.props.fieldValues[fieldId]}  
          onChange={this.handleFieldChange} 
          title={properties[fieldId].title || ""} 
          error={(has(this.props.errorFields, fieldId) && this.props.errorFields[fieldId]) ? true : false} 
          key={index}
        />
      );
    });
  };

  render() {
    const { sourceTypes, currentSource } = this.props;
    const sourceTypesMenu = sourceTypes.map((type, index) => {
      return (
        <MenuItem value={index} id={type.id} key={index}>
          {type.name}
        </MenuItem>
      );
    });

    return (
      <FormControl className={styles.dynamicFormStyle}>
        {
          (this.props.selectLabel && !this.state.oneSourceType) &&
          <InputLabel className={styles.inputLabel} htmlFor='select-id'>
            {this.props.selectLabel}
          </InputLabel>
        }
        {
          !this.state.oneSourceType && 
          <Select 
            className={styles.selectField}
            fullWidth
            inputProps={{
              name: sourceTypes[currentSource].name,
              id:'select-id'
            }}
            value={currentSource}
            onChange={this.handleSourceTypeChange}
          >
            {sourceTypesMenu}
          </Select>
        }
        {this.state.oneSourceType && 
          <div className={styles.sourceTypeNameLabel}>Source Type</div>}
        {this.state.oneSourceType && 
          <div className={styles.sourceTypeNameContainer}>
            <div className={styles.sourceTypeName}>{sourceTypes[currentSource].name}</div>
            <div className={styles.sourceTypeNameTooltip} onClick={this.handleTooltip}>
              {"Why can't I change this?"}
            </div>
          </div>}
        {(this.props.helperText && !this.state.oneSourceType) &&
          <FormHelperText>{this.props.helperText}</FormHelperText>}
        {this.renderFields(this.state.currentSourceTypeIndex)}
      </FormControl>
    );
  };
}

// This functional component will handle field type render logic, TODO: add fields here as needed for different field types
function SourceTypeField({ id, type, required, value, onChange, title, error }) {
  //all types will be lowercase
  let element;
  const label = title || id;

  if (type.includes('string')) {
    element = (
      <TextField
        className={styles.textFieldExtra}
        type={id.toLowerCase().includes('password') ? 'password': 'text'}
        fullWidth
        margin='dense'
        id={id}
        label={label}
        value={value}
        error={error}
        key={id}
        onChange={onChange(id)}
      />
    );
  } else if (type.includes('number') || type.includes('integer')) {
    element = (
      <TextField
        className={styles.textFieldExtra}
        type={'number'}
        fullWidth
        margin='dense'
        id={id}
        label={label}
        value={value}
        error={error}
        key={id}
        onChange={onChange(id)}
      />
    );
  }

  return React.cloneElement(element, { required: required });
}