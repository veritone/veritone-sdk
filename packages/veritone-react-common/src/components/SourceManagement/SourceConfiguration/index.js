import React from 'react';

import {
  any, 
  arrayOf, 
  objectOf,
  func
} from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import ModalHeader from 'components/ModalHeader';
import DynamicSelect from 'components/SchemaDrivenSelectForm';
import styles from './styles.scss';

@withMuiThemeProvider
export default class SourceConfiguration extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired,
    submitCallback: func, // will return an object: {sourceName, schemaResult: {sourceTypeId, fieldValues:{}}}
  };
  static defaultProps = {};

  state = {
    placeholder: 'Select a Source Type',
    sourceName: '',
    schemaFormResult: {}
  };

  componentWillMount = () => {
    // construct a clear path to the source type schema for each source type
    this.props.sourceTypes.forEach(sourceType => {
      this.setState({
        [sourceType.id]: sourceType.sourceSchema.definition.properties, // this is the path to the source type schema
        [sourceType.id]: sourceType
      })
    });
  };

  handleDynamicFormCallback = (formResult) => {
    console.log(formResult);
    this.setState({schemaFormResult: formResult});
  };

  handleSaveConfiguration = () => {
    let savedFieldValues = this.state.schemaFormResult.fieldValues;
    let sourceTypeFields = this.props.sourceTypes[this.state.schemaFormResult.currentSourceTypeIndex].sourceSchema.definition.properties;
    if (Object.keys(savedFieldValues).length !== Object.keys(sourceTypeFields).length) {
      return; // don't allow saving incomplete form
    } else if (!this.state.sourceName) {
      return;
    }
    let toSave = {
      sourceName: this.state.sourceName,
      schemaResult: this.state.schemaFormResult
    };
    console.log(toSave);
    this.props.submitCallback(toSave);
  };

  handleNameChange = (event) => {
    this.setState({sourceName: event.target.value});
  };

  render() {

    return (
      <div className={styles.fullPage}>
        <div className={styles.configurationTitle}>Configuration</div>
        <div className={styles.configurationDescription}>Configure your source below by selecting a source type and inputting the associated data.</div>
        <form className={styles.sourceConfiguration}>
          <FormControl className={styles.formStyle}>
            <TextField 
              className={styles.sourceName}
              fullWidth
              margin='dense'
              id='sourceName'
              label='Source Name' 
              value={this.state.sourceName}
              onChange={this.handleNameChange}
            />
            <DynamicSelect sourceTypes={this.props.sourceTypes} formCallback={this.handleDynamicFormCallback} selectLabel='Select a Source Type'  helperText='NOTE: Source types available are dynamic based on your ingestion adapter'/>
          </FormControl>
        </form>
        <Button className={styles.buttonStyle} onClick={this.handleSaveConfiguration} raised color='primary' component='span'>
          Create
        </Button>
      </div>
    );
  };
}