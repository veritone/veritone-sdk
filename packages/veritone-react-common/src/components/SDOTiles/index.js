import React from 'react';

import {
  string,
  bool,
  arrayOf,
  number
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

import SDOTile from './SDOTile';

import styles from './styles.scss';

export default class SDOTiles extends React.Component {
  static propTypes = {
    numberOfFields: number
  };

  static defaultProps = {
    numberOfFields: 9 // includes the checkbox
  };

  state = {
    checkedAll: false,
    flexValue: 1 / this.props.numberOfFields,
    attributeCount: 3, // should be dynamic, set for testing
    sourceName: '@therealtrump',
    sourceImage: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    sourceSelection: 'therealtrump (Source Name)',
    sourceSelections: ['therealtrump (Source Name)', 'therealstump (Source Name)']
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
    const menuItems = this.state.sourceSelections.map((source, index) => {
      return <MenuItem value={source} key={index}>{source}</MenuItem>
    });
    return (
      <div>
        <div className={styles.tableCard}>
          <div className={styles.sourceTitle}>
            <div className={styles.sourceTitleGroup}>
              <img src={this.state.sourceImage} alt='' className={styles.imageStyle} />
              <div className={styles.sourceName}>
                {this.state.sourceName} (Source Name)
              </div>
            </div>
            <Select 
              className={styles.sourceSelect}
              value={this.state.sourceSelection}
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
            <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>created_at</span>
            <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>name</span>
            <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>time_zone</span>
            <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>text</span>

            <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}}>profile_image</span>
            <Attributes attributes={this.state.attributeCount} flexValue={this.state.flexValue}/>

            
          </div>
          <SDOTile/>
        </div>
      </div>
    );
  }

};


function Attributes(props) {
  const attributes = props.attributes;
  const flexValue = props.flexValue;
  let spans = [];
  for (let i = 0; i < attributes; i++) {
    spans.push(<span className={styles.sdoBasicColumn} style={{flex: flexValue}} key={i}>Attribute</span>);
  }
  return spans;
};