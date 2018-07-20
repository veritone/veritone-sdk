import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';

import {
  get,
  isArray,
  cloneDeep,
  isUndefined,
  startCase,
  toLower,
  includes,
  pick
} from 'lodash';
import { objectOf, any, func, number } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Image from '../../Image';
import SourceDropdownMenu from '../../SourceManagement/SourceDropdownMenu';
import InfiniteDropdownMenu from '../../InfiniteDropdownMenu';

import styles from './styles.scss';

@withMuiThemeProvider
class DynamicAdapter extends React.Component {
  static propTypes = {
    updateConfiguration: func.isRequired,
    configuration: objectOf(any).isRequired,
    adapterConfig: objectOf(any).isRequired,
    openCreateSource: func.isRequired,
    closeCreateSource: func.isRequired,
    loadNextSources: func.isRequired,
    loadNextClusters: func.isRequired,
    pageSize: number
  };

  state = {
    cluster: {
      hasNextPage: false,
      isNextPageLoading: false,
      items: []
    }
  }

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    let fields = get(this.props.adapterConfig, 'fields');
    const newState = {
      sourceId: get(this.props, 'configuration.sourceId'),
      clusterId: get(this.props, 'configuration.clusterId')
    };
    if (isArray(fields)) {
      fields.forEach(field => {
        if (field.name) {
          let propValue = get(this.props.configuration, field.name);
          if (!isUndefined(propValue)) {
            newState[field.name] = cloneDeep(propValue);
          } else if (field.defaultValue) {
            newState[field.name] = !includes(field.defaultValue, ',')
              ? field.defaultValue
              : field.defaultValue.split(',');
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

  handleSourceChange = selectedSource => {
    const newState = {
      sourceId: selectedSource.id,
      ...pick(selectedSource.sourceType, ['isLive', 'requiresScanPipeline', 'supportedRunModes'])
    };
    if (this.state.sourceId !== selectedSource.id) {
      // Clusters must use isLive (selecting a new source may have changed isLives value)
      this.loadMoreClusters({ startIndex: 0, stopIndex: this.props.pageSize });
    }
    this.setState(newState, this.sendConfiguration);
  };

  handleClusterChange = selectedCluster => {
    const newState = { clusterId: selectedCluster.id };
    if (!selectedCluster.bypassAllowedEngines) {
      newState.engineWhitelist = selectedCluster.allowedEngines;
    } else {
      newState.engineWhitelist = undefined;
    }
    this.setState(newState, this.sendConfiguration);
  };

  handleFieldChange = fieldKey => event => {
    let fieldValue = event.target.value;
    let stateUpdate = {};
    stateUpdate[fieldKey] = fieldValue;
    this.setState(stateUpdate, this.sendConfiguration);
  };

  loadMoreClusters = ({startIndex, stopIndex}) => {
    this.setState({ cluster: {
      isNextPageLoading: true,
      hasNextPage: false,
      items: this.state.cluster.items
    }});
    return this.props.loadNextClusters(this.state.isLive)({startIndex, stopIndex}).then(nextPage => {
      const newState = {
        cluster: {
          hasNextPage: !!get(nextPage, 'length'),
          isNextPageLoading: false,
          items: startIndex === 0 ? nextPage : cloneDeep(this.state.cluster.items).concat(nextPage)
        }
      }
      if (newState.cluster.items.length && !this.props.id) {
        this.handleClusterChange(newState.cluster.items[0]);
      }
      this.setState(newState);
      return nextPage;
    });
  }

  render() {
    return (
      <div>
        {get(this.props, 'adapterConfig.supportedSourceTypes.length') ? (
          <div>
            <SourceDropdownMenu
              sourceId={this.state.sourceId}
              handleSourceChange={this.handleSourceChange}
              openCreateSource={this.props.openCreateSource}
              closeCreateSource={this.props.closeCreateSource}
              loadNextPage={this.props.loadNextSources}
              pageSize={this.props.pageSize}
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
            { isUndefined(this.state.isLive) ?
              null :
              (
                <div className={styles.adapterContainer}>
                  <InfiniteDropdownMenu
                    label="Select a Cluster"
                    id={this.state.clusterId}
                    handleSelectionChange={this.handleClusterChange}
                    loadNextPage={this.loadMoreClusters}
                    hasNextPage={this.state.cluster.hasNextPage}
                    isNextPageLoading={this.state.cluster.isNextPageLoading}
                    items={this.state.cluster.items}
                    pageSize={this.props.pageSize}
                  />
                </div>
              )
            }
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

function DynamicFieldForm({ fields = [], configuration, handleFieldChange }) {
  return (fields)
    .map(field => {
      const inputId = field.name + 'DynamicField';
      const camelCasedFieldName = startCase(toLower(field.name));
      const fieldObj = {
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
  validate: adapterStep => (configuration) => {
    let errors = [];
    if (get(adapterStep, 'supportedSourceTypes.length') && !configuration.sourceId) {
      errors.push('Source is required');
    }
    if (!configuration.clusterId) {
      errors.push('Cluster is required');
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
    return errors.length
      ? Promise.reject(errors.join(', '))
      : Promise.resolve(configuration);
  },
  getHydratedData: adapterStep => hydrateData => {
    let configuration = {};
    let ingestionTask = hydrateData.ingestionTask;
    if (ingestionTask) {
      configuration.sourceId = get(ingestionTask, 'payload.sourceId');
      configuration.clusterId = get(hydrateData, 'allJobTemplates.records[0].clusterId');
      let fields = get(adapterStep, 'fields');
      if (fields) {
        fields.forEach(field => {
          if (ingestionTask.payload && field.name) {
            configuration[field.name] = ingestionTask.payload[field.name];
          }
        });
      }
    }

    return configuration;
  }
};
