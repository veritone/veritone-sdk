import React from 'react';

import { arrayOf, objectOf, any } from 'prop-types';

import SourceManagementGridCard from './GridCard';

import styles from './styles.scss';

export default class SourceManagementGridView extends React.Component {
  static propTypes = {
    sourceInfo: arrayOf(objectOf(any))
  };

  static defaultProps = {

  };

  state = {
    checkedAll: false
  };

  render() {
    const sources = this.props.sourceInfo.map((source, index) => {
      return <div className={styles.gridCards} key={index}>
              <SourceManagementGridCard checkedAll={this.state.checkedAll} name={source.name} sourceType={source.sourceType} status={source.status} creationDate={source.creationDate} lastIngestion={source.lastIngested} thumbnail={source.thumbnail} key={index}/>
            </div>
    });
    return (
      <div className={styles.grid}>
        {sources}
      </div>
    );
  };

};