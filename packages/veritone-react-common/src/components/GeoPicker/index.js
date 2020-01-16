import React from 'react';
import {
  oneOf,
  oneOfType,
  shape,
  func,
  bool,
  string,
  number,
  any
} from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import GoogleMapsLoader from 'google-maps';
import { withStyles } from '@material-ui/styles';

import styles from './styles';

const MARKER = 'marker';
const CIRCLE = 'circle';
const UNIT_OF_DISTANCE = 'm';

class GeoPicker extends React.Component {
  static CIRCLE_OPTIONS = {
    fillColor: '#aaaaaa',
    fillOpacity: 0.35,
    clickable: false,
    editable: false,
    strokeOpacity: 0.75,
    strokeWeight: 2,
    strokeColor: '#222222',
    zIndex: 1
  };

  static GEOINPUT_OPTIONS = {
    point: MARKER,
    radius: CIRCLE
  };

  static propTypes = {
    gmapsAPIKey: string.isRequired,
    defaultZoom: number,
    defaultLatitude: number,
    defaultLongitude: number,
    geoType: oneOf(['point', 'radius']).isRequired,
    location: oneOfType([
      shape({
        distance: number,
        latitude: number,
        longitude: number,
        units: oneOf([UNIT_OF_DISTANCE])
      }),
      shape({
        latitude: number,
        longitude: number
      })
    ]),
    readOnly: bool,
    onSelectGeolocation: func,
    classes: shape({ any })
  };

  static defaultProps = {
    defaultZoom: 14,
    defaultLatitude: 33.62,
    defaultLongitude: -117.92
  };

  componentWillUnmount() {
    GoogleMapsLoader.release();
  }

  googleMaps = null;
  _googleMapsMountPoint = null;
  _lastMarker = null;
  _lastCircle = null;
  drawingManager = null;

  mountGoogleMaps = google => {
    // don't mount if it's already been unmounted
    if (!this._googleMapsMountPoint) {
      return;
    }

    const MAP_OPTIONS = {
      zoom: this.props.defaultZoom,
      center: {
        lng: this.props.defaultLongitude,
        lat: this.props.defaultLatitude
      }
    };

    this.googleMaps = new google.maps.Map(
      this._googleMapsMountPoint,
      MAP_OPTIONS
    );

    // enable input if not read only
    if (!this.props.readOnly) {
      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: GeoPicker.GEOINPUT_OPTIONS[this.props.geoType],
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER,
          drawingModes: [GeoPicker.GEOINPUT_OPTIONS[this.props.geoType]]
        },
        circleOptions: GeoPicker.CIRCLE_OPTIONS
      });

      this.drawingManager.setMap(this.googleMaps);
    }

    // render the point or distance
    if (GeoPicker.GEOINPUT_OPTIONS[this.props.geoType] === MARKER) {
      // single point
      if (this.props.location) {
        let position = {
          lat: this.props.location.latitude,
          lng: this.props.location.longitude
        };

        this._lastMarker = new google.maps.Marker({
          position: position
        });

        this._lastMarker.setMap(this.googleMaps);
        this.googleMaps.panTo(position);
      }

      if (!this.props.readOnly) {
        google.maps.event.addListener(
          this.drawingManager,
          'markercomplete',
          this.onDrawMarker
        );
      }
    } else if (GeoPicker.GEOINPUT_OPTIONS[this.props.geoType] === CIRCLE) {
      // radius based distance
      if (this.props.location) {
        this._lastCircle = new google.maps.Circle({
          ...GeoPicker.CIRCLE_OPTIONS,
          center: {
            lat: this.props.location.latitude,
            lng: this.props.location.longitude
          },
          radius: this.props.location.distance,
          map: this.googleMaps
        });

        this.googleMaps.fitBounds(this._lastCircle.getBounds());
      }

      if (!this.props.readOnly) {
        google.maps.event.addListener(
          this.drawingManager,
          'circlecomplete',
          this.onDrawCircle
        );
      }
    }
  };

  clearDraw = () => {
    if (this._lastCircle) {
      this._lastCircle.setMap(null);
      this._lastCircle = null;
    }

    if (this._lastMarker) {
      this._lastMarker.setMap(null);
      this._lastMarker = null;
    }
  };

  onDrawCircle = event => {
    this.clearDraw();
    this._lastCircle = event;

    this.googleMaps.fitBounds(event.getBounds());

    if (this.props.onSelectGeolocation) {
      this.props.onSelectGeolocation({
        distance: event.radius,
        latitude: event.center.lat(),
        longitude: event.center.lng(),
        units: GeoPicker.UNIT_OF_DISTANCE
      });
    }
  };

  onDrawMarker = event => {
    this.clearDraw();
    this._lastMarker = event;

    if (this.props.onSelectGeolocation) {
      this.props.onSelectGeolocation({
        latitude: event.position.lat(),
        longitude: event.position.lng()
      });
    }
  };

  loadGoogleMaps = ref => {
    this._googleMapsMountPoint = ref;
    GoogleMapsLoader.KEY = this.props.gmapsAPIKey;
    GoogleMapsLoader.LIBRARIES = ['places', 'drawing'];
    GoogleMapsLoader.load(this.mountGoogleMaps);
  };

  render() {
    const { classes } = this.props;
    return (
      <div
        ref={this.loadGoogleMaps}
        style={{ width: '100%', height: '100%', display: 'flex' }}
      >
        <div className={classes.loadingContainer}>
          <CircularProgress
            className={classes.loadingSpinner}
            size={100}
            thickness={1}
          />
          <Typography className={classes.loadingLabel}>
            Loading Google Maps
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GeoPicker);     
