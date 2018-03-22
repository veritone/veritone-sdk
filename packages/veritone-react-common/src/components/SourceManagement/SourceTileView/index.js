import React from 'react';

import {
  string,
  bool,
  arrayOf,
  number,
  any,
  objectOf
} from 'prop-types';


import { MenuItem } from 'material-ui/Menu';

import SourceRow from 'components/SourceManagement/SourceRow';
import CircleImage from 'components/CircleImage';

import styles from './styles.scss';

export default class SourceTileView extends React.Component {
  static propTypes = {
    sources: arrayOf(objectOf(any)).isRequired // an array of source objects
  };

  static defaultProps = {};

  state = {
  };

  render() {
    const sourceRows = this.props.sources.map((source, index) => {
      let sourceName = source.data.source.name;
      let sourceType = source.data.source.sourceType.name;
      let creationDate = source.data.source.createdDateTime;
      let lastUpdated = source.data.source.modifiedDateTime;
      let thumbnail = source.data.source.thumbnail;
      return <SourceRow name={sourceName} sourceType={sourceType} creationDate={creationDate} lastUpdated={lastUpdated} thumbnail={thumbnail} key={index}/>
    });
    return (
      <div>
        <div className={styles.tableTitleRow}>
          <div className={styles.titleTextGroup}>
            <div className={styles.imageStyle} style={{visibility: 'hidden'}}>
              <CircleImage height={'38px'} />
            </div>
            <span className={styles.mainColumn}>Source name</span>
            <span className={styles.tableTitle}>Source Type</span>
            <span className={styles.tableTitle}>Created</span>
            <span className={styles.tableTitle}>Updated</span>
          </div>
          <div style={{width: '55px'}}></div>
        </div>
        {sourceRows}
      </div>
    );
  };
}