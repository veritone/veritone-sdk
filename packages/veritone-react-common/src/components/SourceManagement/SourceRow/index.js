import React from 'react';

import {
  string
} from 'prop-types';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import CircleImage from 'components/CircleImage';
import styles from './styles.scss';

export default class JobRow extends React.Component {
  static propTypes = {
    name: string,
    sourceType: string,
    creationDate: string,
    lastUpdated: string,
    thumbnail: string
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
          <div className={styles.imageStyle}>
            <CircleImage height={'38px'} width={'38px'} image={this.props.thumbnail}/>
          </div>
          <span className={styles.mainColumn}>{this.props.name}</span>
          <span className={styles.columnText}>{this.props.sourceType}</span>

          <span className={styles.columnText}>{creationDate}</span>
          {/* <span className={styles.columnText}>{this.props.creationDate}</span> */}
          <span className={styles.columnText}>{lastUpdated}</span>
          
        </div>
        <IconButton className={styles.menuIcon} onClick={this.handleMenuClick} aria-label='menu'>
          <Icon className='icon-more_vert' />
        </IconButton>
      </div>
    );
  };
};




