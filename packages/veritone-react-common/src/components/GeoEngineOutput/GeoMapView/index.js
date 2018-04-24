import React, { Component } from 'react';
import { bool, number, string, func, shape, arrayOf } from 'prop-types';

import classNames from 'classnames';

import GoogleMapComponent from './GoogleMapComponent';
import GoogleMapHelpers from './GoogleMapComponent/GoogleMapHelpers';
import styles from './styles.scss';

export default class GeoMapView extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        startTimeStamp: string.isRequired,
        stopTimeStamp: string.isRequired,
        active: bool,
        gps: arrayOf(
          shape({
            latitude: number,
            longtitude: number,
            precision: number,
            direction: number,
            velocity: number,
            altitude: number
          })
        ).isRequired
      })
    ),
    className: string,
    apiKey: string,
    travelMode: string,
    onClick: func,
    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  static defaultProps = {
    data: [],
    mediaPlayerTimeMs: -1,
    mediaPlayerTimeIntervalMs: 0,
    travelMode: GoogleMapHelpers.travelModes.FLYING
  };

  handleRouteClick = value => {
    const { data, onClick } = this.props;

    if (onClick) {
      let minDistance = -1;
      let closestEntry = undefined;
      const selectedLat = value.lat();
      const selectedLng = value.lng();
      data.forEach(entry => {
        const entryPos = entry.gps[0];
        const entryLat = entryPos.latitude;
        const entryLng = entryPos.longtitude;
        const distance = GoogleMapHelpers.findDistanceRatio(
          selectedLat,
          selectedLng,
          entryLat,
          entryLng
        );
        if (minDistance < 0 || minDistance > distance) {
          minDistance = distance;
          closestEntry = entry;
        }
      });

      onClick(closestEntry.startTimeMs, closestEntry.stopTimeMs);
    }
  };

  handlePlayerTimeChange = () => {
    const { data, mediaPlayerTimeMs, mediaPlayerTimeIntervalMs } = this.props;

    if (mediaPlayerTimeMs < 0) {
      return;
    } else if (mediaPlayerTimeIntervalMs <= 0) {
      let minTimeDiff = -1;
      let nearestEntry = undefined;
      for (const entry of data) {
        const startTimeDiff = Math.abs(entry.startTimeMs - mediaPlayerTimeMs);
        if (minTimeDiff === -1 || minTimeDiff > startTimeDiff) {
          minTimeDiff = startTimeDiff;
          nearestEntry = entry;
        }
      }

      if (nearestEntry) {
        this.setState({
          currentPos: {
            latitude: nearestEntry.gps[0].latitude,
            longtitude: nearestEntry.gps[0].longtitude
          }
        });
      }
    } else {
      const startTime = mediaPlayerTimeMs;
      const stopTime = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
      const tweenprops = [];
      for (const entry of data) {
        if (entry.startTimeMs > stopTime) {
          break;
        } else if (entry.stopTimeMs > startTime) {
          tweenprops.push(entry);
        }
      }
    }
  };

  estimatePosition(timeMs) {
    const data = this.props.data;

    if (timeMs < 0) {
      return null;
    }

    let nextMinDiff = -1;
    let prevMinDiff = -1;
    let nextEntryPos = undefined;
    let prevEntryPos = undefined;

    for (const entry of data) {
      const entryMidPoint = (entry.stopTimeMs + entry.startTimeMs) / 2;
      if (entryMidPoint === timeMs) {
        return entry.gps[0];
      } else if (entryMidPoint < timeMs) {
        const prevTimeDiff = timeMs - entryMidPoint;
        if (prevMinDiff < 0 || prevMinDiff > prevTimeDiff) {
          prevMinDiff = prevTimeDiff;
          prevEntryPos = {
            lat: entry.gps[0].latitude,
            lng: entry.gps[0].longtitude
          };
        }
      } else {
        const nextTimeDiff = entryMidPoint - timeMs;
        if (nextMinDiff < 0 || nextMinDiff > nextTimeDiff) {
          nextMinDiff = nextTimeDiff;
          nextEntryPos = {
            lat: entry.gps[0].latitude,
            lng: entry.gps[0].longtitude
          };
        }
      }
    }

    if (!prevEntryPos) {
      return nextEntryPos;
    } else if (!nextEntryPos) {
      return prevEntryPos;
    } else {
      const totalTimeDiff = prevMinDiff + nextMinDiff;
      const estimateLat =
        (prevMinDiff * nextEntryPos.lat + nextMinDiff * prevEntryPos.lat) /
        totalTimeDiff;
      const estimateLng =
        (prevMinDiff * nextEntryPos.lng + nextMinDiff * prevEntryPos.lng) /
        totalTimeDiff;

      return {
        lat: estimateLat,
        lng: estimateLng
      };
    }
  }

  render() {
    const {
      data,
      className,
      apiKey,
      travelMode,
      mediaPlayerTimeMs
    } = this.props;

    const estimatedPos = this.estimatePosition(mediaPlayerTimeMs);

    return (
      <div className={classNames(styles.googleMapView, className)}>
        <GoogleMapComponent
          path={data}
          apiKey={apiKey}
          travelMode={travelMode}
          onClick={this.handleRouteClick}
          currentPos={estimatedPos}
        />
      </div>
    );
  }
}
