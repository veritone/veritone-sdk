import React, { Component } from 'react';
import { arrayOf, number, string, func, shape } from 'prop-types';
import classNames from 'classnames';
import { sortBy } from 'lodash';

import PillButton from '../Parts/Buttons/PillButton';
import { msToReadableString } from '../../helpers/time';
import EngineOutputHeader from '../EngineOutputHeader';

import styles from './styles.scss';

export default class LogoDetectionEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        logo: shape({
          label: string,
          confidence: number
        })
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

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number,
    
    className: string,
    entryClassName: string,
    entryLabelClassName: string,
    entryInfoClassName: string,
    
    onScroll: func,
    onEntrySelected: func,
    onEngineChange: func,
    onExpandClicked: func,
  };

  static defaultProps = {
    data: [],
    title: 'Logo Recognition',
    mediaPlayerTimeMs: 0,
    mediaPlayerTimeIntervalMs: 1000,
  };

  handleEntrySelected = (event, entry) => {
    this.props.onEntrySelected && this.props.onEntrySelected(entry.startTimeMs, entry.stopTimeMs);
  };

  handleScrolled = event => {
    if (this.props.onScroll) {
      this.scrollCheck && clearTimeout(this.scrollCheck);
      this.scrollCheck = setTimeout(this.onScrollComplete, 500, event.target);
    }
  };

  onScrollComplete(scrollElement) {
    if (this.props.onScroll) {
      let scrollInfo = {
        scrollTop: scrollElement.scrollTop,
        scrollHeight: scrollElement.scrollHeight,
        clientHeight: scrollElement.clientHeight,
        scrollRatio:
          scrollElement.scrollTop /
          (scrollElement.scrollHeight - scrollElement.clientHeight)
      };

      this.props.onScroll(scrollInfo);
    }
  }

  renderEntries() {
    let {
      data,
      entryClassName,
      entryInfoClassName,
      entryLabelClassName,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
    } = this.props;

    let items = [];
    
    data.map((chunk, index) => {
      let series = chunk.series;
      if (series && series.length > 0) {
        // Sort detected logos by there start time and end time
        series = sortBy(series, 'startTimeMs', 'stopTimeMs');
        
        // Draw detected logos in the series
        let endMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
        series.map((itemInfo, index) => {
          if (itemInfo.object) {
            //Look for detected logo
            let startTime = itemInfo.startTimeMs;
            let stopTime = itemInfo.stopTimeMs;
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
                key={'logo-' + itemInfo.object.label + index}
                onClick={this.handleEntrySelected}
                data={itemInfo}
                highlight={!(
                  endMediaPlayHeadMs < startTime || mediaPlayerTimeMs > stopTime
                )}
              />
            );
            items.push(logoItem);
          }
        });
      }
    });
    
    return items;
  }

  render() {
    let {
      title,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClicked
    } = this.props;

    return (
      <div
        className={classNames(styles.logoDetection, this.props.className)}
        onScroll={this.handleScrolled}
      >
        <EngineOutputHeader 
          title={title}
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClicked={onExpandClicked}
        />
        <div className={styles.scrolableContent}>{this.renderEntries()}</div>
      </div>
    );
  }
}
