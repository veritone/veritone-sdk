import React, { Component } from 'react';
import { number, string, func, shape, arrayOf, bool } from 'prop-types';

import classNames from 'classnames';

import GeoTimeEntry from './GeoTimeEntry';
import styles from './styles.scss';

export default class GeoTimeView extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        startTimeStamp: string.isRequired,
        stopTimeStamp: string.isRequired,
        active: bool,
        latitude: number,
        longitude: number,
        precision: number,
        direction: number,
        velocity: number,
        altitude: number
      })
    ),
    className: string,
    onClick: func
  };

  render() {
    const { data, onClick, className } = this.props;

    return (
      <div className={classNames(styles.geoTimeView, className)}>
        {data &&
          data.map(entry => {
            return (
              <GeoTimeEntry
                data={entry}
                onClick={onClick}
                key={`geo-entry-${entry.startTimeMs}-${entry.stopTimeMs}-${
                  entry.latitude
                }-${entry.longitude}`}
              />
            );
          })}
      </div>
    );
  }
}
