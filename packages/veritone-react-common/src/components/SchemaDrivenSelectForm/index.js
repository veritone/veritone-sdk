import React from 'react';
import { has } from 'lodash';

import {
  any, 
  arrayOf, 
  objectOf,
  func,
  string
} from 'prop-types';

import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import {FormHelperText, FormControl} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';

import styles from './styles.scss';


export default class DynamicSelect extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired, //pass in the array of source types and their schemas
    formCallback: func.isRequired, //used to provide state to the parent
    initialValues: objectOf(any), // if the sourceType is for editing, pass in an object mapping the fields to a value, currently under "details" from a graphql source query
    errorFields: objectOf(any), // since the parent handles the submit button, the parent can pass down which fields are in an error state
    helperText: string,
    selectLabel: string
  };
  static defaultProps = {
    initialValues: {}
  };

  state = {
    oneSourceType: false,
    currentSourceTypeIndex: 0,
    currentFields: {},
  };

  componentWillMount = () => {
    if (!this.props.sourceTypes.length) { //TODO: currently will error out and not render if sourceTypes is empty
      console.error('Source types was empty.');
    } else if (this.props.sourceTypes.length === 1) {
      this.setState({
        oneSourceType: true
      });
    }  
    let initialize = {
      sourceTypeId: this.props.sourceTypes[this.state.currentSourceTypeIndex].id,
      sourceTypeIndex: this.state.currentSourceTypeIndex,
      fieldValues: this.state.currentFields
    }
    this.props.formCallback(initialize);
  };

  triggerCallback = () => {
    let toSend = {
      sourceTypeId: this.props.sourceTypes[this.state.currentSourceTypeIndex].id,
      sourceTypeIndex: this.state.currentSourceTypeIndex,
      fieldValues: this.state.currentFields
    };
    this.props.formCallback(toSend);
  };

  handleSourceTypeChange = (event) => {
    let index = event.target.value;
    let currentFields = {};
    let properties = this.props.sourceTypes[index].sourceSchema.definition.properties;
    Object.keys(properties).map((field, index) => {
      currentFields[field] = null;
    }) 
    this.setState({
      currentSourceTypeIndex: index,
    }, this.triggerCallback);
  };

  handleFieldChange = fieldId => (event) => {
    let fieldCopy = {};
    fieldCopy[fieldId] = event.target.value;
    this.setState({
      currentFields: Object.assign({}, this.state.currentFields, fieldCopy)
    }, this.triggerCallback);
  };

  handleTooltip = () => {
    console.log('tooltip clicked');
  };
  
  renderFields = (currentSourceTypeIndex) => {
    let definition = this.props.sourceTypes[currentSourceTypeIndex].sourceSchema.definition;
    let properties = definition.properties;
    let requiredFields = [];
    if (has(definition,'required')) {
      requiredFields = definition.required;
    }
    return Object.keys(properties).map((fieldId, index) => {
      return (<SourceTypeField 
                id={fieldId} 
                type={properties[fieldId].type.toLowerCase()} 
                required={requiredFields.indexOf(fieldId) === -1 ? false : true} 
                value={has(this.props.initialValues, fieldId) ? this.props.initialValues[fieldId] : undefined} 
                onChange={this.handleFieldChange} 
                title={properties[fieldId].title ? properties[fieldId].title : '' } 
                error={(has(this.props.errorFields, fieldId) && this.props.errorFields[fieldId]) ? true : false} 
                key={index} />);
    });
  };

  render() {
    const sourceTypes = this.props.sourceTypes.map((type, index) => {
      return <MenuItem value={index} id={type.id} key={index}>{type.name}</MenuItem>
    });
    return (
      <FormControl className={styles.dynamicFormStyle}>
        {(this.props.selectLabel && !this.state.oneSourceType) && <InputLabel className={styles.inputLabel} htmlFor='select-id'>{this.props.selectLabel}</InputLabel>}
        {!this.state.oneSourceType && <Select 
          className={styles.selectField}
          fullWidth
          inputProps={{name: this.props.sourceTypes[this.state.currentSourceTypeIndex].name, id:'select-id' }}
          value={this.state.currentSourceTypeIndex}
          onChange={this.handleSourceTypeChange}
        >
          {sourceTypes}
        </Select>}
        {this.state.oneSourceType && <div className={styles.sourceTypeNameLabel}>Source Type</div>}
        {this.state.oneSourceType && 
          <div className={styles.sourceTypeNameContainer}>
            <div className={styles.sourceTypeName}>{this.props.sourceTypes[this.state.currentSourceTypeIndex].name}</div>
            <div className={styles.sourceTypeNameTooltip} onClick={this.handleTooltip}>Why can't I change this?</div>
          </div>}
        {(this.props.helperText && !this.state.oneSourceType) && <FormHelperText>{this.props.helperText}</FormHelperText>}
        {this.renderFields(this.state.currentSourceTypeIndex)}
      </FormControl>
    );
  };
}

// This functional component will handle field type render logic, TODO: add fields here as needed for different field types
function SourceTypeField({id, type, required, value, onChange, title, error}) {
  //all types will be lowercase
  let element;
  if (!title) {
    title = id;
  }
  if (type.includes('string')) {
    element = (
      <TextField
        className={styles.textFieldExtra}
        type={id.toLowerCase().includes('password') ? 'password': 'text'}
        fullWidth
        margin='dense'
        id={id}
        label={title}
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
        label={title}
        value={value}
        error={error}
        key={id}
        onChange={onChange(id)}
      />
    );
  }

  return React.cloneElement(element, {required: required});
}