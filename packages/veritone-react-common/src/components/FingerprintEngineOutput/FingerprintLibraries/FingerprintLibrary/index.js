import React, { Component } from 'react';
import { number, string, arrayOf, func, shape } from 'prop-types';
import classNames from 'classnames';

import Icon from '@material-ui/core/Icon';
import PillButton from '../../../share-components/buttons/PillButton';
import styles from './styles.scss';

export default class FingerprintLibrary extends Component {
  static propTypes = {
    className: string,
    libraryData: shape({
      name: string.isRequired,
      id: string.isRequired,
      entities: arrayOf(
        shape({
          name: string.isRequired,
          id: string.isRequired,
          description: string,
          matches: arrayOf(
            shape({
              startTimeMs: number.isRequired,
              stopTimeMs: number.isRequired,
              object: shape({
                entityId: string.isRequired,
                confidence: number
              })
            })
          )
        })
      )
    }),
    onClick: func,
    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  static defaultProps = {
    mediaPlayerTimeMs: -1,
    mediaPlayerTimeIntervalMs: 0
  };

  renderEntities() {
    const {
      onClick,
      libraryData,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    const playerTimeEnabled = mediaPlayerTimeMs >= 0;
    const mediaPlayerStopTimeMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;

    if (libraryData && libraryData.entities) {
      return libraryData.entities.map(entityData => {
        let active = false;
        if (entityData && entityData.matches) {
          for (const entry of entityData.matches) {
            const entryStartTime = entry.startTimeMs;
            const entryStopTime = entry.stopTimeMs;
            if (
              playerTimeEnabled &&
              !(
                mediaPlayerTimeMs > entryStopTime ||
                mediaPlayerStopTimeMs < entryStartTime
              )
            ) {
              active = true;
              break;
            }
          }
        }

        return (
          <PillButton
            className={classNames(styles.entity)}
            label={entityData.name}
            info={'(' + entityData.matches.length + ')'}
            data={entityData}
            onClick={onClick}
            highlight={active}
            key={`finger-print-entity-${entityData.id}-${entityData.name}`}
          />
        );
      });
    }
  }

  render() {
    const { className, libraryData } = this.props;

    return (
      <div className={classNames(styles.fingerprintLibrary, className)}>
        <div className={classNames(styles.header)}>
          <Icon className={classNames('icon-library-app', styles.headerText)} />
          <span className={classNames(styles.headerText)}> Library: </span>
          <span className={classNames(styles.headerText, styles.bold)}>
            {libraryData.name || libraryData.id}
          </span>
        </div>
        <div className={classNames(styles.body)}>{this.renderEntities()}</div>
      </div>
    );
  }
}
