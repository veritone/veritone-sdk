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
    sourceName: string,
    schemaVersion: string,
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
        <div className={styles.sourceThumbnail}>
          <img className={styles.imageStyle} src={this.props.thumbnail} alt='' />
        </div>
        <div className={styles.sourceDetails}>
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
          <div className={styles.sourceName}>{this.props.sourceName}</div>
          <div className={styles.schemaVersion}>{this.props.schemaVersion}</div>
          <div className={styles.creationDate}>{this.props.creationDate}</div>
        </div>
      </div>
    );
  };
}

