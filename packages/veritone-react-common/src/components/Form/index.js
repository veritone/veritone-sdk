import React from 'react';
import {
  string,
  func,
  objectOf,
  any
} from 'prop-types';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import FormControl from 'material-ui/Form/FormControl';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';


import styles from './styles.scss';

//TODO: add dynamic select
@withMuiThemeProvider
export default class Form extends React.Component {
  // TODO: handle dynamic selects where it will populate different fields for each selection
  static propTypes = {
    formName: string, // the name to put as the title of the form, not required
    fields: objectOf(any).isRequired, // the field names of the form, i.e. username, password... key = fieldId, value = fieldName
                                      //    for select fields, they will instead be value = object(key = menu item id, value = menu item name)
                                      //    for dynamic select fields, they will also have value = object(key = "fields", value = object(same nested version of fields prop))
    defaultValues: objectOf(string), // any default values the form should come with (doesn't need to define all of them), key = fieldId, value = fieldValue
    fieldTypes: objectOf(any).isRequired, // tells the type of input of each field so we know what form component to use, key = fieldId, value = fieldType
    submitName: string, // name of the submit button, defaults to submit
    submitCallback: func.isRequired, // will pass the object of key = fieldId, value = fieldValue
    fieldIcons: objectOf(string) // provided icons mapped to the fieldId if you want an icon next to the field
  };

  static defaultProps = {};

  state = {};

  componentWillMount = () => {
    // TODO: error check the props

    // initialize field values in the state
    let toMergeState = {};
    Object.keys(this.props.fields).forEach(fieldId => {
      if (this.props.fieldTypes[fieldId].includes('select')) {
        toMergeState[fieldId] =  this.props.defaultValues[fieldId] || Object.keys(this.props.fields[fieldId])[0];
      } else {
        toMergeState[fieldId] = this.props.defaultValues[fieldId] || '';
      }
    });
    this.setState(toMergeState);
  };

  onSubmit = () => {
    this.props.submitCallback(this.state);
  };

  handleTextChange = fieldId => event => {
    let stateCopy = {};
    stateCopy[fieldId] = event.target.value;
    this.setState(
      Object.assign({}, this.state, stateCopy)
    );
  };

  handleTimeChange = fieldId => event => {
    let stateCopy = {};
    stateCopy[fieldId] = event.target.value;
    this.setState(
      Object.assign({}, this.state, stateCopy)
    );
  };

  handleSelectChange = fieldId => event => {
    console.log(fieldId);
    let stateCopy = {};
    stateCopy[fieldId] = event.target.value;
    this.setState(
      Object.assign({}, this.state, stateCopy)
    );
  };


  populateFields = () => {
    const fields = Object.keys(this.props.fields).map((fieldId, index) => {
      // enumerate necessary values
      console.log(this.state);
      let fieldType = this.props.fieldTypes[fieldId];
      let fieldName= this.props.fields[fieldId];
      let fieldValue = this.props.defaultValues[fieldId] || '';
  
      // populate the fields based on field type
      if (fieldType.includes('text') || fieldType.includes('password')) {
        // textField
        return (
          <TextField
            className={styles.textField}
            type={fieldType.includes('password') ? 'password' : 'text'}
            fullWidth
            margin='dense'
            id={fieldId}
            label={fieldName}
            value={this.state[fieldId]}
            key={index}
            onChange={this.handleTextChange(fieldId)}
          />
        );
      } else if (fieldType.includes('time') || fieldType.includes('date')) {
        // handle date time picker
        return (
          <TextField
            className={styles.textField}
            type='datetime-local'
            fullWidth
            margin='dense'
            id={fieldId}
            label={fieldName}
            // value={this.state[fieldId]}
            InputLabelProps={{
              shrink: true,
            }}
            key={index}
            onChange={this.handleTimeChange(fieldId, event)}
          />
        );
      } else if (fieldType.includes('select')) {
        // Handle the select field
        const items = Object.keys(this.props.fields[fieldId]).map((item, index) => {
          return <MenuItem value={item} key={index}>{this.props.fields[fieldId][item].value}</MenuItem>
        });
        console.log(this.state[fieldId]);
        return (
          <Select
            className={styles.selectField}
            value={this.state[fieldId]}
            onChange={this.handleSelectChange(fieldId)}
            key={index}
          >
            {items}
          </Select>
        )
      } else {
        return; // do nothing if a type was wrong TODO: might be checked in error checking
      }
    });
    return fields;
  } 


  render() {
    const fields = this.populateFields();
    return (
      <form className={styles.formStyle}>
        {fields}
        <Button className={styles.buttonStyle} onClick={this.onSubmit} raised color='primary' component='span'>
          {this.props.submitName || 'Submit'}
        </Button>
      </form>
    );
  };
}