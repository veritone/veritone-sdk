import React from 'react';

import {
  bool,
  any,
  string
} from 'prop-types';

import {
  Checkbox,
} from 'components/formComponents';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import StatusPill from 'components/IngestionJobs/StatusPill';
import styles from './styles.scss';

export default class JobRow extends React.Component {
  static propTypes = {
    name: string,
    sourceType: string,
    creationDate: string,
    lastUpdated: string
  };

  static defaultProps = {};

  state = {
  };


  handleRowClick = (event) => {
    console.log('row clicked');
  };

  handleMenuClick = (event) => {
    console.log("menu clicked");
  };

  render() {
    let newDate = new Date(this.props.creationDate).toString().split(' ');
    newDate.splice(5,1);
    const creationDate = newDate.join(' ');
    newDate = new Date(this.props.lastUpdated).toString().split(' ');
    newDate.splice(5,1);
    const lastUpdated = newDate.join(' ');

    return (
      <div className={styles.tableRow} >
        <div className={styles.rowTextGroup} onClick={this.handleRowClick}>
          <span className={styles.mainColumn}>{this.props.name}</span>
          <span className={styles.columnText}>{this.props.sourceType}</span>

          <span className={styles.columnText}>{creationDate}</span>
          {/* <span className={styles.columnText}>{this.props.creationDate}</span> */}
          <span className={styles.columnText}>{lastUpdated}</span>
          
        </div>
        <IconButton className={styles.menuIcon} onClick={this.handleMenuClick} aria-label='menu'>
          <Icon className={'icon-more_vert'}></Icon>
        </IconButton>
      </div>
    );
  };
};




