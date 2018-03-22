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

import styles from './styles.scss';
import FormHelperText from 'material-ui/Form/FormHelperText';
import InputLabel from 'material-ui/Input/InputLabel';

export default class DynamicSelect extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired, //pass in the array of source types and their schemas
    formCallback: func.isRequired, //used to provide state to the parent
    helperText: string,
    selectLabel: string
  };
  static defaultProps = {};

  state = {
    currentSourceTypeIndex: 0,
    currentFields: {},
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
  
  renderFields = (currentSourceTypeIndex) => {
    let properties = this.props.sourceTypes[currentSourceTypeIndex].sourceSchema.definition.properties
    return Object.keys(properties).map((fieldId, index) => {
      return <SourceTypeField id={fieldId} type={properties[fieldId].type.toLowerCase()} onChange={this.handleFieldChange} title={properties[fieldId].title ? properties[fieldId].title : '' } key={index} />
    });
  };

  render() {
    const sourceTypes = this.props.sourceTypes.map((type, index) => {
      return <MenuItem value={index} id={type.id} key={index}>{type.name}</MenuItem>
    });
    return (
      <div className={styles.dynamicFormStyle}>
        <InputLabel className={styles.inputLabel} htmlFor={'select-id'}>{this.props.selectLabel ? this.props.selectLabel : ''}</InputLabel>
        <Select 
          className={styles.selectField}
          fullWidth
          id={'select-id'}
          value={this.state.currentSourceTypeIndex}
          name={this.props.sourceTypes[this.state.currentSourceTypeIndex].name}
          onChange={this.handleSourceTypeChange}
        >
          {sourceTypes}
        </Select>
        {this.props.helperText && <FormHelperText>{this.props.helperText}</FormHelperText>}
        {this.renderFields(this.state.currentSourceTypeIndex)}
      </div>
    );
  };
}

// This functional component will handle field type render logic, TODO: add fields here as needed
function SourceTypeField({id, type, onChange, title}) {
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
        // value={this.state.fieldText[id]}
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
        // value={this.state.fieldText[id]}
        key={id}
        onChange={onChange(id)}
      />
    );
  }
}