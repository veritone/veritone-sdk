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

import SDOSourceCard from './DataSetSourceCard';

import styles from './styles.scss';


export default class DataSetSourceView extends React.Component {
  static propTypes = {
    sourceData: arrayOf(objectOf(any)).isRequired
  };

  static defaultProps = {

  };

  state = {
    checkedAll: false
  };

  render() {
    const sources = this.props.sourceData.map((source, index) => {
      return <div className={styles.gridCards}><SDOSourceCard checkedAll={this.state.checkedAll} sourceName={source.sourceName} schemaVersion={source.schemaVersion} creationDate={source.creationDate} thumbnail={source.thumbnail} key={index}/></div>
    });
    return (
      <div className={styles.sourcesGrid}>
        {sources}
      </div>
    );
  };
}