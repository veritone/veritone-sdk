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
    sdoData: arrayOf(objectOf(any)).isRequired, // take an array of SDO objects
    schemaData: objectOf(objectOf(any)), // take the schema object
    callback: func
  };

  static defaultProps = {

  };

  state = {
    checkedAll: false,
    // sourceSelection: this.props.sdoSourceInfo.sourceSelection || ''
  };

  setupCallback = (data) => {
    console.log('callback for SDOCard');
    this.props.callback(data);
  };


  handleCheckboxChange = () => {
    this.setState({
      checkedAll: !this.state.checkedAll
    });
  };

  render() {
    const columnTitles = Object.keys(this.props.schemaData).map((title, index) => {
      return <span className={styles.sdoBasicColumn} key={index}>{title}</span>
    });
    // const sourceMenuItems = this.props.sdoSourceInfo.sourceSelections.map((source, index) => {
    //   return <MenuItem value={source} key={index}>{source} (Source Name)</MenuItem>
    // });
    const SDOTiles = this.props.sdoData.map((SDO, index) => {
      return <SDOTile checkAll={this.state.checkedAll} columns={SDO} key={index} />
    });
    return (
      <div className={styles.sdoCard}>
        <div className={styles.sdoTable}>
          <div className={styles.sdoTableTitle}>
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