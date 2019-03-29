import React, { Component } from 'react';
import { arrayOf, number, string, func, shape } from 'prop-types';
import classNames from 'classnames';
import { kebabCase, get } from 'lodash';

import { msToReadableString } from '../../../helpers/time';
import PillButton from '../../share-components/buttons/PillButton';

import styles from './styles.scss';

export default class LogoSegment extends Component {
  static propTypes = {
    series: arrayOf(
      shape({
        startTimeMs: number.isRequired,
        stopTimeMs: number.isRequired,
        object: shape({
          label: string,
          confidence: number
        }).isRequired
      })
    ).isRequired,
    currentMediaPlayerTime: number,
    onEntrySelected: func,
    virtualMeasure: func
  };

  componentDidMount() {
    const { virtualMeasure } = this.props;
    virtualMeasure && virtualMeasure();
  }

  render() {
    const {
      series,
      currentMediaPlayerTime,
      onEntrySelected
    } = this.props;

    return series.map((itemInfo, index) => {
      if (itemInfo.object) {
        //Look for detected logo
        const startTimeString = msToReadableString(itemInfo.startTimeMs);
        const stopTimeString = msToReadableString(itemInfo.stopTimeMs);
        const timeRangeKeyPart = `${itemInfo.startTimeMs}-${
          itemInfo.stopTimeMs
        }`;
        const boundingPoly = get(itemInfo.object, 'boundingPoly', []);
        const boundingPolyKeyPart = boundingPoly.length
          ? `x1-${boundingPoly[0].x}-y1-${boundingPoly[0].y}`
          : '';
        const pillKey = `logo-pill-${kebabCase(
          itemInfo.object.label
        )}-${timeRangeKeyPart}-${
          itemInfo.confidence
        }-${boundingPolyKeyPart}`;
        return (
          <PillButton
            value={index}
            label={itemInfo.object.label}
            info={`${startTimeString} - ${stopTimeString}`}
            className={styles.item}
            labelClassName={styles.label}
            key={pillKey}
            // eslint-disable-next-line
            onClick={() => onEntrySelected(itemInfo.startTimeMs, itemInfo.stopTimeMs)}
            data={itemInfo}
            highlight={
              currentMediaPlayerTime >= itemInfo.startTimeMs &&
              currentMediaPlayerTime <= itemInfo.stopTimeMs
            }
          />
        );
      }
    });
  }
}