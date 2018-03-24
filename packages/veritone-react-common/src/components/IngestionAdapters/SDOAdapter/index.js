import React from 'react';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Image from '../../Image';
import Input, { InputLabel } from 'material-ui/Input';
import { get } from 'lodash';
import styles from './styles.scss';

import {
  object,
  func,
  arrayOf
} from 'prop-types';

class SDOAdapter extends React.Component {
  static propTypes = {
    getConfiguration: func.isRequired,
    updateConfiguration: func,
    configuration: object,
    sources: arrayOf(object).isRequired,
    adapterConfig: object.isRequired
  };

  componentDidMount() {
    // Required function to get configuration set by user
    if (typeof this.props.getConfiguration === 'function') {
      // Return the current configuration
      this.props.getConfiguration(() => this.state.configuration);
    } else {
      console.error('Missing required getConfiguration function');
    }
  }

  handleSourceChange = event => {
    let selectedSourceId = event.target.value;
    let newState = { sourceId: selectedSourceId };
    this.setState(newState);
    this.props.updateConfiguration(newState);
  }

  // Hydrate the adapter with the provided configuration if it is defined
  state = {
    sourceId: 
      get(this.props, ['configuration', 'sourceId']) ||
      (get(this.props, ['sources', 'length']) ? this.props.sources[0].id : '')
  }

  // Adapter specific functions here
 
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
            <SourceSelector
              initialValue={this.state.sourceId}
              sources={this.props.sources}
              handleSourceChange={this.handleSourceChange}
              selectLabel="Select a Source*"/>
        </div>
        <div className={styles.adapterDivider}></div>
        <div>
          <div className={styles.adapterContainer}>
            <div className={styles.adapterHeader}>
              Configure Ingestion Adapter
            </div>
            <div className={styles.adapterDescription}>
              Complete the required fields below to configure the adapter that will ingesti your content.
            </div>
          </div>
          <div>
            <div className={styles.adapterContainer} style={{display: 'flex', flexDirection: 'row'}}>
              <div className={styles.adapterIconContainer}>
                <Image src={this.props.adapterConfig.logoPath} width={44} height={44} border={true} />
              </div>
              <div>
                <div className={styles.adapterHeader}>
                  {this.props.adapterConfig.name}
                </div>
                <div className={styles.adapterDescription}>
                  {this.props.adapterConfig.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function copyRecurse(obj) {
  let current;
  if (typeof obj === 'object') {
    current = {};
    Object.keys(obj).forEach(key => {
      current[key] = copyRecurse(obj[key]);
    });
  } else {
    current = obj;
  }
  return current;
}

function SourceSelector ({ initialValue, sources, handleSourceChange, selectLabel }) {
  let sourceMenuItems = sources.map(source => <MenuItem key={source.id} value={source.id}>{source.name}</MenuItem>);

  return (
    <div>
      <FormControl>
        <InputLabel htmlFor="select-source">Select a Source*</InputLabel>
        <Select
          value={initialValue}
          onChange={handleSourceChange}
          autoWidth={true}
          inputProps={{
            name: 'source',
            id: 'select-source',
          }}>
          {sourceMenuItems}
        </Select>
      </FormControl>
    </div>
    // <DynamicSelect
    //   initialValues={initialValues}
    //   sources={sources}
    //   handleSourceChange={handleSourceChange}
    //   selectLabel={selectLabel}/>
  );
}

export default {
  adapter: SDOAdapter,
  config: {
    adapterId: 'react-adapter',
    enableSchedule: true,
    enableProcess: true,
    enableCustomize: {
      setName: true
    }
  }
}