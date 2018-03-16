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

import styles from './styles.scss';

export default class SDOMediaDetailsCard extends React.Component {
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

  selectMenu = () => {
    console.log('menu selected');
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
        <div className={styles.sdoCard}>
          <div className={styles.sourceTitle}>
            <div className={styles.sourceTitleGroup}>
              <img src={this.props.sdoSourceInfo.sourceImage} alt='' className={styles.imageStyle} />
              <div className={styles.sourceName}>
                {this.props.sdoSourceInfo.sourceName} (Source Name)
              </div>
            </div>
            <div className={styles.sourceSelectGroup}>
              <Select 
                className={styles.sourceSelect}
                value={this.state.sourceSelection}
                onChange={this.handleSourceChange}
              >
                {sourceMenuItems}
              </Select>
              <IconButton className={styles.menuIcon} onClick={this.selectMenu} aria-label='menu'>
                <Icon className={'icon-more_vert'}></Icon>
              </IconButton>
            </div>
          </div>
          <div className={styles.sdoTable}>
            <div className={styles.sdoTableTitle}>
              {/* <Checkbox
                input={{
                  onChange: this.handleCheckboxChange,
                  value: this.state.checkedAll
                }}
                className={styles.checkbox}
                label=''
              /> */}
              {columnTitles}
            </div>
            <div className={styles.tableRows}>
              {SDOTiles}
            </div>
          </div>
        </div>
      </div>
    );
  };
};