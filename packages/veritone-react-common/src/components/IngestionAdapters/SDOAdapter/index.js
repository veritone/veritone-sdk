import React from 'react';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Menu, { MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import { InputLabel } from 'material-ui/Input';

import { get, isArray, clone, startCase, toLower, includes } from 'lodash';
import {
  objectOf,
  any,
  func,
  arrayOf,
  string,
  bool
} from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Image from '../../Image';
import SourceManagerModal from '../../SourceManagerModal';

import styles from './styles.scss';


@withMuiThemeProvider
class SDOAdapter extends React.Component {
  static propTypes = {
    updateConfiguration: func.isRequired,
    configuration: objectOf(any).isRequired,
    sources: arrayOf(objectOf(any)).isRequired,
    sourceTypes: arrayOf(objectOf(any)).isRequired,
    adapterConfig: objectOf(any).isRequired
  };

  constructor(props) {
    super(props);
    let fields = get(this.props.adapterConfig, 'fields');
    this.state = {
      sourceId: 
        get(this.props, 'configuration.sourceId') ||
        (get(this.props, 'sources.length') ? this.props.sources[0].id : '')
    };
    if (isArray(fields)) {
      fields.forEach(field => {
        if (field.name) {
          let propValue = get(this.props, ['configuration', field.name]);
          if (field.defaultValue) {
            this.state[field.name] =  propValue || (!includes(field.defaultValue, ',') ? field.defaultValue : field.defaultValue.split(','));
          } else if (field.defaultValues) {
            this.state[field.name] = propValue || clone(field.defaultValues) || [];
          }
        }
      });
      console.log(this.state);
      this.sendConfiguration();
    }
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
        <div className={styles.adapterContainer}>
          <div className={styles.adapterHeader}>
            Select a Source
          </div>
          <div className={styles.adapterDescription}>
            Select from your available ingestion sources or create a new source.
          </div>
        </div>
        <div className={styles.adapterContainer}>
            <SourceContainer
              initialValue={this.state.sourceId}
              sources={this.props.sources}
              sourceTypes={this.props.sourceTypes}
              handleSourceChange={this.handleSourceChange}
              selectLabel="Select a Source*"/>
        </div>
        <div className={styles.adapterDivider}/>
        <div>
          <div className={styles.adapterContainer}>
            <div className={styles.adapterHeader}>
              Configure Ingestion Adapter
            </div>
            <div className={styles.adapterDescription}>
              Complete the required fields below to configure the adapter that will ingest your content.
            </div>
          </div>
          <div>
            <div className={styles.adapterContainer} style={{display: 'flex', flexDirection: 'row'}}>
              {
                this.props.adapterConfig.iconPath
                ? (
                  <div className={styles.adapterIconContainer}>
                    <Image src={this.props.adapterConfig.iconPath} width={44} height={44} border />
                  </div>
                ) : ''
              }
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
              <TextField
                label="Cluster"
                value="Veritone CPU"
                disabled />
            </div>
            <div>
              <DynamicFieldForm fields={this.props.adapterConfig.fields} configuration={this.state} handleFieldChange={this.handleFieldChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function DynamicFieldForm({ fields, configuration, handleFieldChange }) {
  return fields.map(field => {
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
              id: inputId,
            }}
          >
            {
              field.options.map(option => <MenuItem key={option.key} value={option.value}>{option.key}</MenuItem>)
            }
          </Select>
          { field.info ? <FormHelperText>{field.info}</FormHelperText> : '' }
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
  }).map(fieldObj => (<div key={fieldObj.key} className={styles.adapterFieldContainer}>{fieldObj.input}</div>));
}

@withMuiThemeProvider
class SourceContainer extends React.Component {
  static propTypes = {
    initialValue: string,
    sources: arrayOf(objectOf(any)),
    handleSourceChange: func.isRequired,
    selectLabel: string,
    sourceTypes: arrayOf(objectOf(any)).isRequired
  };

  state = {
    anchorEl: null
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  openCreateSource = () => {
    this.setState({ isCreateSourceOpen: true });
  };

  closeCreateSource = () => {
    this.setState({ isCreateSourceOpen: false, anchorEl: null });
  };

  handleCreateSource = (source) => {
    console.log(source);
  }

  render() {
    return (
      <SourceSelector
        initialValue={this.props.initialValue}
        sources={this.props.sources}
        sourceTypes={this.props.sourceTypes}
        handleSourceChange={this.props.handleSourceChange}
        handleMenuClose={this.handleMenuClose}
        handleMenuClick={this.handleMenuClick}
        selectLabel={this.props.selectLabel}
        anchorEl={this.state.anchorEl}
        openCreateSource={this.openCreateSource}
        isCreateSourceOpen={this.state.isCreateSourceOpen}
        handleCreateSource={this.handleCreateSource}
        closeCreateSource={this.closeCreateSource} />
    );
  }
}

const SourceSelector = ({
  initialValue,
  sources,
  handleSourceChange,
  selectLabel,
  handleMenuClick,
  handleMenuClose,
  anchorEl,
  openCreateSource,
  isCreateSourceOpen,
  sourceTypes,
  handleCreateSource,
  closeCreateSource
}) => {
  let sourceMenuItems = sources.map(source => {

    function handleItemClick () {
      handleSourceChange(source.id);
      handleMenuClose();
    }

    return (
      <MenuItem
        key={source.id}
        value={source.id}
        selected={source.id === initialValue}
        onClick={handleItemClick}
      >
        {source.name}
      </MenuItem>
    );
  }
  );
  const menuId = 'long-menu';
  const dummyItem = 'dummy-item';
  let selectedSource = sources.find(source => source.id === initialValue);
  return (
    <FormControl>
      <InputLabel htmlFor="select-source">Select a Source*</InputLabel>
      <Select 
        className={styles.sourceSelector}
        value={initialValue || dummyItem}
        onClick={handleMenuClick} 
        aria-label="Select Source"
        aria-owns={anchorEl ? menuId : null}
        aria-haspopup="true"
        readOnly
        inputProps={{
          name: 'source',
          id: 'select-source',
        }}
      >
        <MenuItem key={dummyItem} value={initialValue || dummyItem}>{selectedSource ? selectedSource.name : '---'}</MenuItem>
      </Select>
      <Menu
        id={menuId}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorEl={anchorEl}
        PaperProps={{
          style: {
            maxHeight: 400,
            overflow: 'hidden',
            width: 'auto'
          }
        }}
      >
        <div key="scroll-container" className={styles.sourceScrollContainer}>
          {sourceMenuItems}
        </div>
        <div>
          <MenuItem key="create-source-menu-item" value={null} onClick={openCreateSource}>
            Create New Source
          </MenuItem>
          <SourceManagerModal
            open={isCreateSourceOpen}
            handleClose={closeCreateSource}
            getSavedSource={handleCreateSource}
            sourceTypes={sourceTypes} />
        </div>
      </Menu>
    </FormControl>
  );
};

SourceSelector.propTypes = {
  initialValue: string,
  sources: arrayOf(objectOf(any)).isRequired,
  handleSourceChange: func.isRequired,
  selectLabel: string,
  handleMenuClick: func,
  handleMenuClose: func,
  anchorEl: objectOf(any),
  openCreateSource: func.isRequired,
  isCreateSourceOpen: bool,
  sourceTypes: arrayOf(objectOf(any)).isRequired,
  handleCreateSource: func.isRequired,
  closeCreateSource: func.isRequired
};

export default {
  title: 'Configuration',
  adapter: SDOAdapter,
  template: 'ingest/react-adapter',
  config: {
    adapterId: 'sdo-adapter',
    enableSchedule: true,
    enableProcess: true,
    enableCustomize: {
      setName: true
    }
  }
}