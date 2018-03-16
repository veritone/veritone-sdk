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
    data: arrayOf(any),
    sdoSourceInfo: objectOf(any),
    callback: func
  };

  static defaultProps = {

  };

  state = {
    checkedAll: false,
    sourceSelection: this.props.sdoSourceInfo.sourceSelection || ''
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


  handleCheckboxChange = () => {
    this.setState({
      checkedAll: !this.state.checkedAll
    });
  };

  render() {
    const columnTitles = Object.keys(this.props.data[0]).map((title, index) => {
      return <span className={styles.sdoBasicColumn} key={index}>{title}</span>
    });
    const sourceMenuItems = this.props.sdoSourceInfo.sourceSelections.map((source, index) => {
      return <MenuItem value={source} key={index}>{source} (Source Name)</MenuItem>
    });
    const SDOTiles = this.props.data.map((SDO, index) => {
      return <SDOTile checkAll={this.state.checkedAll} columns={SDO} key={index} />
    });
    return (
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
            <div className={styles.separator}/>
            <IconButton className={styles.searchIcon} aria-label='search'>
              <Icon className={'icon-search'}></Icon>
            </IconButton>
            <IconButton className={styles.exportIcon} aria-label='export'>
              <Icon className={'icon-file_download'}></Icon>
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
    );
  };
};