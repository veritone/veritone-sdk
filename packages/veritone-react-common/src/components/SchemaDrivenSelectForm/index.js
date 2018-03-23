import React from 'react';

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
import InputLabel from 'material-ui/Input/InputLabel';

import styles from './styles.scss';


export default class DynamicSelect extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired, //pass in the array of source types and their schemas
    formCallback: func.isRequired, //used to provide state to the parent
    initialValues: objectOf(any), // if the sourceType is for editing, pass in an object mapping the fields to a value
    helperText: string,
    selectLabel: string
  };
  static defaultProps = {};

  state = {
    error: false,
    oneSourceType: false,
    currentSourceTypeIndex: 0,
    currentFields: {},
  };

  componentWillMount = () => {
    if (!this.props.sourceTypes.length) { //TODO: currently will error out and not render if sourceTypes is empty
      console.error('Source types was empty.');
      this.state.error = true;
    } else if (this.props.sourceTypes.length === 1) {
      this.state.oneSourceType = true;
    }
  };

  triggerCallback = () => {
    console.log(this.state.currentFields);
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
      currentFields[field] = null; // 
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
    let properties = this.props.sourceTypes[currentSourceTypeIndex].sourceSchema.definition.properties
    return Object.keys(properties).map((fieldId, index) => {
      return <SourceTypeField id={fieldId} type={properties[fieldId].type.toLowerCase()} value={this.props.initialValues[fieldId]} onChange={this.handleFieldChange} title={properties[fieldId].title ? properties[fieldId].title : '' } key={index} />
    });
  };

  render() {
    const sourceTypes = this.props.sourceTypes.map((type, index) => {
      return <MenuItem value={index} id={type.id} key={index}>{type.name}</MenuItem>
    });
    return (
      <FormControl className={styles.dynamicFormStyle} error={this.state.error}>
        {(this.props.selectLabel && !this.state.oneSourceType) && <InputLabel className={styles.inputLabel} htmlFor={'select-id'}>{this.props.selectLabel}</InputLabel>}
        {!this.state.oneSourceType && <Select 
          className={styles.selectField}
          fullWidth
          id={'select-id'}
          value={this.state.currentSourceTypeIndex}
          name={this.props.sourceTypes[this.state.currentSourceTypeIndex].name}
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
function SourceTypeField({id, type, value, onChange, title}) {
  //all types will be lowercase
  if (!title) {
    title = id;
  }
  if (type.includes('string')) {
    return (
      <TextField
        className={styles.textFieldExtra}
        type={id.toLowerCase().includes('password') ? 'password': 'text'}
        fullWidth
        margin='dense'
        id={id}
        label={title}
        value={value}
        key={id}
        onChange={onChange(id)}
      />
    );
  } else if (type.includes('number') || type.includes('integer')) {
    return (
      <TextField
        className={styles.textFieldExtra}
        type={'number'}
        fullWidth
        margin='dense'
        id={id}
        label={title}
        value={value}
        key={id}
        onChange={onChange(id)}
      />
    );
  }
}