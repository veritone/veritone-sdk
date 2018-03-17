import React from 'react';

import {
  string,
  bool,
  arrayOf,
  number,
  any,
  objectOf
} from 'prop-types';

import {
  Checkbox,
} from 'components/formComponents';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import SDOTile from 'components/SDO/SDOTile';

import styles from './styles.scss';

export default class IngestionJobFullScreen extends React.Component {
  static propTypes = {
    data: arrayOf(any).isRequired,
    sdoSchemaInfo: objectOf(any).isRequired,
    jobInfo: objectOf(any).isRequired
  };

  static defaultProps = {

  };

  state = {
    checkedAll: false, 
    schemaSelection: this.props.sdoSchemaInfo.schemas[0].schemaName   
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
    const columnTitles = Object.keys(this.props.data[0]).map((title, index) => {
      return <span className={styles.sdoBasicColumn} style={{flex: this.state.flexValue}} key={index}>{title}</span>
    });
    const SDOTiles = this.props.data.map((SDO, index) => {
      return <SDOTile checkAll={this.state.checkedAll} numberOfFields={this.props.numberOfFields} columns={SDO} key={index} />
    });
    const schemaMenuItems = this.props.sdoSchemaInfo.schemas.map((schema, index) => {
      return <MenuItem value={schema.schemaName} key={index}>{schema.schemaName} Version {schema.version}</MenuItem>
    });
    return (
      <div className={styles.fullPage}>
        <div className={styles.fullScreenTopBar}>
          <div className={styles.topBarTitle}>{this.props.jobInfo.jobName}</div>
          <div className={styles.iconGroup}>
            <IconButton className={styles.helpIcon} aria-label='help'>
              <Icon className={'icon-help2'}></Icon>
            </IconButton>
            {/* <IconButton className={styles.menuIcon} aria-label='menu'>
              <Icon className={'icon-more_vert'}></Icon>
            </IconButton> */}
            <span className={styles.separator}></span>
            <IconButton className={styles.exitIcon} aria-label='exit'>
              <Icon className={'icon-close-exit'}></Icon>
            </IconButton>
          </div>
        </div>
        <div className={styles.tableCard}>
          <div className={styles.schemaTitle}>
            <div className={styles.schemaTitleGroup}>
              <div className={styles.imageWrapper}>
                <img src={this.props.jobInfo.thumbnail} alt='https://static.veritone.com/veritone-ui/default-nullstate.svg' className={styles.imageStyle} />
              </div>
              <div className={styles.jobName}>
                {this.props.jobInfo.jobName}
              </div>
            </div>
            <div className={styles.schemaGroup}>
              <Select 
                className={styles.schemaSelect}
                value={this.state.schemaSelection}
                onChange={this.handleSchemaChange}
              >
                {schemaMenuItems}
              </Select>
              <div className={styles.separator} />
              <IconButton className={styles.exportIcon} aria-label='export'>
                <Icon className={'icon-file_download'}></Icon>
              </IconButton>
            </div>
          </div>
          <div className={styles.sdoTableTitle}>
            {columnTitles}
          </div>
          {SDOTiles}
        </div>
      </div>
    );
  };
};