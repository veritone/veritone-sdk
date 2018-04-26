import React, { Component } from 'react';
import { bool, number, string, func, shape } from 'prop-types';

import classNames from 'classnames';

import TextButton from '../../../share-components/buttons/TextButton';
import styles from './styles.scss';

export default class GeoTimeEntry extends Component {
  static propTypes = {
    data: shape({
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
    }),
    onClick: func,
    className: string
  };

  handleOnClick = () => {
    const { data, onClick } = this.props;

    onClick && onClick(data.startTimeMs, data.stopTimeMs);
  };

  render() {
    const { data, className } = this.props;

    const timeLabel = data.startTimeStamp + ' - ' + data.stopTimeStamp;

    return (
      <div className={classNames(styles.geoTimeEntry, className)}>
        <TextButton
          label={timeLabel}
          highlight={data.active}
          onClick={this.handleOnClick}
        />
        <div className={classNames(styles.gps)}>
          <span>
            <span className={classNames(styles.label)}>Lat:&nbsp;</span>
            <span>{data.latitude}</span>
          </span>
          <span>
            <span className={classNames(styles.label)}>Long:&nbsp;</span>
            <span>{data.longitude}</span>
          </span>
        </div>
      </div>
    );
  }
}
