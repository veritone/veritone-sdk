import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import classNames from 'classnames';
import { kebabCase } from 'lodash';

import EngineOutputHeader from '../EngineOutputHeader';
import PillButton from '../share-components/buttons/PillButton';
import { msToReadableString } from '../../helpers/time';

import styles from './styles.scss';

const ObjectGroup = ({
  objectGroup,
  currentMediaPlayerTime,
  onObjectClicked
}) => {
  let handleObjectClicked = (startTime, stopTime) => evt =>
    onObjectClicked(startTime, stopTime);
  return (
    <span>
      {objectGroup.series &&
        objectGroup.series.map(objectData => {
          return (
            <PillButton
              key={
                'object-pill-' +
                kebabCase(objectData.object.label) +
                objectData.startTimeMs +
                objectData.stopTimeMs
              }
              label={objectData.object.label}
              info={
                msToReadableString(objectData.startTimeMs) +
                ' - ' +
                msToReadableString(objectData.stopTimeMs)
              }
              className={styles.objectPill}
              infoClassName={styles.objectAppearanceTime}
              highlight={
                currentMediaPlayerTime >= objectData.startTimeMs &&
                currentMediaPlayerTime <= objectData.stopTimeMs
              }
              onClick={handleObjectClicked(
                objectData.startTimeMs,
                objectData.stopTimeMs
              )}
            />
          );
        })}
    </span>
  );
};

ObjectGroup.propTypes = {
  objectGroup: shape({
    series: arrayOf(
      shape({
        startTimeMs: number.isRequired,
        stopTimeMs: number.isRequired,
        object: shape({
          label: string.isRequired,
          confidence: number
        }).isRequired
      })
    )
  }),
  currentMediaPlayerTime: number,
  onObjectClicked: func
};

class ObjectDetectionEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            object: shape({
              label: string.isRequired,
              confidence: number
            }).isRequired
          })
        )
      })
    ),
    onObjectOccurrenceClicked: func,
    selectedEngineId: string,
    engines: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    onEngineChange: func,
    className: string,
    currentMediaPlayerTime: number,
    onExpandClicked: func
  };

  static defaultProps = {
    data: [],
    engines: []
  };

  handleObjectClicked = (startTime, stopTime) => {
    this.props.onObjectOccurrenceClicked(startTime, stopTime);
  };

  render() {
    let {
      data,
      className,
      selectedEngineId,
      engines,
      onEngineChange,
      currentMediaPlayerTime,
      onExpandClicked
    } = this.props;

    return (
      <div className={classNames(styles.objectDetectionOutputView, className)}>
        <EngineOutputHeader
          title="Object Detection"
          onExpandClicked={onExpandClicked}
          onEngineChange={onEngineChange}
          selectedEngineId={selectedEngineId}
          engines={engines}
        />
        <div className={styles.objectDetectionContent}>
          {data.map(objectGroup => {
            return (
              <ObjectGroup
                key={
                  'object-group-' +
                  objectGroup.sourceEngineId +
                  objectGroup.taskId
                }
                objectGroup={objectGroup}
                currentMediaPlayerTime={currentMediaPlayerTime}
                onObjectClicked={this.handleObjectClicked}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default ObjectDetectionEngineOutput;
