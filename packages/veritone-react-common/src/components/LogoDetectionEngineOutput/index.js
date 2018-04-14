import React, { Component } from 'react';
import { arrayOf, number, string, func, shape } from 'prop-types';
import classNames from 'classnames';
import { sortBy } from 'lodash';

import { msToReadableString } from '../../helpers/time';
import EngineOutputHeader from '../EngineOutputHeader';

import PillButton from '../share-components/buttons/PillButton';
import DynamicContentScroll from '../share-components/scrolls/DynamicContentScroll';

import styles from './styles.scss';

export default class LogoDetectionEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(
          shape({
            startTimeMs: number,
            stopTimeMs: number,
            object: shape({
              label: string,
              confidence: number
            })
          })
        )
      })
    ), // series data

    title: string,
    engines: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    selectedEngineId: string,

    className: string,
    entryClassName: string,
    entryLabelClassName: string,
    entryInfoClassName: string,

    onScroll: func,
    onEntrySelected: func,
    onEngineChange: func,
    onExpandClicked: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMS: number,
    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  static defaultProps = {
    data: [],
    title: 'Logo Recognition',
    neglectableTimeMs: 500,
    mediaPlayerTimeMs: 0,
    mediaPlayerTimeIntervalMs: 500
  };

  handleEntrySelected = (event, entry) => {
    this.props.onEntrySelected &&
      this.props.onEntrySelected(entry.startTimeMs, entry.stopTimeMs);
  };

  renderContents() {
    let {
      data,
      entryClassName,
      entryInfoClassName,
      entryLabelClassName,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    let contents = [];

    data.map((chunk, index) => {
      let groupStartTime = chunk.startTimeMs;
      let groupStopTime = chunk.stopTimeMs;

      let items = [];
      let series = chunk.series;
      if (series && series.length > 0) {
        // Sort detected logos by there start time and end time
        series = sortBy(series, 'startTimeMs', 'stopTimeMs');

        // Draw detected logos in the series
        let endMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
        series.map((itemInfo, index) => {
          if (itemInfo.object) {
            if (
              groupStartTime === undefined ||
              itemInfo.startTimeMs < groupStartTime
            ) {
              groupStartTime = itemInfo.startTimeMs;
            }

            if (
              groupStopTime === undefined ||
              itemInfo.stopTimeMs > groupStopTime
            ) {
              groupStopTime = itemInfo.stopTimeMs;
            }

            //Look for detected logo
            let startTime = Math.floor(itemInfo.startTimeMs / 1000) * 1000;
            let stopTime = Math.ceil(itemInfo.stopTimeMs / 1000) * 1000;
            let startTimeString = msToReadableString(itemInfo.startTimeMs);
            let stopTimeString = msToReadableString(itemInfo.stopTimeMs);
            let logoItem = (
              <PillButton
                value={index}
                label={itemInfo.object.label}
                info={startTimeString + ' - ' + stopTimeString}
                className={classNames(styles.item, entryClassName)}
                labelClassName={classNames(styles.label, entryLabelClassName)}
                infoClassName={entryInfoClassName}
                key={'logo-' + startTime + '-' + stopTime + '-' + itemInfo.object.label}
                onClick={this.handleEntrySelected}
                data={itemInfo}
                highlight={
                  !(
                    endMediaPlayHeadMs < startTime ||
                    mediaPlayerTimeMs > stopTime
                  )
                }
              />
            );
            items.push(logoItem);
          }
        });
      }
      contents.push({
        start: groupStartTime,
        stop: groupStopTime,
        content: items
      });
    });

    return contents;
  }

  render() {
    let {
      title,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClicked,
      onScroll,
      mediaLengthMs,
      neglectableTimeMs,
      estimatedDisplayTimeMS
    } = this.props;

    let contents = this.renderContents();

    return (
      <div className={classNames(styles.logoDetection, this.props.className)}>
        <EngineOutputHeader
          title={title}
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClicked={onExpandClicked}
        />
        <DynamicContentScroll
          contents={contents}
          className={styles.scrolableContent}
          onScroll={onScroll}
          totalSize={mediaLengthMs}
          neglectableSize={neglectableTimeMs}
          estimatedDisplaySize={estimatedDisplayTimeMS}
        />
      </div>
    );
  }
}
