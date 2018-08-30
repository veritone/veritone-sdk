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
  pick,
  find
} from 'lodash';
import { objectOf, any, func, number, bool } from 'prop-types';

import Image from '../../Image';
import InfiniteDropdownMenu from '../../InfiniteDropdownMenu';

import styles from './styles.scss';

class DynamicAdapter extends React.Component {
  static propTypes = {
    updateConfiguration: func.isRequired,
    configuration: objectOf(any).isRequired,
    adapterConfig: objectOf(any).isRequired,
    openCreateSource: func.isRequired,
    loadNextSources: func.isRequired,
    loadNextClusters: func.isRequired,
    populateSelectedSource: func,
    pageSize: number,
    readOnly: bool
  };

  state = {
    _source: {
      hasNextPage: false,
      isNextPageLoading: false,
      items: []
    },
    _cluster: {
      hasNextPage: false,
      isNextPageLoading: false,
      items: []
    }
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    let fields = get(this.props.adapterConfig, 'fields');
    const newState = {
      sourceId: get(this.props, 'configuration.sourceId'),
      clusterId: get(this.props, 'configuration.clusterId'),
      maxTDODuration: get(this.props, 'configuration.maxTDODuration') || 60
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
    if (newState.sourceId) {
      this.props.populateSelectedSource(newState.sourceId).then(source => {
        this.insertAndSelectSource(source);
      });
    }
  }

  sendConfiguration = () => {
    this.props.updateConfiguration(this.state);
  };

  handleSourceChange = selectedSource => {
    const newState = {
      sourceId: selectedSource.id,
      _source: {
        ...pick(this.state._source, [
          'hasNextPage',
          'isNextPageLoading',
          'items'
        ]),
        selectedSource
      }
    };
    this.setState(newState, this.sendConfiguration);
  };

  handleClusterChange = selectedCluster => {
    const newState = {
      clusterId: selectedCluster.id,
      _cluster: {
        ...pick(this.state._cluster, [
          'hasNextPage',
          'isNextPageLoading',
          'items'
        ]),
        selectedCluster
      }
    };
    this.setState(newState, this.sendConfiguration);
  };

  handleFieldChange = fieldKey => event => {
    let fieldValue = event.target.value;
    let stateUpdate = {};
    stateUpdate[fieldKey] = fieldValue;
    this.setState(stateUpdate, this.sendConfiguration);
  };

  insertAndSelectSource = source => {
    if (source) {
      this.setState(prevState => {
        const newSources = cloneDeep(prevState._source.items);
        newSources.push(source);
        const newState = {
          _source: {
            ...prevState._source,
            items: newSources
          }
        };
        return newState;
      }, () => {
        this.handleSourceChange(source);
      });
    }
  }

  loadMoreSources = ({startIndex, stopIndex}) => {
    this.setState(prevState => {
      return Object.assign({}, prevState, {
        _source: {
          isNextPageLoading: true,
          hasNextPage: false,
          items: prevState._source.items
        }
      });
    });
    return this.props.loadNextSources({startIndex, stopIndex}).then(nextPage => {
      const hasPreselectedSource = this.state._source.items.length === 1;
      const newState = {
        _source: {
          hasNextPage: !!get(nextPage, 'length'),
          isNextPageLoading: false,
          items: (!hasPreselectedSource && startIndex === 0) ? nextPage : cloneDeep(this.state._source.items).concat(nextPage)
        }
      }
      const sourceToSelect = find(
        newState._source.items,
        ['id', this.state.sourceId]
      );
      if (sourceToSelect) {
        this.setState(newState, () => {
          this.handleSourceChange(sourceToSelect);
        });
      } else if (newState._source.items.length && !this.state.sourceId) {
        this.setState(newState, () => {
          this.handleSourceChange(newState._source.items[0]);
        });
      } else {
        this.setState(newState);
      }
      return nextPage;
    });
  }

  loadMoreClusters = ({startIndex, stopIndex}) => {
    this.setState(prevState => {
      return Object.assign({}, prevState, {
        _cluster: {
          isNextPageLoading: true,
          hasNextPage: false,
          items: prevState._cluster.items
        }
      });
    });
    return this.props
      .loadNextClusters({ startIndex, stopIndex })
      .then(nextPage => {
        const newState = {
          _cluster: {
            hasNextPage: !!get(nextPage, 'length'),
            isNextPageLoading: false,
            items:
              startIndex === 0
                ? nextPage
                : cloneDeep(this.state._cluster.items).concat(nextPage)
          }
        };
        const clusterToSelect = find(newState._cluster.items, [
          'id',
          this.state.clusterId
        ]);
        if (clusterToSelect) {
          this.setState(newState, () => {
            this.handleClusterChange(clusterToSelect);
          });
        } else if (newState._cluster.items.length && !this.state.clusterId) {
          this.setState(newState, () => {
            this.handleClusterChange(newState._cluster.items[0]);
          });
        } else {
          this.setState(newState);
        }
        return nextPage;
      });
  };

  render() {
    const MAX_DURATION_MINS = 60;
    const customTriggers = [];
    if (this.props.openCreateSource) {
      customTriggers.push({
        label: 'Create New Source',
        trigger: this.props.openCreateSource(this.insertAndSelectSource)
      });
    }
    return (
      <div>
        {get(this.props, 'adapterConfig.supportedSourceTypes.length') ? (
          <div>
            <div className={styles.adapterContainer}>
              <div className={styles.adapterHeader}>Select a Source</div>
              <div className={styles.adapterDescription}>
                Select from your available ingestion sources or create a new source.
              </div>
            </div>
            <div className={styles.adapterContainer}>
              <InfiniteDropdownMenu
                label="Select a Source*"
                value={this.state.sourceId}
                secondaryNameKey="sourceType.name"
                handleSelectionChange={this.handleSourceChange}
                loadNextPage={this.loadMoreSources}
                hasNextPage={this.state._source.hasNextPage}
                isNextPageLoading={this.state._source.isNextPageLoading}
                items={this.state._source.items}
                pageSize={this.props.pageSize}
                customTriggers={customTriggers}
                readOnly={this.props.readOnly}
              />
            </div>
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
              ) : null}
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
              <InfiniteDropdownMenu
                label="Select a Cluster"
                value={this.state.clusterId}
                handleSelectionChange={this.handleClusterChange}
                loadNextPage={this.loadMoreClusters}
                hasNextPage={this.state._cluster.hasNextPage}
                isNextPageLoading={this.state._cluster.isNextPageLoading}
                items={this.state._cluster.items}
                pageSize={this.props.pageSize}
                readOnly={this.props.readOnly}
              />
              <div>
                <TextField
                  type="number"
                  label="Segment Duration Length"
                  margin="normal"
                  InputLabelProps={{
                    className: styles.tdoDurationLabel
                  }}
                  inputProps={{
                    className: styles.tdoDurationInput,
                    min: 0,
                    max: MAX_DURATION_MINS,
                    step: 1,
                    readOnly: this.props.readOnly
                  }} 
                  helperText={`Max ${MAX_DURATION_MINS} minutes`}
                  value={this.state.maxTDODuration}
                  onChange={this.handleFieldChange('maxTDODuration')}
                />
              </div>
            </div>
            <div>
              <DynamicFieldForm
                fields={this.props.adapterConfig.fields}
                configuration={this.state}
                handleFieldChange={this.handleFieldChange}
                readOnly={this.props.readOnly}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function DynamicFieldForm({ fields = [], configuration, handleFieldChange, readOnly }) {
  return fields
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
              readOnly={readOnly}
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
              inputProps={{
                readOnly
              }}
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
                step: parseFloat(field.step),
                readOnly
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
  validate: adapterStep => configuration => {
    let errors = [];
    if (get(adapterStep, 'supportedSourceTypes.length')) {
      if (!get(configuration, '_source.selectedSource')) {
        errors.push('Source is required');
      }
      if (!get(configuration, '_cluster.selectedCluster')) {
        errors.push('Cluster is required');
      }
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
      configuration.clusterId = get(
        hydrateData,
        'allJobTemplates.records[0].clusterId'
      );
      configuration.maxTDODuration = get(
        hydrateData,
        'allJobTemplates.records[0].jobConfig.maxTDODuration'
      );
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
