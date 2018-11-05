import React, { Component } from 'react';
import { bool, number, string, func, shape, arrayOf } from 'prop-types';

import classNames from 'classnames';
import { get } from 'lodash';

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
            longitude: number,
            precision: number,
            direction: number,
            velocity: number,
            altitude: number
          }).isRequired
        ),
        object: shape({
          gps: arrayOf(
            shape({
              latitude: number,
              longitude: number,
              precision: number,
              direction: number,
              velocity: number,
              altitude: number
            }).isRequired
          )
        })
      })
    ),
    className: string,
    apiKey: string,
    travelMode: string,
    onClick: func,
    onGoogleMapError: func,
    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  static defaultProps = {
    data: [],
    mediaPlayerTimeMs: -1,
    mediaPlayerTimeIntervalMs: 0,
    travelMode: GoogleMapHelpers.travelModes.FLYING
  };

  getGeoLocation = seriesItem => {
    if (get(seriesItem, 'gps.length')) {
      return get(seriesItem, 'gps');
    }
    return get(seriesItem, 'object.gps');
  };

  handleRouteClick = value => {
    const { data, onClick } = this.props;

    if (onClick) {
      let minDistance = -1;
      let closestEntry = undefined;
      const selectedLat = value.lat();
      const selectedLng = value.lng();
      data
        .filter(seriesItem =>
          get(seriesItem, 'gps.length') || get(seriesItem, 'object.gps.length')
        )
        .forEach(entry => {
          const gps = this.getGeoLocation(entry);
          const entryPos = gps[0];
          const entryLat = entryPos.latitude;
          const entryLng = entryPos.longitude;
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
    const { mediaPlayerTimeMs, mediaPlayerTimeIntervalMs } = this.props;
    const data = this.props.data
      .filter(seriesItem =>
        get(seriesItem, 'gps.length') || get(seriesItem, 'object.gps.length')
      );

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
        const gps = this.getGeoLocation(nearestEntry);
        this.setState({
          currentPos: {
            latitude: gps[0].latitude,
            longitude: gps[0].longitude
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
    const data = this.props.data
      .filter(seriesItem =>
        get(seriesItem, 'gps.length') || get(seriesItem, 'object.gps.length')
      );

    if (timeMs < 0) {
      return null;
    }

    let nextMinDiff = -1;
    let prevMinDiff = -1;
    let nextEntryPos = undefined;
    let prevEntryPos = undefined;

    for (const entry of data) {
      const entryMidPoint = (entry.stopTimeMs + entry.startTimeMs) / 2;
      const gps = this.getGeoLocation(entry);
      if (entryMidPoint === timeMs) {
        return gps[0];
      } else if (entryMidPoint < timeMs) {
        const prevTimeDiff = timeMs - entryMidPoint;
        if (prevMinDiff < 0 || prevMinDiff > prevTimeDiff) {
          prevMinDiff = prevTimeDiff;
          prevEntryPos = {
            lat: gps[0].latitude,
            lng: gps[0].longitude
          };
        }
      } else {
        const nextTimeDiff = entryMidPoint - timeMs;
        if (nextMinDiff < 0 || nextMinDiff > nextTimeDiff) {
          nextMinDiff = nextTimeDiff;
          nextEntryPos = {
            lat: gps[0].latitude,
            lng: gps[0].longitude
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
      mediaPlayerTimeMs,
      onGoogleMapError
    } = this.props;

    const estimatedPos = this.estimatePosition(mediaPlayerTimeMs);

    return (
      <div className={classNames(styles.googleMapView, className)}>
        {data &&
          data.length && (
            <GoogleMapComponent
              path={data}
              apiKey={apiKey}
              travelMode={travelMode}
              onClick={this.handleRouteClick}
              onGoogleMapError={onGoogleMapError}
              currentPos={estimatedPos}
            />
          )}
      </div>
    );
  }
}
