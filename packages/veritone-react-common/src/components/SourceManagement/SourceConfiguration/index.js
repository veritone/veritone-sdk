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
import { FormControl } from 'material-ui/Form';
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
    onClose: func
  };
  static defaultProps = {};

  state = {
    placeholder: 'Select a Source Type',
    sourceTypeId: null,
    sourceName: '',
    sourceThumbnail: '',
    fieldValues: {},
    requiredFields: {},
    sourceTypeIndex: null
  };

  componentWillMount = () => {
    if (this.props.source) { // if editing a source, initialize the defaults
      const source = this.props.source;

      return this.setState({
        sourceName: source.name || '',
        sourceThumbnail: source.thumbnail || '',
        fieldValues: source.details || {},
        requiredFields: has(source.sourceType.sourceSchema.definition, 'required') ? source.sourceType.sourceSchema.definition : {},
        sourceTypeId: source.sourceType.id,
        sourceTypeIndex: Math.max(this.props.sourceTypes.findIndex((sourceType) => sourceType.id === source.sourceType.id), 0)
      });
    }

    const stateVals = {
      sourceTypeIndex: 0,
      fieldValues: {}
    };
    const properties = this.props.sourceTypes[stateVals.sourceTypeIndex].sourceSchema.definition.properties;
    Object.keys(properties).forEach((field) => {
      stateVals.fieldValues[field] = '';
    });

    return this.setState(stateVals);
  };

  handleFormInputChange = (formResult) => {
    //TODO: keep a check on error state and pass it down to child on save   
    this.setState({
      ...formResult
    });
  };

  handleSaveConfiguration = (e) => {
    e.preventDefault();
    //TODO: implement an onSave check
    // const savedFieldValues = this.state.schemaFormResult.fieldValues;
    // const sourceTypeFields = this.props.sourceTypes[this.state.schemaFormResult.sourceTypeIndex].sourceSchema.definition.properties;
    
    const toSave = {
      sourceName: this.state.sourceName,
      schemaResult: this.state.schemaFormResult
    };
    console.log('toSave:', toSave);
    // this.props.submitCallback(toSave);
  };

  handleNameChange = (event) => {
    this.setState({ sourceName: event.target.value });
  };

  imageClicked = () => {
    console.log('clicked');
  };

  // renderModalHeader = () => {
  //   return (
  //     <ModalHeader
  //       title={this.props.source ? this.props.source.name : "New Source"}
  //       icons={[
  //         <IconButton className={styles.helpIcon} aria-label='help' key={1}>
  //           <Icon className='icon-help2' />
  //         </IconButton>,
  //         <IconButton className={styles.menuIcon} aria-label='menu' key={2}>
  //           <Icon className='icon-more_vert' />
  //         </IconButton>,
  //         <IconButton className={styles.trashIcon} aria-label='trash' key={3}>
  //           <Icon className='icon-trash' />
  //         </IconButton>,
  //         <span className={styles.separator} key={4} />,
  //         <IconButton className={styles.exitIcon} aria-label='exit' key={5}>
  //           <Icon className='icon-close-exit' onClick={this.props.onClose} />
  //         </IconButton>
  //       ]}
  //     />
  //   );
  // }

  render() {
    return (
      <div className={styles.fullPage}>
        {/* {this.renderModalHeader()} */}
        <div>
          <div className={styles.configurationTitle}>
            Configuration
          </div>
          <div className={styles.configurationDescription}>
            Configure your source below by selecting a source type and inputting the associated data.
          </div>
          <form className={styles.sourceConfiguration} onSubmit={this.handleSaveConfiguration}>
            <FormControl className={styles.formStyle}>
              <div className={styles.container}>
                <CircleImage height='70px' width='70px' image={this.state.thumbnail} onClick={this.imageClicked} />
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
              <DynamicSelect
                sourceTypes={this.props.sourceTypes}
                currentSource={this.state.sourceTypeIndex}
                fieldValues={this.state.fieldValues}
                onInputChange={this.handleFormInputChange}
                errorFields={this.state.requiredFields}
                selectLabel='Select a Source Type'
                helperText='NOTE: Source types available are dynamic based on your ingestion adapter'
              />
            </FormControl>
            <Button raised
              className={styles.buttonStyle}
              color='primary'
              type="submit"
            // component='span'
            >
              Create
            </Button>
          </form>
        </div>
      </div>
    );
  };
}