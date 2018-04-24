import React, { Component } from 'react';
import { number, string, arrayOf, func, shape } from 'prop-types';
import classNames from 'classnames';

import FingerprintLibrary from './FingerprintLibrary';

export default class FingerPrintLibraries extends Component {
  static propTypes = {
    className: string,
    libraries: arrayOf(
      shape({
        name: string,
        libraryId: string,
        entities: arrayOf(
          shape({
            name: string,
            entityId: string,
            matches: arrayOf(
              shape({
                startTimeMs: number,
                stopTimeMs: number,
                object: shape({
                  entityId: string,
                  confidence: number
                })
              })
            )
          })
        )
      })
    ),
    onClick:func,
    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  static defaultProps = {
    libraries: [],
    mediaPlayerTimeMs: -1,
    mediaPlayerTimeIntervalMs: 0
  };

  render () {
    const {
      libraries,
      className,
      onClick,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    return (
      <div className={classNames(className)}>
        {
          libraries.map((libraryData) => {
            if (libraryData.entities) {
              return (
                <FingerprintLibrary
                  libraryData={libraryData}
                  onClick={onClick}
                  key={'fingerprint-lib-'+libraryData.libraryId}
                  mediaPlayerTimeMs={mediaPlayerTimeMs}
                  mediaPlayerTimeIntervalMs={mediaPlayerTimeIntervalMs}
                />
              );
            }
          })
        }
      </div>
    )
  }
}