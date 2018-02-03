import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { FormHelperText } from 'material-ui/Form';
import { Map, tileLayer, marker, featureGroup, Control } from 'leaflet';
import  { Draw } from 'leaflet-draw';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import controlStyles from './geolocation.csss';
import leafletStyles from './leaflet.csss';
import leafletdrawStyles from './leafletdraw.csss';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';

import { bool, func, string, shape } from 'prop-types';

export default class GeolocationModal extends React.Component {
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
    filterValue: null || this.props.modalState.search,
    renderedMap: false
  };

  componentWillMount() {
    console.log(this.element);
    console.log(ReactDOM.findDOMNode(this.element));
  }

  onChange = event => {
    this.setState({
      filterValue: event.target.value
    });
  };

  onEnter = event => {
    if (event.key === 'Enter') {
      this.applyFilterIfValue();
    }
  };

  applyFilterIfValue = () => {
    if(!this.state.filterValue || this.state.filterValue.trim().length === 0) {
      this.props.applyFilter();
    } else {
      this.props.applyFilter(
        { search: this.state.filterValue ? this.state.filterValue.trim() : null, language: 'en' }
      );
    }
  };

  renderMap(element) {
    console.log(element);
    if(!this.state.renderedMap) {
      console.log(Map);
      if(element) {
        const position = [51.505, -0.09]
        let map = new Map(element).setView(position, 13);
        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
          style: 'bar',
          provider: provider,
          showMarker: true,
          keepResult: true,
          autoClose: true
        });

        tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        var drawnItems = new featureGroup();
        map.addLayer(drawnItems);
        map.addControl(searchControl);
        var drawControl = new Control.Draw({
          draw: {
            polygon: false,
            marker: false,
            rectangle: false,
            square: false,
            circle: true,
            polyline: false,
            circlemarker: false
          },
          edit: {
              featureGroup: drawnItems,
              edit: false,
              remove: false,
          }
        });
        map.addControl(drawControl);
        map.on(L.Draw.Event.CREATED, function (event) {

          console.log("Drawn items", event);
          var layer = event.layer;
          layer.on('click', function(evt) {
            console.log("clicked on circle");
          });
          drawnItems.addLayer(layer);
          setTimeout( () => layer.remove(), 5000 );
        });

        this.setState({renderedMap: map});
      }
    }
  }

  render() {
    return (
      <Dialog
        paperProps={ { style: {width: '1000px', height:'650px', maxWidth: '1000px'}} }
        open={this.props.open}
        maxWidth={false}
        onClose={this.props.cancel}
      >
        <DialogTitle>
          Search by Geolocation
          <FormHelperText>Locate by City, Zicode or DMA.</FormHelperText>
        </DialogTitle>
        <DialogContent>
          <style dangerouslySetInnerHTML={ {__html: controlStyles + leafletStyles + leafletdrawStyles } } />
          <div ref={input => { this.element = input; this.renderMap(this.element) }} style={{width: "720px", height: "400px", border: "1px solid #3f51b5"}}>

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={ this.props.cancel } color="primary" className="transcriptCancel">
            Cancel
          </Button>
          <Button
            onClick={ this.props.applyFilter }
            color="primary"
            className="transcriptSubmit"
            raised
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const TranscriptSearchForm = ( { defaultValue, cancel, onSubmit, onChange, onKeyPress, inputValue } ) => {
  return (
  <div>
    <DialogTitle>
      Search by Keyword
      <FormHelperText>Searches within our database of media transcripts.</FormHelperText>
    </DialogTitle>
    <DialogContent style={{ width: '500px', margin: 'none' }}>
      <TextField
        id="transcript_search_field"
        autoFocus
        margin="none"
        defaultValue={ defaultValue }
        onChange={ onChange }
        onKeyPress={ onKeyPress }
        placeholder="Phrase to search"
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={ cancel } color="primary" className="transcriptCancel">
        Cancel
      </Button>
      <Button
        disabled={!inputValue && !defaultValue}
        onClick={ onSubmit }
        color="primary"
        className="transcriptSubmit"
        raised
      >
        Search
      </Button>
    </DialogActions>
  </div>
)}

GeolocationModal.defaultProps = {
  modalState: { search: '', language: 'en' }
};

const GeolocationGenerator = modalState => {
  return {
    operator: 'query_string',
    field: 'transcript.transcript',
    value: modalState.search && modalState.search.toLowerCase()
  };
};

const GeolocationDisplay = modalState => {
  return {
    abbreviation: modalState.search && modalState.search.length > 10 ? modalState.search.substring(0, 10) + '...' : modalState.search,
    thumbnail: null
  };
};

export {
  GeolocationModal,
  GeolocationGenerator,
  GeolocationDisplay
};
