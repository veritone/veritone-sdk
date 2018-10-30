import React, { Component } from 'react';
import { number, string, arrayOf, func, shape, node } from 'prop-types';
import classNames from 'classnames';
import { keyBy, sortBy, toArray, cloneDeep, some } from 'lodash';

import EngineOutputHeader from '../EngineOutputHeader';
import FingerprintContent from './FingerprintContent';
import styles from './styles.scss';

const UNKNOWN_ENTITY_TMPL = {
  name: 'Unknown entity',
  id: '',
  libraryId: '',
  description: 'Unknown entity',
  profileImageUrl: '//static.veritone.com/veritone-ui/default-nullstate.svg',
  jsondata: {}
};

const UNKNOWN_LIBRARY_TMPL = {
  name: 'Unknown library',
  id: '',
  description: 'Unknown library'
};

export default class FingerprintEngineOutput extends Component {
  static propTypes = {
    title: string,
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            object: shape({
              entityId: string.isRequired,
              libraryId: string,
              confidence: number
            })
          })
        )
      })
    ),
    entities: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        description: string,
        profileImageUrl: string,
        jsondata: shape({}),
        libraryId: string,
        library: shape({
          id: string.isRequired,
          name: string.isRequired,
          description: string,
          coverImageUrl: string
        })
      })
    ),
    engines: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    outputNullState: node,
    selectedEngineId: string,

    onClick: func,
    onEngineChange: func,
    onExpandClick: func,

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
    title: 'A/V Fingerprinting',
    mediaPlayerTimeMs: -1,
    mediaPlayerTimeIntervalMs: 0
  };

  formatPropsData() {
    const { data, entities } = this.props;

    const entitiesMap = keyBy(cloneDeep(entities), 'id'); // deep copy entities to avoid changing original
    const libraries = entities
      .filter(entity => entity.library && entity.library.id)
      .map(entity => entity.library);
    const librariesMap = keyBy(libraries, 'id');

    sortBy(data, 'startTimeMs', 'stopTimeMs');
    data.forEach(dataChunk => {
      const series = dataChunk.series;
      if (series) {
        sortBy(series, 'startTimeMs', 'stopTimeMs');
        series.forEach(entry => {
          if (entry.object && entry.object.entityId) {
            const entityId = entry.object.entityId;
            if (!entitiesMap[entityId]) {
              const unknownEntity = Object.assign({}, UNKNOWN_ENTITY_TMPL);
              unknownEntity.id = entityId;
              unknownEntity.libraryId = entry.object.libraryId;
              entitiesMap[entityId] = unknownEntity;
            }
            const entity = entitiesMap[entityId];
            const libraryId = entity.libraryId;
            if (!librariesMap[libraryId]) {
              const unknownLibrary = Object.assign({}, UNKNOWN_LIBRARY_TMPL);
              unknownLibrary.id = libraryId;
              librariesMap[libraryId] = unknownLibrary;
            }
            const library = librariesMap[libraryId];
            entity.matches
              ? entity.matches.push(entry)
              : (entity.matches = [entry]); // Add entry to matching entity
            entity.libraryName = library.name;
            if (!library.entities) {
              library.entities = [entity];
            } else if (!some(library.entities, { 'id': entity.id })) {
              library.entities.push(entity)
            }
          }
        });
      }
    });

    return toArray(librariesMap);
  }

  renderHeader() {
    const {
      title,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClick,
      headerClassName
    } = this.props;

    return (
      <EngineOutputHeader
        title={title}
        engines={engines}
        selectedEngineId={selectedEngineId}
        onEngineChange={onEngineChange}
        onExpandClick={onExpandClick}
        className={classNames(headerClassName)}
      />
    );
  }

  renderBody() {
    const {
      onClick,
      contentClassName,
      entityClassName,
      libraryClassName,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
      outputNullState
    } = this.props;

    const libraryContents = this.formatPropsData();

    return (
      outputNullState || (
        <FingerprintContent
          libraries={libraryContents}
          className={contentClassName}
          entityClassName={entityClassName}
          libraryClassName={libraryClassName}
          mediaPlayerTimeMs={mediaPlayerTimeMs}
          mediaPlayerTimeIntervalMs={mediaPlayerTimeIntervalMs}
          onClick={onClick}
        />
      )
    );
  }

  render() {
    return (
      <div
        className={classNames(styles.fingerprintOutput, this.props.className)}
      >
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }
}
