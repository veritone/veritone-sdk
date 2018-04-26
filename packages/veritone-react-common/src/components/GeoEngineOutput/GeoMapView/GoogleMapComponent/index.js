import React, { Component } from 'react';
import { number, string, func, shape, arrayOf } from 'prop-types';

import { isEqual } from 'lodash';
import classNames from 'classnames';

import GoogleMapLoader from './GoogleMapLoader';
import GoogleMapHelpers from './GoogleMapHelpers';
import styles from './styles.scss';

export default class GoogleMapComponent extends Component {
  static propTypes = {
    path: arrayOf(
      shape({
        lat: number,
        lng: number
      })
    ),
    currentPos: shape({
      lat: number,
      lng: number
    }),
    travelMode: string,
    className: string,
    onClick: func,
    apiKey: string,
    onGoogleMapError: func
  };

  static defaultProps = {
    travelMode: GoogleMapHelpers.travelModes.FLYING
  };

  componentDidMount() {
    const { apiKey, onGoogleMapError } = this.props;
    const loader = new GoogleMapLoader(apiKey);
    loader.load().then(() => {
        const maps = window.google.maps;
        const mapInstance = this.map = new maps.Map(this.mapContainer.current, {});

        this.drawContent();
        return mapInstance;
      })
      .catch(error => {
        onGoogleMapError && onGoogleMapError(error);
        console.error('Can\'t load Google Map', {error: error});
      });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this && this.body && nextProps.currentPos !== this.props.currentPos) {
      const nextPos = nextProps.currentPos;
      this.body.setPosition(nextPos);
    }

    if (!isEqual(nextProps.path, this.props.path) || nextProps.travelMode !== this.props.travelMode) {
      this.clearContent();
      this.drawContent();
    }
  }

  drawContent() {
    if (this.map) {
      const map = this.map;
      const { path, currentPos, travelMode } = this.props;

      const startPoint = path[0];
      const endPoint = path[path.length - 1];
      const currentPoint = currentPos || startPoint;

      // Draw Markers
      if (path.length > 0) {
        this.destination = GoogleMapHelpers.genDestinationMarker(endPoint, 1, map);
        if (path.length > 1) {
          this.origin = GoogleMapHelpers.genOriginMarker(startPoint, 0.2, map);
          this.body = GoogleMapHelpers.genOriginMarker(currentPoint, 1, map);
    
          // Draw Route
           GoogleMapHelpers.drawDirection(
            startPoint,
            endPoint,
            map,
            path,
            travelMode
          ).then(route => {
            this.route = route;
            const bounds = GoogleMapHelpers.genLatLngBounds(path);
            map.fitBounds(bounds);
    
            // Add Listeners
            route.addListener('click', this.handleClicked);
            this.origin.addListener('click', this.handleClicked);
            this.destination.addListener('click', this.handleClicked);
    
            return route;
          });
        }
      }
    }
  }

  clearContent () {
    if (window.google && window.google.maps) {
      const event = window.google.maps.event;
      if (this.body) {
        this.body.setMap(null);
      }

      if (this.route) {
        event.clearInstanceListeners(this.route);
        this.route.setMap(null);
      }
      
      if (this.origin) {
        event.clearInstanceListeners(this.origin);
        this.origin.setMap(null);
      }

      if (this.destination) {
        event.clearInstanceListeners(this.destination);
        this.destination.setMap(null);
      }
    }
  }

  handleClicked = event => {
    const onClick = this.props.onClick;
    onClick && onClick(event.latLng);
  };

  mapContainer = React.createRef();
  render() {
    return (
      <div
        ref={this.mapContainer}
        className={classNames(styles.googleMapComponent, this.props.className)}
      />
    );
  }
}
