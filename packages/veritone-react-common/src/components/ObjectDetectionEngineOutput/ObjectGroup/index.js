import React from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import { kebabCase, get } from 'lodash';
import { msToReadableString } from 'helpers/time';
import PillButton from 'components/share-components/buttons/PillButton';

import styles from './styles.scss';

const ObjectGroup = ({
  objectGroup,
  currentMediaPlayerTime,
  onObjectClick
}) => {
  const handleObjectClick = (startTime, stopTime) => evt =>
    onObjectClick(startTime, stopTime);
  return (
    <span>
      {objectGroup.series &&
        objectGroup.series.map(objectData => {
          const timeRangeKeyPart = `${objectData.startTimeMs}-${
            objectData.stopTimeMs
          }`;
          const boundingPoly = get(objectData.object, 'boundingPoly', []);
          const boundingPolyKeyPart = boundingPoly && boundingPoly.length
            ? `x1-${boundingPoly[0].x}-y1-${boundingPoly[0].y}`
            : '';
          const pillKey = `object-pill-${kebabCase(
            objectData.object.label
          )}-${timeRangeKeyPart}-${
            objectData.object.confidence
          }-${boundingPolyKeyPart}`;
          return (
            <PillButton
              key={pillKey}
              label={objectData.object.label}
              info={`${msToReadableString(
                objectData.startTimeMs
              )} - ${msToReadableString(objectData.stopTimeMs)}`}
              className={styles.objectPill}
              infoClassName={styles.objectAppearanceTime}
              highlight={
                currentMediaPlayerTime >= objectData.startTimeMs &&
                currentMediaPlayerTime <= objectData.stopTimeMs
              }
              onClick={handleObjectClick(
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
  onObjectClick: func
};

export default ObjectGroup;
