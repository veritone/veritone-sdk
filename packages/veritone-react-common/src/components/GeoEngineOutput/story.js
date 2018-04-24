import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { number } from '@storybook/addon-knobs/react';

import classNames from 'classnames';
import styles from './story.styles.scss';

import GeoEngineOutput from './';
storiesOf('GeoEngineOutput', module).add('Base', () => {
  return <GeoExample />;
});

export class GeoExample extends Component {
  state = {
    selectedEngineId: '1',
    engines: [
      { id: '1', name: 'Engine-X' },
      { id: '2', name: 'Engine-Y' },
      { id: '3', name: 'Engine-Z' }
    ],
    mockData: genMockData(0, 600000)
  };

  render() {
    return (
      <div className={classNames(styles.geoExampleRootView)}>
        <GeoEngineOutput
          data={this.state.mockData}
          startTimeStamp="2018-01-31T20:03:45.000Z"
          apiKey={'AIzaSyBbJL_KdBKzgcVETRpqYlpJXvTK6Hjj5AQ'}
          onClick={action('onClick')}
          engines={this.state.engines}
          selectedEngineId={this.state.selectedEngineId}
          onEngineChange={action('engine change')}
          onExpandClicked={action('expand button clicked')}
          mediaPlayerTimeMs={1000 * number('Media Player Time', 0)}
        />
      </div>
    );
  }
}

function genMockData(
  startTime,
  stopTime,
  startLat = 33.690068,
  startLong = -117.878009,
  seriesSize = 10
) {
  const dataChunk = {
    startTimeMs: startTime,
    stopTimeMs: stopTime,
    series: []
  };

  const stopLat = startLat + (0.001 - 2 * Math.random() / 1000);
  const stopLong = startLong + (0.01 - 2 * Math.random() / 100);

  const entryLatSize = (stopLat - startLat) / seriesSize;
  const entryLongSize = (stopLong - startLong) / seriesSize;
  const entryInterval = (stopTime - startTime) / seriesSize;
  for (let entryIndex = 0; entryIndex < seriesSize; entryIndex++) {
    const entryStartTime = startTime + entryIndex * entryInterval;
    dataChunk.series.push({
      startTimeMs: entryStartTime,
      stopTimeMs: entryStartTime + entryInterval,
      gps: [
        {
          latitude:
            Math.round(1000000 * (startLat + entryIndex * entryLatSize)) /
            1000000,
          longtitude:
            Math.round(1000000 * (startLong + entryIndex * entryLongSize)) /
            1000000
        }
      ]
    });
  }

  return [dataChunk];
}
