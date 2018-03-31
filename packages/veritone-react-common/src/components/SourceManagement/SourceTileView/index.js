import React from 'react';

import {
  arrayOf,
  any,
  objectOf
} from 'prop-types';
import SourceRow from 'components/SourceManagement/SourceRow';
import CircleImage from 'components/CircleImage';

import styles from './styles.scss';

export default class SourceTileView extends React.Component {
  static propTypes = {
    sources: arrayOf(objectOf(any)).isRequired // an array of source objects
  };

  static defaultProps = {
    sources: []
  };

  render() {
    const sourceRows = this.props.sources.map((source, index) => {
      const dataSource = source.data.source;
      return (
        <SourceRow
          name={dataSource.name}
          sourceType={dataSource.sourceType.name}
          creationDate={dataSource.createdDateTime}
          lastUpdated={dataSource.modifiedDateTime}
          thumbnail={dataSource.thumbnail}
          key={index}
        />
      );
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
          <div style={{width: '55px'}} />
        </div>
        {sourceRows}
      </div>
    );
  };
}