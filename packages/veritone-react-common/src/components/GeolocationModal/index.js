import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { FormHelperText } from 'material-ui/Form';
import { Map, tileLayer, marker } from 'leaflet';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';


import './leaflet.scss';

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

        tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        marker(position)
        .addTo(map)
        .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')

        this.setState({renderedMap: true});
      }
    }
  }

  render() {
    return (
      <Dialog
        maxWidth={'md'}
        open={this.props.open}
        onClose={this.props.cancel}
      >
        <DialogTitle>
          Search by Geolocation
          <FormHelperText>Locate by City, Zicode or DMA.</FormHelperText>
        </DialogTitle>
        <DialogContent>
          <TextField style={{ width: '100%' }} id="location" type="text" />
          <div ref={input => { this.element = input; this.renderMap(this.element) }} style={{width: "600px", height: "350px", border: "1px solid blue"}}>

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
