import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

export default class EntityMetadata extends Component {
  static propTypes = {
    jsondata: shape({}),
    className: string
  };

  render() {
    const { jsondata, className } = this.props;

    return (
      <div className={classNames(styles.fingerprintEntityMetadata, className)}>
        {Object.keys(jsondata).map(propName => {
          const propVal = jsondata[propName];
          return (
            <div
              className={classNames(styles.entry)}
              key={'metadata-' + propName + '-' + propVal}
            >
              <div className={classNames(styles.label)}>{propName}</div>
              <div>{propVal}</div>
            </div>
          );
        })}
      </div>
    );
  }
}
