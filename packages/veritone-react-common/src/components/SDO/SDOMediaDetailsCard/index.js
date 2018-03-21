import React from 'react';

import {
  string,
  bool,
  arrayOf,
  number,
  any,
  objectOf,
  func
} from 'prop-types';

import { Field } from 'redux-form';

import { InputLabel } from 'material-ui/Input';
import {
  FormControl
} from 'material-ui/Form';
import {
  Checkbox,
} from 'components/formComponents';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import SDOTile from 'components/SDO/SDOTile';
import SDOCard from 'components/SDO/SDOCard';

import styles from './styles.scss';

export default class SDOMediaDetailsCard extends React.Component {
  static propTypes = {
    sdoData: arrayOf(objectOf(any)).isRequired,
    schemaData: arrayOf(objectOf(any)).isRequired, // array of schema objects
    sdoEngineInfo: objectOf(any),

    currentSchema: string, // the id of the current schema, if not provided, get the first instance
    schemaCallback: func
  };

  static defaultProps = {};

  state = {
    checkedAll: false,
    schemaSelection: this.props.currentSchema || {},
    engineSelection: this.props.sdoEngineInfo.engineSelection || '<Engine Name>',
  };

  componentWillMount = () => {
    // TODO: check the schemaData
    

    if (!this.props.currentSchema || !Object.keys(this.props.currentSchema).length) {
      // let currentSchema = this.props.schemaCallback(this.props.sdoData[0].schemaId); // if no schema passed, just get the first one //TODO: props attributes may change, schemaId might be something else now
      this.setState({
        schemaSelection: currentSchema
      });
    }
  };


  handleSchemaChange = (event) => {
    this.setState({
      schemaSelection: event.target.value
    });
  };

  handleEngineChange = (event) => {
    this.setState({
      engineSelection: event.target.value
    });
  };

  selectMenu = () => {
    console.log('menu selected');
  };


  handleCheckboxChange = () => {
    this.setState({
      checkedAll: !this.state.checkedAll
    });
  };

  render() {
    const schemaMenuItems = this.props.schemaData.map((schema, index) => {
      return <MenuItem value={schema} key={index}>{schema} (Schema Name)</MenuItem>
    });
    const engineMenuItems = this.props.sdoEngineInfo.engineSelections.map((engine, index) => {
      return <MenuItem value={engine} key={index}>{engine}</MenuItem>
    });
    const columnTitles = Object.keys(this.props.data[0]).map((title, index) => {
      return <span className={styles.sdoBasicColumn} key={index}>{title}</span>
    });
    // const sourceMenuItems = this.props.sdoSourceInfo.sourceSelections.map((source, index) => {
    //   return <MenuItem value={source} key={index}>{source} (Source Name)</MenuItem>
    // });
    const SDOTiles = this.props.data.map((SDO, index) => {
      return <SDOTile className={styles.tile} checkAll={this.state.checkedAll} columns={SDO} key={index} />
    });
    return (
      <div className={styles.fullPage}>
        <div className={styles.schemaSection}>
          <div className={styles.correlatedText}>Correlated Data</div>
          <div className={styles.schemaSelector}>
            <Select 
              className={styles.schemaSelect}
              value={this.state.schemaSelection}
              onChange={this.handleSchemaChange}
            >
              {schemaMenuItems}
            </Select>
            <Select 
              className={styles.engineSelect}
              value={this.state.engineSelection}
              onChange={this.handleEngineChange}
            >
              {engineMenuItems}
            </Select>
            <span className={styles.separator}></span>
            <IconButton className={styles.fullScreenIcon} aria-label='fullscreen'>
              <Icon className={'icon-expand2'}></Icon>
            </IconButton>
          </div>
        </div>
        <SDOCard sdoData={this.props.data} schemaData={} />
      </div>
    );
  };
};