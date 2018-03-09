import React from 'react';

import {
  string,
  bool,
  arrayOf,
  number,
  any,
  objectOf
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

import SDOTile from 'components/SDO/SDOTile';

import styles from './styles.scss';

export default class SDOCard extends React.Component {
  static propTypes = {
    numberOfFields: number,
    data: arrayOf(any),
    sdoSourceInfo: objectOf(any)
  };

  static defaultProps = {

  };

  state = {
    checkedAll: false,
    flexValue: 1 / (this.props.numberOfFields + 1),
    // attributeCount: this.props.data[0].attributes.length, // should be dynamic, set for testing
    
  };

  handleSelectChange = (event) => {
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
      return <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}} key={index}>{title}</span>
    });
    const menuItems = this.props.sdoSourceInfo.sourceSelections.map((source, index) => {
      return <MenuItem value={source} key={index}>{source}</MenuItem>
    });
    const SDOTiles = this.props.data.map((SDO, index) => {
      return <SDOTile checkAll={this.state.checkedAll} numberOfFields={this.props.numberOfFields} columns={SDO} key={index} />
    });
    return (
      <div>
        <div className={styles.tableCard}>
          <div className={styles.sourceTitle}>
            <div className={styles.sourceTitleGroup}>
              <img src={this.props.sdoSourceInfo.sourceImage} alt='' className={styles.imageStyle} />
              <div className={styles.sourceName}>
                {this.props.sdoSourceInfo.sourceName} (Source Name)
              </div>
            </div>
            <Select 
              className={styles.sourceSelect}
              value={this.props.sdoSourceInfo.sourceSelection}
              onChange={this.handleSelectChange}
              >
              {menuItems}
            </Select>
          </div>
          <div className={styles.sdoTableTitle}>
            <Checkbox
              input={{
                onChange: this.handleCheckboxChange,
                value: this.state.checkedAll
              }}
              className={styles.checkbox}
              style={{flex: this.state.flexValue}}
              label=''
            />
            {columnTitles}
            {/* <Attributes attributes={this.state.attributeCount} flexValue={this.state.flexValue}/> */}
          </div>
          {SDOTiles}
        </div>
      </div>
    );
  }

};