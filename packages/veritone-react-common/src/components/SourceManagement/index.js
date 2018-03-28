import React from 'react';
import { has } from 'lodash';

import {
  any, 
  arrayOf, 
  objectOf,
  func
} from 'prop-types';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import ModalHeader from 'components/ModalHeader';
import DynamicSelect from 'components/SchemaDrivenSelectForm';
import CircleImage from 'components/CircleImage';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './styles.scss';

@withMuiThemeProvider
export default class SourceConfiguration extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired,
    source: objectOf(any), // the source if this is to edit a source
    submitCallback: func, // will return an object: {sourceName, schemaResult: {sourceTypeId, fieldValues:{}}}
  };
  static defaultProps = {};

  state = {
    placeholder: 'Select a Source Type',
    sourceTypeId: null,
    sourceName: '',
    sourceThumbnail: '',
    schemaFormResult: {},
    initialValues: {},
    requiredFields: {}
  };

  componentWillMount = () => {
    // if editing a source, initialize the defaults
    if (this.props.source) {
      let source = this.props.source;
      let name = source.name || '';
      let thumbnail = source.thumbnail || '';
      let initialValues = source.details || {};
      let sourceTypeId = source.sourceType.id;
      let requiredFields = has(source.sourceType.sourceSchema.definition, 'required') ? source.sourceType.sourceSchema.definition : {};
      this.setState({
        sourceName: name,
        sourceThumbnail: thumbnail,
        initialValues: initialValues,
        requiredFields: requiredFields,
        sourceTypeId: sourceTypeId
      });
    }

    // construct a clear path to the source type schema for each source type
    this.props.sourceTypes.forEach(sourceType => {
      this.setState({
        [sourceType.id]: sourceType.sourceSchema.definition.properties, // this is the path to the source type schema
        [sourceType.id]: sourceType
      })
    });
  };

  handleDynamicFormCallback = (formResult) => {
    //TODO: keep a check on error state and pass it down to child on save
    let id = formResult.sourceTypeId;
    let definition = this.props.sourceTypes[formResult.sourceTypeIndex].sourceSchema.definition;
    this.setState({
      schemaFormResult: formResult,
    });
  };

  handleSaveConfiguration = () => {
    //TODO: implement an onSave check
    let savedFieldValues = this.state.schemaFormResult.fieldValues;
    let sourceTypeFields = this.props.sourceTypes[this.state.schemaFormResult.sourceTypeIndex].sourceSchema.definition.properties;
    
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

  imageClicked = () => {
    console.log('clicked');
  };

  renderModalHeader = () => {
    return (
      <ModalHeader
        title="New Source"
        icons={[
          <IconButton className={styles.helpIcon} aria-label='help' key={1}>
            <Icon className='icon-help2' />
          </IconButton>,
          <IconButton className={styles.menuIcon} aria-label='menu' key={2}>
            <Icon className='icon-more_vert' />
          </IconButton>,
          <IconButton className={styles.trashIcon} aria-label='trash' key={3}>
            <Icon className='icon-trash' />
          </IconButton>,
          <span className={styles.separator} key={4} />,
          <IconButton className={styles.exitIcon} aria-label='exit' key={5}>
            <Icon className='icon-close-exit' />
          </IconButton>
        ]}
      />
    );
  }

  render() {
    return (
      <div className={styles.fullPage}>
        {this.renderModalHeader()}
        <div className={styles.configurationTitle}>Configuration</div>
        <div className={styles.configurationDescription}>Configure your source below by selecting a source type and inputting the associated data.</div>
        <form className={styles.sourceConfiguration}>
          <FormControl className={styles.formStyle}>
            <div className={styles.container}>
              <CircleImage height='70px' width='70px' image={this.state.thumbnail} onClick={this.imageClicked}/>
              <TextField 
                className={styles.sourceName}
                required
                fullWidth
                margin='dense'
                id='sourceName'
                label='Source Name' 
                value={this.state.sourceName}
                onChange={this.handleNameChange}
              />
            </div>
            <DynamicSelect sourceTypes={this.props.sourceTypes} initialSourceTypeId={this.state.sourceTypeId} initialValues={this.state.initialValues} formCallback={this.handleDynamicFormCallback} errorFields={this.state.requiredFields} selectLabel='Select a Source Type'  helperText='NOTE: Source types available are dynamic based on your ingestion adapter'/>
          </FormControl>
        </form>
        <Button className={styles.buttonStyle} onClick={this.handleSaveConfiguration} raised color='primary' component='span'>
          Create
        </Button>
      </div>
    );
  };
}