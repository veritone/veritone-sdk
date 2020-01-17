import React from 'react';
import { Map, tileLayer, featureGroup, Control, circle } from 'leaflet';
// eslint-disable-next-line no-unused-vars
import  { Draw } from 'leaflet-draw';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { bool, func, string, shape } from 'prop-types';

import controlStyles from './geolocation.csss';
import leafletStyles from './leaflet.csss';
import leafletdrawStyles from './leafletdraw.csss';

class GeolocationModal extends React.Component {
  static propTypes = {
    open: bool,
    modalState: shape({ search: string, language: string }),
    applyFilter: func,
    cancel: func
  };
  static defaultProps = {
    applyFilter: value => console.log('Search transcript by value', value),
    cancel: () => console.log('You clicked cancel')
  };

  state = {
    filterValue: null || this.props.modalState,
    renderedMap: false
  };

  componentWillUnmount() {
    if (this.state.renderedMap && this.state.renderedMap.remove) {
      this.state.renderedMap.remove();
    }
  }

  onChange = event => {
    this.setState({
      filterValue: event.target.value
    });
  };

  getFilterValue = () => {
    const mostRecent = (a, b) => a._createdTime > b._createdTime  ? a._createdTime : b._createdTime;
    let lastCreated = Object.values(this.state.renderedMap._layers).filter( x => x._type === 'geolocationModal' );

    if(lastCreated && lastCreated.length > 0) {
      let lastCreatedValue = lastCreated.reduce( mostRecent );
      let filterValue = { latitude: lastCreatedValue._latlng.lat , longitude: lastCreatedValue._latlng.lng, distance: lastCreatedValue._mRadius, units: 'm'}
      return filterValue;
    } else {
      return;
    }
  }

  applyFilterIfValue = () => {
    const filterValue = this.getFilterValue();
    this.props.applyFilter(filterValue);
  };

  returnValue() {
    // console.log( this.getFilterValue() );
    return this.getFilterValue();
  }

  renderMap(element) {
    if(!this.state.renderedMap) {
      if(element) {
        // default map position
        const position = [33.616, -117.928];
        let map = new Map(element, { attributionControl: false } ).setView(position, 14);

        if(this.props.modalState) {
          position[0] = this.props.modalState.latitude,
          position[1] = this.props.modalState.longitude

          let newCircle = circle( position,  {radius: this.props.modalState.distance});
          newCircle._createdTime = new Date();
          newCircle._type = 'geolocationModal';
          newCircle.addTo(map);
          setTimeout( () => { map.flyTo(position); map.fitBounds(newCircle.getBounds()) }, 200);
        }

        // save the react component so that the map's events can use the react state
        map.reactContext = this;

        // uncomment to zoom in on the user's location on startup
        //navigator.geolocation.getCurrentPosition( x => map.setView( [x.coords.latitude, x.coords.longitude], 13 ));

        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
          style: 'bar',
          provider: provider,
          showMarker: false,
          keepResult: true,
          autoClose: true
        });

        const getMapControlOptions = drawnItems => ({ draw: { polygon: false, marker: false, rectangle: false, square: false, circle: true, polyline: false, circlemarker: false }, edit: { featureGroup: drawnItems, edit: false, remove: false } });

        // tile configuration for the map
        tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

        var drawnItems = new featureGroup();
        map.addLayer(drawnItems);

        // add the geolocation search controller
        map.addControl(searchControl);

        // add circle draw control
        var drawControl = new Control.Draw( getMapControlOptions(drawnItems) );
        map.addControl(drawControl);

        // helper function to remove existing selections whenever we create a new geolocation selection
        const removeExistingSelections = (map) => {
          Object.values(map._layers).filter( x => x._type === 'geolocationModal').map( layer =>
            layer.remove()
          );
        };

        // add a geolocation distance filter when an address is type
        map.on('geosearch/showlocation', function(event) {
          removeExistingSelections(map);
          let latlong = [event.location.y, event.location.x];
          let newCircle = circle( latlong,  {radius: 1500});
          newCircle._createdTime = new Date();
          newCircle._type = 'geolocationModal';
          newCircle.addTo(map);
          setTimeout( () => { map.flyTo(latlong); map.fitBounds(newCircle.getBounds()) }, 200);
        });

        // add a geolocation distance filter when a circle is drawn
        map.on('draw:created', function (event) {
          removeExistingSelections(map);

          let layer = event.layer;
          layer._createdTime = new Date();
          layer._type = "geolocationModal";
          drawnItems.addLayer(layer);
          setTimeout( () => map.fitBounds(layer.getBounds()), 200);
        });

        this.setState({renderedMap: map, address_bar: searchControl });
      }
    }
  }

  render() {
    return (
      <div>
        <style dangerouslySetInnerHTML={ {__html: controlStyles + leafletStyles + leafletdrawStyles } } />
        <div ref={input => { this.element = input; this.renderMap(this.element) }} style={{width: "100%", minHeight: "50vh"}}>

        </div>
      </div>
    );
  }
}

const GeolocationGenerator = modalState => {
  return {
    operator: 'geo_distance',
    field: "geolocation.series.location",
    latitude: modalState.latitude || 0,
    longitude: modalState.longitude || 0,
    distance: modalState.distance || 0,
    units: 'm'
  };
};

const GeolocationDisplay = modalState => {
  const roundLocation = (num) => num ? Math.round(num * 100) / 100 : '?';

  return {
    abbreviation: `${roundLocation(modalState.latitude)} : ${roundLocation(modalState.longitude)}`,
    thumbnail: null
  };
};

export {
  GeolocationModal,
  GeolocationGenerator,
  GeolocationDisplay
};

