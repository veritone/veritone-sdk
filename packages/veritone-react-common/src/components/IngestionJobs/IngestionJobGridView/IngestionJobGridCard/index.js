import React from 'react';

import {
  string,
  bool,
  func,
  arrayOf,
  number,
  objectOf,
  any
} from 'prop-types';

import styles from './styles.scss';

import {
  Checkbox
} from 'components/formComponents';


export default class IngestionJobGridCard extends React.Component {
  static propTypes = {
    checkedAll: bool,
    jobName: string,
    status: string,
    creationDate: string,
    thumbnail: string
  };

  static defaultProps = {

  };

  state = {
    checked: this.props.checkedAll || false
  };

  handleCheckboxChange = () => {
    this.setState({
      checked: !this.state.checked
    });
  };

  render() {
    
    return (
      <div className={styles.sdoCard}>
        <div className={styles.jobThumbnail}>
          <img className={styles.imageStyle} src={this.props.thumbnail} alt='' />
        </div>
        <div className={styles.jobDetails}>
        {/* BELOW IS A HACK FOR GETTING CHECKBOX BACKGROUND TO BE WHITE */}
        <div className={styles.checkboxBackground}></div>
        <Checkbox
          input={{
            onChange: this.handleCheckboxChange,
            value: this.state.checked
          }}
          className={styles.checkbox}
          color='primary'
          classes={{
            checked: styles.checkboxPrimary
          }}
          label=''
        />
          <div className={styles.jobName}>{this.props.jobName}</div>
          <div className={styles.schemaVersion}>{this.props.status}</div>
          <div className={styles.creationDate}>{this.props.creationDate}</div>
        </div>
      </div>
    );
  };
}

