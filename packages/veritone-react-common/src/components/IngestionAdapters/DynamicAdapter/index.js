import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';

import { get, isArray, cloneDeep, isUndefined, startCase, toLower, includes } from 'lodash';
import { objectOf, any, func, arrayOf, string } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Image from '../../Image';
import SourceDropdownMenu from '../../SourceManagement/SourceDropdownMenu';

import styles from './styles.scss';

@withMuiThemeProvider
class DynamicAdapter extends React.Component {
  static propTypes = {
    updateConfiguration: func.isRequired,
    configuration: objectOf(any).isRequired,
    sources: arrayOf(objectOf(any)).isRequired,
    adapterConfig: objectOf(any).isRequired,
    openCreateSource: func.isRequired,
    closeCreateSource: func.isRequired
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    let fields = get(this.props.adapterConfig, 'fields');
    const newState = {};
    if (get(this.props, 'adapterConfig.supportedSourceTypes.length')) {
      newState.sourceId =
        get(this.props.configuration, 'sourceId') ||
        (get(this.props, 'sources.length') ? this.props.sources[0].id : '');
    }
    if (isArray(fields)) {
      fields.forEach(field => {
        if (field.name) {
          let propValue = get(this.props.configuration, field.name);
          if (!isUndefined(propValue)) {
            newState[field.name] = cloneDeep(propValue);
          } else if (field.defaultValue) {
            newState[field.name] =
              (!includes(field.defaultValue, ',')
                ? field.defaultValue
                : field.defaultValue.split(','));
          } else if (field.defaultValues) {
            newState[field.name] = cloneDeep(field.defaultValues) || [];
          }
        }
      });
    }
    this.setState(newState, this.sendConfiguration);
  }

  sendConfiguration = () => {
    this.props.updateConfiguration(this.state);
  };

  handleSourceChange = selectedSourceId => {
    let newState = { sourceId: selectedSourceId };
    this.setState(newState, this.sendConfiguration);
  };

  handleFieldChange = fieldKey => event => {
    let fieldValue = event.target.value;
    let stateUpdate = {};
    stateUpdate[fieldKey] = fieldValue;
    this.setState(stateUpdate, this.sendConfiguration);
  };

  render() {
    return (
      <div>
        {get(this.props, 'adapterConfig.supportedSourceTypes.length') ? (
          <div>
            <SourceDropdownMenu
              sourceId={this.state.sourceId}
              sources={this.props.sources}
              handleSourceChange={this.handleSourceChange}
              openCreateSource={this.props.openCreateSource}
              closeCreateSource={this.props.closeCreateSource}
            />
            <div className={styles.adapterDivider} />
          </div>
        ) : null}
        <div>
          <div className={styles.adapterContainer}>
            <div className={styles.adapterHeader}>
              Configure Ingestion Adapter
            </div>
            <div className={styles.adapterDescription}>
              Complete the required fields below to configure the adapter that
              will ingest your content.
            </div>
          </div>
          <div>
            <div
              className={styles.adapterContainer + ' ' + styles.flexContainer}
            >
              {this.props.adapterConfig.iconPath ? (
                <div className={styles.adapterIconContainer}>
                  <Image
                    src={this.props.adapterConfig.iconPath}
                    width={'44px'}
                    height={'44px'}
                    border
                  />
                </div>
              ) : (
                ''
              )}
              <div>
                <div className={styles.adapterHeader}>
                  {this.props.adapterConfig.name}
                </div>
                <div className={styles.adapterDescription}>
                  {this.props.adapterConfig.description}
                </div>
              </div>
            </div>
            <div className={styles.adapterContainer}>
              <TextField label="Cluster" value="Veritone CPU" disabled />
            </div>
            <div>
              <DynamicFieldForm
                fields={this.props.adapterConfig.fields}
                configuration={this.state}
                handleFieldChange={this.handleFieldChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function DynamicFieldForm({ fields, configuration, handleFieldChange }) {
  return (fields || [])
    .map(field => {
      let inputId = field.name + 'DynamicField';
      let camelCasedFieldName = startCase(toLower(field.name));
      let fieldObj = {
        key: inputId
      };
      if (field.type === 'Picklist' || field.type === 'MultiPicklist') {
        fieldObj.input = (
          <FormControl>
            <InputLabel htmlFor={inputId}>{camelCasedFieldName}</InputLabel>
            <Select
              value={configuration[field.name]}
              onChange={handleFieldChange(field.name)}
              autoWidth
              multiple={field.type === 'MultiPicklist'}
              inputProps={{
                name: field.name,
                id: inputId
              }}
            >
              {field.options.map(option => (
                <MenuItem key={option.key} value={option.value}>
                  {option.key}
                </MenuItem>
              ))}
            </Select>
            {field.info ? <FormHelperText>{field.info}</FormHelperText> : ''}
          </FormControl>
        );
      } else if (field.type === 'Text') {
        fieldObj.input = (
          <FormControl>
            <TextField
              id={inputId}
              label={camelCasedFieldName}
              value={configuration[field.name]}
              onChange={handleFieldChange(field.name)}
              helperText={field.info}
            />
          </FormControl>
        );
      } else if (field.type === 'Number') {
        fieldObj.input = (
          <FormControl>
            <TextField
              id={inputId}
              label={camelCasedFieldName}
              value={parseFloat(configuration[field.name])}
              onChange={handleFieldChange(field.name)}
              type="number"
              helperText={field.info}
              inputProps={{
                max: parseFloat(field.max),
                min: parseFloat(field.min),
                step: parseFloat(field.step)
              }}
            />
          </FormControl>
        );
      }
      return fieldObj;
    })
    .map(fieldObj => (
      <div key={fieldObj.key} className={styles.adapterFieldContainer}>
        {fieldObj.input}
      </div>
    ));
}

export default {
  title: 'Configuration',
  adapter: DynamicAdapter,
  template: 'ingest/react-adapter',
  config: {
    adapterId: 'dynamic-adapter',
    enableSchedule: true,
    enableProcess: true,
    enableCustomize: {
      setName: true
    }
  },
  validate: adapterStep => (configuration, cb) => {
    let errors = [];
    if (get(adapterStep, 'supportedSourceTypes.length') && !configuration.sourceId) {
      errors.push('Source is required');
    }
    if (isArray(adapterStep.fields)) {
      adapterStep.fields.forEach(field => {
        if (field.defaultValue && !configuration[field.name]) {
          errors.push(startCase(toLower(field.name)) + ' is invalid');
        } else if (
          field.defaultValues &&
          isArray(configuration[field.name]) &&
          !configuration[field.name].length
        ) {
          errors.push(
            'At least one ' +
              startCase(toLower(field.name)) +
              ' must be selected'
          );
        }
      });
    }
    errors.length
      ? cb('Configuration: ' + errors.join(', '))
      : cb(null, configuration);
  },
  getHydratedData: adapterStep => hydrateData => {
    let configuration = {};
    let ingestionTask, sourceId;
    let tasks = get(
      hydrateData,
      'jobTemplates.records[0].taskTemplates.records'
    );
    if (tasks) {
      ingestionTask = tasks.filter(
        task => get(task, 'engine.category.type.name') === 'Ingestion'
      )[0];
    }
    if (ingestionTask) {
      sourceId = get(ingestionTask, 'payload.sourceId');
      configuration.sourceId = sourceId;
      let fields = get(adapterStep, 'fields');
      if (fields) {
        fields.forEach(
          field => {
            if (ingestionTask.payload && field.name) {
              configuration[field.name] = ingestionTask.payload[field.name];
            }
          }
        );
      }
    }

    return configuration;
  }
};
