import React, { Component } from 'react';
import { number, string, arrayOf, func, shape } from 'prop-types';
import classNames from 'classnames';
import { keyBy, sortBy, toArray } from 'lodash';

import EngineOutputHeader from '../EngineOutputHeader';
import FingerprintContent from './FingerprintContent';
import styles from './styles.scss';

export default class FingerprintEngineOutput extends Component {
  static propTypes = {
    title: string,

    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(
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
    ),

    entities: arrayOf(
      shape({
        name: string,
        entityId: string,
        libraryId: string,
        description: string,
        profileImageUrl: string,
        jsondata: shape({})
      })
    ),

    libraries: arrayOf(
      shape({
        name: string,
        libraryId: string,
        description: string
      })
    ),
    onClick: func,

    engines: arrayOf(
      shape({
        sourceEngineId: string,
        sourceEngineName: string
      })
    ),
    selectedEngineId: string,
    onEngineChange: func,
    onExpandClicked: func,

    className: string,
    headerClassName: string,
    contentClassName: string,
    libraryClassName: string,
    entityClassName: string,
    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  static defaultProps = {
    data: [],
    entities: [],
    libraries: [],
    title: 'A/V Fingerprinting',
    mediaPlayerTimeMs: -1,
    mediaPlayerTimeIntervalMs: 0
  };

  formatPropsData () {
    const {
      data,
      entities,
      libraries,
    } = this.props;

    const entitiesMap = keyBy(entities, 'entityId');
    const librariesMap = keyBy(libraries, 'libraryId');

    sortBy(data, 'startTimeMs', 'endTimeMs');
    data.forEach(dataChunk => {
      const series = dataChunk.series;
      if (series) {

        sortBy(series, 'startTimeMs', 'endTimeMs');
        series.forEach(entry => {
          if (entry.object && entry.object.entityId) {
            const entityId = entry.object.entityId;
            const entity = entitiesMap[entityId];
            if (entity) {       
              // entry match with a valid entity
              const libraryId = entity.libraryId;
              const library = librariesMap[libraryId];
              if (library) {
                (entity.matches) ? entity.matches.push(entry) : entity.matches = [entry];           // Add entry to matching entity

                if (!entity.libraryName) {                                                            // Entity hasn't been registered to any library object
                  (library.entities) ? library.entities.push(entity) : library.entities = [entity]; // Add entity to matching library
                  entity.libraryName = library.name;
                }
              } else {
                // Ignore Unknow Library (for now)
              }
            } else {
              // Ignore Unknow Entity (for now)
            }
          }
        })
      }
    });

    return toArray(librariesMap);
  }

  renderHeader () {
    const {
      title,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClicked,
      headerClassName
    } = this.props;

    return (
      <EngineOutputHeader
        title={title}
        engines={engines}
        selectedEngineId={selectedEngineId}
        onEngineChange={onEngineChange}
        onExpandClicked={onExpandClicked}
        className={classNames(headerClassName)}
      />
    );
  }

  renderBody () {
    const {
      onClick,
      contentClassName,
      entityClassName,
      libraryClassName,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    const libraryContents = this.formatPropsData();

    return (
      <FingerprintContent 
        libraries={libraryContents}
        className={contentClassName}
        entityClassName={entityClassName}
        libraryClassName={libraryClassName}
        mediaPlayerTimeMs={mediaPlayerTimeMs}
        mediaPlayerTimeIntervalMs={mediaPlayerTimeIntervalMs}
        onClick={onClick}
      />
    );
  }

  render () {
    return (
      <div className={classNames(styles.fingerprintOutput, this.props.className)}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    )
  }
}