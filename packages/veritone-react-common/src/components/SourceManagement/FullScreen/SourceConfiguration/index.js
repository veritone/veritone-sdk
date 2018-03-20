import React from 'react';

import {
  any, arrayOf, objectOf
} from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { FormControl, FormHelperText } from 'material-ui/Form';

import styles from './styles.scss';
import Input from 'material-ui/Input/Input';

@withMuiThemeProvider
export default class SourceConfiguration extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any))
  };
  static defaultProps = {};

  state = {
    sourceTypeSelection: this.props.sourceTypes[0].name || '', //should change to whatever the current source type is 
    sourceTypeFields: this.props.sourceTypes[0].fields || {},
    currentSourceTypeIndex: 0,
    sourceTypesIndex: [],
    fieldText: {},
    sourceName: ''
  };

  componentWillMount = () => {
    let storeSourceTypeIndex = [];
    this.props.sourceTypes.forEach(sourceType => {
      storeSourceTypeIndex.push(sourceType.name);
    });

    // keep a state of the field values
    let fieldText = {};
    Object.keys(this.state.sourceTypeFields).forEach((key) => {
      console.log(key);
      fieldText[key] = this.state.sourceTypeFields[key];
    });

    this.setState({
      sourceTypesIndex: storeSourceTypeIndex,
      fieldText: fieldText
    })
  };

  handleSourceTypeChange = (event) => {
    let selection = event.target.value;
    let index = this.state.sourceTypesIndex.indexOf(event.target.value);
    let fields = this.props.sourceTypes[index].fields;
    this.setState({
      sourceTypeSelection: selection,
      currentSourceTypeIndex: index,
      sourceTypeFields: fields
    });
  };

  handleNameChange = (event) => {
    console.log(event.target.value);
    this.setState({sourceName: event.target.value});
  };

  handleTextChange = field => event => {
    let fieldTextCopy = {};
    fieldTextCopy[field] = event.target.value;
    this.setState((prevState, props) => ({
      fieldText: Object.assign({}, prevState.fieldText, fieldTextCopy)
    }));
  };

  handleSaveConfiguration = () => {
    let toSave = Object.assign({}, this.state.fieldText, {sourceName: this.state.sourceName});
    console.log(toSave);
  };

  render() {
    const sourceTypes = this.props.sourceTypes.map((type, index) => {
      return <MenuItem value={type.name} id={index} key={index}>{type.name}</MenuItem>
    });
    const sourceTypeFields = Object.keys(this.state.sourceTypeFields).map((field, index) => {
      return <TextField
              className={styles.textFieldExtra}
              type={field.toLowerCase() === 'password' ? 'password': 'text'}
              fullWidth
              margin='dense'
              id={field}
              label={field}
              // value={this.props.sourceTypes[this.state.currentSourceTypeIndex].fields[field]}
              value={this.state.fieldText[field]}
              key={index}
              onChange={this.handleTextChange(field)}
            />
    });
    return (
      <div className={styles.fullPage}>
        <form className={styles.sourceConfiguration}>
          <FormControl className={styles.formStyle}>
            <TextField 
              className={styles.textField}
              fullWidth
              margin='dense'
              id='sourceName'
              label='Source Name' 
              value={this.state.sourceName}
              onChange={this.handleNameChange}
            />

            <Select 
              className={styles.selectField}
              value={this.state.sourceTypeSelection}
              onChange={this.handleSourceTypeChange}
            >
              {sourceTypes}
            </Select>
            <FormHelperText>NOTE: Source types available are dynamic based on your ingestion adapter</FormHelperText>
            {sourceTypeFields}
          </FormControl>
        </form>
        <Button className={styles.buttonStyle} onClick={this.handleSaveConfiguration} raised color='primary' component='span'>
          Save
        </Button>
      </div>
    );
  };
}