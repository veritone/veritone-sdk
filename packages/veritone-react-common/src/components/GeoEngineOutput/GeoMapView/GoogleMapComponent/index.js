import React, { Component } from 'react';
import { number, string, func, shape, arrayOf } from 'prop-types';

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
  }

  static defaultProps = {
    travelMode: GoogleMapHelpers.travelModes.FLYING
  }

  componentDidMount () {
    const loader = new GoogleMapLoader(this.props.apiKey);
    this.map = loader.load().then(() => {
      const maps = window.google.maps;
      const mapInstance = new maps.Map(this.mapContainer.current, {});

      this.drawContent(mapInstance);

      return mapInstance;
    }).catch((error) => {
      // Handle API Loading Error Here If Needed
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this && this.body && nextProps.currentPos !== this.props.currentPos) {
      const nextPos = nextProps.currentPos;
      this.body.setPosition(nextPos);
    }
  }

  drawContent (map) {
    const {
      path,
      currentPos,
      travelMode 
    }= this.props;
    
    const startPoint = path[0];
    const endPoint = path[path.length - 1];
    const currentPoint = currentPos || startPoint;

    // Draw Markers
    this.origin = GoogleMapHelpers.genOriginMarker(startPoint, 0.2, map);
    this.destination = GoogleMapHelpers.genDestinationMarker(endPoint, 1, map);
    this.body = GoogleMapHelpers.genOriginMarker(currentPoint, 1, map);

    // Draw Route
    this.route = GoogleMapHelpers.drawDirection(startPoint, endPoint, map, path, travelMode).then((route) => {
      const bounds = GoogleMapHelpers.genLatLngBounds(path);
      map.fitBounds(bounds);

      // Add Listeners
      route.addListener('click', this.handleClicked);
      this.origin.addListener('click', this.handleClicked);
      this.destination.addListener('click', this.handleClicked);

      return route;
    });
  }

  handleClicked = (event) => {
    const onClick = this.props.onClick;
    onClick && onClick(event.latLng);
  }

  mapContainer = React.createRef();
  render () {
    return (
      <div 
        ref={this.mapContainer} 
        className={classNames(styles.googleMapComponent, this.props.className)}
      />
    );
  }
}
