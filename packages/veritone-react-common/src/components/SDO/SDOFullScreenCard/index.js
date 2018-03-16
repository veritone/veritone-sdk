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

export default class SDOFullScreenCard extends React.Component {
  static propTypes = {
    data: arrayOf(any),
    sdoSourceInfo: objectOf(any),
    sdoSchemaInfo: objectOf(any),
    sdoEngineInfo: objectOf(any),
    callback: func
  };

  static defaultProps = {

  };

  state = {
    checkedAll: false,
    sourceSelection: this.props.sdoSourceInfo.sourceSelection || '',
    schemaSelection: this.props.sdoSchemaInfo.schemaSelection || '',
    engineSelection: this.props.sdoEngineInfo.engineSelection || '<Engine Name>',
  };

  setupCallback = (data) => {
    console.log('callback for SDOCard');
    this.props.callback(data);
  };

  handleSourceChange = (event) => {
    this.setState({
      sourceSelection: event.target.value
    });
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


  handleCheckboxChange = () => {
    this.setState({
      checkedAll: !this.state.checkedAll
    });
  };

  render() {
    const schemaMenuItems = this.props.sdoSchemaInfo.schemaSelections.map((schema, index) => {
      return <MenuItem value={schema} key={index}>{schema} (Schema Name)</MenuItem>
    });
    const engineMenuItems = this.props.sdoEngineInfo.engineSelections.map((engine, index) => {
      return <MenuItem value={engine} key={index}>{engine}</MenuItem>
    });
    const columnTitles = Object.keys(this.props.data[0]).map((title, index) => {
      return <span className={styles.sdoBasicColumn} key={index}>{title}</span>
    });
    const sourceMenuItems = this.props.sdoSourceInfo.sourceSelections.map((source, index) => {
      return <MenuItem value={source} key={index}>{source} (Source Name)</MenuItem>
    });
    const SDOTiles = this.props.data.map((SDO, index) => {
      return <SDOTile className={styles.tile} checkAll={this.state.checkedAll} columns={SDO} key={index} />
    });
    return (
      <div className={styles.fullPage}>
        <div className={styles.fullScreenHeader}>
          <div className={styles.fullScreenTitle}>
            <IconButton className={styles.arrowIcon} aria-label='help'>
              <Icon className={'icon-arrow-back'}></Icon>
            </IconButton>
            <div className={styles.titleText}>Full Screen Mode: Correlated Data</div>
          </div>
          <div className={styles.headerDescriptionGroup}>
            <div className={styles.headerDescription}>Use the full screen below to view your data in a larger format.</div>
            <div className={styles.runProcess}> {/* TODO: This should probably be a button, but don't know how to custom make the button*/}
              <IconButton className={styles.processIcon} aria-label='process'>
                <Icon className={'icon-run-process'}></Icon>
              </IconButton>
              <div className={styles.processText}>RUN PROCESS</div>
            </div>
          </div>
        </div>
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
            {/* <IconButton className={styles.searchIcon} aria-label='search'>
              <Icon className={'icon-search'}></Icon>
            </IconButton>
            <IconButton className={styles.menuIcon} aria-label='menu'>
              <Icon className={'icon-more_vert'}></Icon>
            </IconButton> */}
          </div>
        </div>
        <SDOCard data={this.props.data} sdoSourceInfo={this.props.sdoSourceInfo} />
      </div>
    );
  };
};