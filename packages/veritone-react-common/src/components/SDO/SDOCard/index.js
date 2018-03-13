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

export default class SDOCard extends React.Component {
  static propTypes = {
    numberOfFields: number,
    data: arrayOf(any),
    sdoSourceInfo: objectOf(any),
    sdoSchemaInfo: objectOf(any),
    callback: func
  };

  static defaultProps = {

  };

  state = {
    checkedAll: false,
    // flexValue: 1 / (this.props.numberOfFields + 1),
    sourceSelection: this.props.sdoSourceInfo.sourceSelection || '',
    schemaSelection: this.props.sdoSchemaInfo.schemaSelection || ''
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


  handleCheckboxChange = () => {
    this.setState({
      checkedAll: !this.state.checkedAll
    });
  };

  render() {
    const schemaMenuItems = this.props.sdoSchemaInfo.schemaSelections.map((schema, index) => {
      return <MenuItem value={schema} key={index}>{schema} (Schema Name)</MenuItem>
    });
    const columnTitles = Object.keys(this.props.data[0]).map((title, index) => {
      return <span className={styles.sdoBasicColumn} key={index}>{title}</span>
    });
    const sourceMenuItems = this.props.sdoSourceInfo.sourceSelections.map((source, index) => {
      return <MenuItem value={source} key={index}>{source} (Source Name)</MenuItem>
    });
    const SDOTiles = this.props.data.map((SDO, index) => {
      return <SDOTile checkAll={this.state.checkedAll} numberOfFields={this.props.numberOfFields} columns={SDO} key={index} />
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
          <div className={styles.headerDescription}>Use the full screen below to view your data in a larger format.</div>
        </div>
        <div style={{height: '72px'}}>
          <div className={styles.schemaSelector}>
            <Select 
              className={styles.schemaSelect}
              value={this.state.schemaSelection}
              onChange={this.handleSchemaChange}
            >
              {schemaMenuItems}
            </Select>
            <IconButton className={styles.searchIcon} aria-label='search'>
              <Icon className={'icon-search'}></Icon>
            </IconButton>
            <IconButton className={styles.menuIcon} aria-label='menu'>
              <Icon className={'icon-more_vert'}></Icon>
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
            <Select 
              className={styles.sourceSelect}
              value={this.state.sourceSelection}
              onChange={this.handleSourceChange}
            >
              {sourceMenuItems}
            </Select>
          </div>
          <div className={styles.sdoTable}>
            <div className={styles.sdoTableTitle}>
              <Checkbox
                input={{
                  onChange: this.handleCheckboxChange,
                  value: this.state.checkedAll
                }}
                className={styles.checkbox}
                label=''
              />
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