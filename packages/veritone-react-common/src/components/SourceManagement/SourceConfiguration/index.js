import React from 'react';
import { has, pick } from 'lodash';

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
import CircleImage from 'components/CircleImage';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import DynamicSelect from './SchemaDrivenSelectForm';
import styles from './styles.scss';

@withMuiThemeProvider
export default class SourceConfiguration extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired,
    source: objectOf(any), // the source if this is to edit a source
    // onSubmit: func.isRequired // will return an object: {sourceName, schemaResult: {sourceTypeId, fieldValues:{}}}
    onInputChange: func.isRequired
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
    const { source } = this.props;

    if (source) { // if editing a source, initialize the defaults
      return this.setState({
        sourceName: source.name || '',
        sourceThumbnail: source.thumbnail || '',
        fieldValues: source.details || {},
        requiredFields: has(source.sourceType.sourceSchema.definition, 'required') ? source.sourceType.sourceSchema.definition : {},
        sourceTypeId: source.sourceType.id,
        // sourceTypeIndex: Math.max(this.props.sourceTypes.findIndex((sourceType) => sourceType.id === source.sourceType.id), 0)
      });
    }

    const stateVals = {
      sourceTypeIndex: 0,
      fieldValues: {}
    };
    // const properties = this.props.sourceTypes[stateVals.sourceTypeIndex].sourceSchema.definition.properties;
    const properties = source.sourceSchema.definition.properties;
    Object.keys(properties).forEach((field) => {
      stateVals.fieldValues[field] = '';
    });

    return this.setState(stateVals);
  };

  handleFormInputChange = (formResult) => {
    //TODO: keep a check on error state and pass it down to child on save   
    // this.setState({
    //   ...formResult
    // });
    this.props.onInputChange({
      fieldValues: {
        ...formResult
      }
    });
  };

  // handleSaveConfiguration = (e) => {
  //   e.preventDefault();
    
  //   const sourceConfigData = {
  //     sourceName: this.state.sourceName,
  //     configuration: pick(this.state, ['sourceTypeId', 'fieldValues'])
  //   };
  //   console.log('sourceConfigData:', sourceConfigData);
  //   this.props.onSubmit(sourceConfigData);
  // };

  handleNameChange = (event) => {
    // this.setState({ sourceName: event.target.value });
    this.props.onInputChange({
      sourceName: event.target.value
    });
  };

  imageClicked = () => {
    console.log('clicked');
  };

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
            <Button
              raised
              className={styles.buttonStyle}
              color='primary'
              type="submit"
            >
              Create
            </Button>
          </form>
        </div>
      </div>
    );
  };
}