import React from 'react';
import { has } from 'lodash';

import {
  any, 
  arrayOf, 
  objectOf,
  func
} from 'prop-types';

import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import CircleImage from 'components/CircleImage';
import Avatar from 'material-ui/Avatar';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import DynamicSelect from './SchemaDrivenSelectForm';
import styles from './styles.scss';

@withMuiThemeProvider
export default class SourceConfiguration extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired,
    source: objectOf(any), // the source if this is to edit a source
    onInputChange: func.isRequired
  };
  static defaultProps = {};

  state = {
    sourceTypeIndex: 0,
    requiredFields: {}
  };

  componentWillMount = () => {
    const { source } = this.props;
    const newState = {};

    if (source && source.sourceTypeId) { // if editing a source, initialize the defaults
      newState.sourceTypeIndex = Math.max(
        this.props.sourceTypes.findIndex((sourceType) => sourceType.id === source.sourceTypeId),
        this.state.sourceTypeIndex
      )
    }

    if (source && source.sourceType) {
      newState.requiredFields = has(source.sourceType.sourceSchema.definition, 'required')
        ? source.sourceType.sourceSchema.definition
        : {};
    }

    this.setState(newState);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.source.sourceTypeId !== this.props.source.sourceTypeId) { // if editing a source, initialize the defaults
      const sourceTypeIndex = nextProps.sourceTypes
        .findIndex((sourceType) => sourceType.id === nextProps.source.sourceTypeId);

      if (sourceTypeIndex > -1) {
        this.setState({ sourceTypeIndex });
      }
    }
  }

  handleNameChange = (event) => {
    this.props.onInputChange({
      name: event.target.value
    });
  };

  handleSelectChange = (sourceTypeIndex) => {
    if (sourceTypeIndex !== this.state.sourceTypeIndex) {
      const currentFields = {};
      const properties = this.props.sourceTypes[sourceTypeIndex].sourceSchema.definition.properties;

      Object.keys(properties).forEach((field) => {
        currentFields[field] = '';
      });

      return this.props.onInputChange({
        sourceTypeId: this.props.sourceTypes[sourceTypeIndex].id,
        details: currentFields
      });
    }
  }

  handleSourceDetailChange = (formDetail) => {
    this.props.onInputChange({
      details: {
        ...this.props.source.details,
        ...formDetail
      }
    });
  };

  imageClicked = () => {
    console.log('clicked');
  };

  render() {
    return (
      <div className={styles.fullPage}>
        <div>
          <div className={styles.configurationTitle}>
            Configuration
          </div>
          <div className={styles.configurationDescription}>
            Configure your source below by selecting a source type and inputting the associated data.
          </div>
          <div className={styles.sourceConfiguration}>
            <FormControl className={styles.formStyle}>
              <div className={styles.container}>
                <Avatar
                  alt={this.props.source.name}
                  src={this.props.source.thumbnail}
                  className={styles.avatar}
                />
                <TextField
                  className={styles.sourceName}
                  required
                  fullWidth
                  margin='dense'
                  id='sourceName'
                  label='Source Name'
                  // value={this.state.sourceName}
                  value={this.props.source.name}
                  onChange={this.handleNameChange}
                />
              </div>
              <DynamicSelect
                sourceTypes={this.props.sourceTypes}
                currentSourceType={this.state.sourceTypeIndex}
                fieldValues={this.props.source.details}
                onSelectChange={this.handleSelectChange}
                onSourceDetailChange={this.handleSourceDetailChange}
                errorFields={this.state.requiredFields}
                selectLabel='Select a Source Type'
                helperText='NOTE: Source types available are dynamic based on your ingestion adapter'
              />
            </FormControl>
          </div>
        </div>
      </div>
    );
  };
}