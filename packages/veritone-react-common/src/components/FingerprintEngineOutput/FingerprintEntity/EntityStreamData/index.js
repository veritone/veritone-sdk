import React, { Component } from 'react';
import { number, string, arrayOf, func, shape } from 'prop-types';
import classNames from 'classnames';

import TextButton from '../../../share-components/buttons/TextButton';
import { msToReadableString } from '../../../../helpers/time';

import styles from './styles.scss';

export default class EntityStreamData extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number.isRequired,
        stopTimeMs: number.isRequired,
        object: shape({
          entityId: string.isRequired,
          confidenced: number
        })
      })
    ),
    className: string,
    onClick: func,
    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  handleOnClick = (event, value) => {
    this.props.onClick &&
      this.props.onClick(value.startTimeMs, value.stopTimeMs);
  };

  render() {
    const {
      data,
      className,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    const playerTimeEnabled = mediaPlayerTimeMs >= 0;
    const mediaPlayerStopTimeMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
    return (
      <div className={classNames(styles.fingerprintEntityMatches, className)}>
        {data.map(entry => {
          const entryStartTime = entry.startTimeMs;
          const entryStopTime = entry.stopTimeMs;
          const active =
            playerTimeEnabled &&
            !(
              mediaPlayerTimeMs > entryStopTime ||
              mediaPlayerStopTimeMs < entryStartTime
            );
          const label =
            msToReadableString(entryStartTime) +
            ' - ' +
            msToReadableString(entryStopTime);
          return (
            <TextButton
              label={label}
              data={entry}
              onClick={this.handleOnClick}
              key={`entity-match-${entryStartTime}-${entryStopTime}`}
              className={classNames(styles.textButton)}
              highlight={active}
            />
          );
        })}
      </div>
    );
  }
}
