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
    currentSourceType: number, // id of initial sourceType if there is a default 
    onSelectChange: func.isRequired, //used to provide state to the parent
    onSourceDetailChange: func.isRequired, //used to provide state to the parent
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

    if (!this.props.sourceTypes.length) {
      console.error('Source types was empty.');
    } else if (this.props.sourceTypes.length === 1) {
      state.oneSourceType = true
    }

    this.setState(state);
  };

  handleSourceTypeChange = (event) => {
    const sourceTypeIndex = event.target.value;
    this.props.onSelectChange(sourceTypeIndex);

    // if (sourceTypeIndex !== this.props.currentSourceType) {
    //   const currentFields = {};
    //   const properties = this.props.sourceTypes[sourceTypeIndex].sourceSchema.definition.properties;
    
    //   Object.keys(properties).forEach((field) => {
    //     currentFields[field] = '';
    //   });


    //   this.props.onFieldChange({
    //     sourceTypeId: this.props.sourceTypes[sourceTypeIndex].id,
    //     details: currentFields
    //   });
    // }
  };

  handleDetailChange = fieldId => (event) => {
    this.props.onSourceDetailChange({
      [fieldId]: event.target.value
    });
  };

  renderFields = () => {
    console.log('this.props:', this.props);
    const definition = this.props.sourceTypes[this.props.currentSourceType].sourceSchema.definition;
    const properties = definition.properties;
    const requiredFields = has(definition, 'required') ? definition.required : [];
    console.log('properties:', properties);
    return Object.keys(this.props.fieldValues).map((fieldId, index) => {
      console.log('fieldId:', fieldId);
      return (
        <SourceTypeField 
          id={fieldId} 
          type={properties[fieldId].type.toLowerCase()} 
          required={includes(requiredFields, fieldId)} 
          value={this.props.fieldValues[fieldId]}  
          onChange={this.handleDetailChange} 
          title={properties[fieldId].title || ""} 
          error={(has(this.props.errorFields, fieldId) && this.props.errorFields[fieldId]) ? true : false} 
          key={fieldId}
        />
      );
    });
  };

  render() {
    const { sourceTypes, currentSourceType } = this.props;
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
              name: sourceTypes[currentSourceType].name,
              id:'select-id'
            }}
            value={currentSourceType}
            onChange={this.handleSourceTypeChange}
          >
            {sourceTypesMenu}
          </Select>
        }
        {this.state.oneSourceType && 
          <div className={styles.sourceTypeNameLabel}>
            Source Type
          </div>}
        {this.state.oneSourceType && 
          <div className={styles.sourceTypeNameContainer}>
            <div className={styles.sourceTypeName}>
              {sourceTypes[currentSourceType].name}
            </div>
          </div>}
        {(this.props.helperText && !this.state.oneSourceType) &&
          <FormHelperText>{this.props.helperText}</FormHelperText>}
        {this.renderFields()}
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

  return required ? React.cloneElement(element, { required }) : element;
}
