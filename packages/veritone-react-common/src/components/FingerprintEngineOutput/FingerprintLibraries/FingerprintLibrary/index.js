import React, { Component } from 'react';
import { number, string, arrayOf, func, shape } from 'prop-types';
import classNames from 'classnames';

import Icon from 'material-ui/Icon';
import PillButton from '../../../share-components/buttons/PillButton';
import styles from './styles.scss';

export default class FingerprintLibrary extends Component {
  static propTypes = {
    className: string,
    libraryData: shape({
      name: string,
      libraryId: string,
      entities: arrayOf(shape({
        name: string,
        entityId: string,
        matches: arrayOf(shape({
          startTimeMs: number,
          stopTimeMs: number,
          object: shape({
            entityId: string,
            confidence: number
          })
        }))
      }))
    }),
    onClick: func,
    mediaPlayerTimeMs: number
  };

  static defaultProps = {
    mediaPlayerTimeMs: -1
  };

  renderEntities () {
    const {
      onClick,
      libraryData,
      mediaPlayerTimeMs
    } = this.props;
    
    if (libraryData && libraryData.entities) {
      return libraryData.entities.map((entityData => {
        return (
          <PillButton
            className={classNames(styles.entity)}
            label={entityData.name}
            info={'(' + entityData.matches.length + ')'}
            data={entityData}
            onClick={onClick}
            key={'finger-print-entity' + entityData.entityId + entityData.entityName}
          />
        );
      }));
    }
  }

  render () {
    const {
      className,
      libraryData,
    } = this.props;

    return (
      <div className={classNames(styles.fingerprintLibrary, className)}>
        <div className={classNames(styles.header)}>
          <Icon className={classNames('icon-library-app', styles.headerText)}/>
          <span className={classNames(styles.headerText)}> Library: </span>
          <span className={classNames(styles.headerText, styles.bold)}>
            {libraryData.name || libraryData.libraryId}
          </span>
        </div>
        <div className={classNames(styles.body)}>{this.renderEntities()}</div>
      </div>
    );
  }
}