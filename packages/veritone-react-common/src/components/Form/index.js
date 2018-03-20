import React from 'react';
import {
  string,
  func,
  objectOf
} from 'prop-types';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';
import FormControl from 'material-ui/Form/FormControl';

@withMuiThemeProvider
export default class Form extends React.Component {
  // TODO: handle dynamic selects where it will populate different fields for each selection
  static propTypes = {
    formName: string, // the name to put as the title of the form, not required
    fields: objectOf(string).isRequired, // the field names of the form, i.e. username, password... key = fieldId, value = fieldName
    values: objectOf(string), // any default values the form should come with (doesn't need to define all of them), key = fieldId, value = fieldValue
    fieldTypes: objectOf(string).isRequired, // tells the type of input of each field so we know what form component to use, key = fieldId, value = fieldType
    submitName: string, // name of the submit button, defaults to submit
    submitCallback: func.isRequired // will pass the object of key = fieldId, value = fieldValue
  };

  static defaultProps = {

  };

  state = {
    
  };

  componentWillMount = () => {
    // TODO: error check the props

    // initialize field values in the state
    let toMergeState = {};
    Object.keys(this.props.fields).forEach(fieldId => {
      toMergeState[fieldId] = this.props.values[fieldId] || '';
    });
    this.setState(toMergeState);
  };

  handleTextChange = fieldId => event => {
    let fieldTextCopy = {};
    fieldTextCopy[fieldId] = event.target.value;
    this.setState(
      Object.assign({}, this.state, fieldTextCopy)
    );
  };

  render() {
    const fields = Object.keys(this.props.fields).map((fieldId, index) => {
      // enumerate necessary values
      let fieldType = this.props.fieldTypes[fieldId];
      let fieldName= this.props.fields[fieldId];
      let fieldValue = this.props.values[fieldId] || '';

      // populate the fields based on field type
      if (fieldType == 'text' || fieldType == 'password') {
        // textField
        return <TextField
          className={styles.textField}
          type={fieldType === 'password' ? 'password' : 'text'}
          fullWidth
          margin='dense'
          id={fieldId}
          label={fieldName}
          value={this.state[fieldId]}
          key={index}
          onChange={this.handleTextChange(fieldId)}
        />
      } else {
        return; // do nothing if a type was wrong TODO: might be checked in error checking
      }
    });
    return (
      <form className={styles.formStyle}>
        {fields}
        <Button className={styles.buttonStyle} onClick={() => this.props.submitCallback(this.state)} raised color='primary' component='span'>
          {this.props.submitName || 'Submit'}
        </Button>
      </form>
    );
  };
}