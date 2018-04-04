import React, {Fragment} from 'react';
import { bool, func, string, shape, object } from 'prop-types';

import {
  CardActions,
  CardContent,
} from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { FormHelperText } from 'material-ui/Form';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuList, MenuItem } from 'material-ui/Menu';
import { ListItemText } from 'material-ui/List';
import Grid from 'material-ui/Grid';
import { withTheme } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';

import Rx from 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/take";
import "rxjs/add/operator/takeUntil";
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { format, parse } from 'date-fns';
import _ from 'lodash'

import StaticTextField from './StaticTextField';
import { GeolocationModal } from '../GeolocationModal';

import SearchAttribute from './SearchAttribute';
import {fetchSDOSchema, fetchAutocomplete} from './SearchAttribute/fetchAutocomplete';

const styles = {
  row: {
    display: 'flex-inline',
    flexGrow: 2
  }
}

class StructuredDataModal extends React.Component {
  static propTypes = {
    open: bool,
    modalState: object,
    cancel: func
  };
  static defaultProps = {
    modalState: { },
    cancel: () => console.log('You clicked cancel')
  };

  static OPERATOR_LABELS = {
    is: 'is',
    is_not: 'is not',
    gte: 'greater than or equal to',
    lte: 'less than or equal to',
    gt: 'greater than',
    lt: 'less than',
    contains: 'contains',
    not_contains: 'does not contain',
    within: 'is within',
    range: 'between'
  }

  static OPERATOR_ABRV = {
    is: 'IS',
    is_not: 'IS NOT',
    gte: '>=',
    lte: '<=',
    gt: '>',
    lt: '<',
    contains: 'CONTAINS',
    not_contains: 'EXCLUDES',
    within: 'WITHIN',
    range: 'BETWEEN'
  }

  static SYMBOL_LABELS = {
    gte: '≥',
    lte: '≤',
    gt: '>',
    lt: '<'
  }

  static STRING_OPERATORS = [ "is", "is_not", "contains", "not_contains"];
  static NUMERIC_OPERATORS = [ "is", "is_not", "gt", "gte", "lt", "lte", "range"];
  static BOOLEAN_OPERATORS = ['is'];
  static GEOLOCATION_OPERATORS = ['within'];


  // converts CSP data structure back to modal's internal types
  rehydrateProps = () => {
    let type = _.get(this.props.modalState, 'type');
    let convertedValue1 = _.get(this.props.modalState, 'value1');
    let convertedValue2 = _.get(this.props.modalState, 'value2');

    if(type === 'dateTime') {
      convertedValue1 = convertedValue1 ? format(parse(convertedValue1), 'YYYY-MM-DDTHH:mm') : undefined;
      convertedValue2 = convertedValue1 ? format(parse(convertedValue2), 'YYYY-MM-DDTHH:mm') : undefined;
    }

    return {
      selectedOperator: _.get(this.props.modalState, 'operator'),
      selectedAttribute: {
        type: _.get(this.props.modalState, 'type'),
        field: _.get(this.props.modalState, 'field'),
        selectField: _.get(this.props.modalState, 'select'),
      },
      autocompleteValue: _.get(this.props.modalState, 'field') ? _.get(this.props.modalState, 'field').split('.').slice(-1)[0] : '',
      value1: convertedValue1,
      value2: convertedValue2,
      select: _.get(this.props.modalState, 'selectField'),
      field: _.get(this.props.modalState, 'field'),
      schemaId: _.get(this.props.modalState, 'schemaId')
    }
  }

  state = this.rehydrateProps();

  onFocusAutocomplete = (e) => {
    this.stop$ = Rx.Observable.fromEvent(e.target, 'focusout');
    this.stop$.take(1).subscribe();

    Rx.Observable.fromEvent(e.target, 'keyup').map( x => x.target.value).distinctUntilChanged().debounceTime(500).last( debouncedText => this.searchField(debouncedText) )
    .takeUntil(this.stop$).subscribe();
  }

  async searchField(inputValue) {
    if(!inputValue || inputValue.trim().length === 0) {
      this.setState( {
        loading: false,
        selectedAttribute: undefined,
        selectedOperator: undefined,
        value1: undefined,
        value2: undefined,
        openModal: false,
        autocompleteResults: undefined,
        autocompleteValue: ''
      } );

      return;
    }

    // TO DO, debounce and move fetchAutocomplete out of here.
    this.setState({loading: true, openModal: false});
    let results = await fetchAutocomplete(this.props.api, this.props.auth, inputValue);

    let schemas = {};
    results.fields['schemaFields.name'].map( x => {
      if (schemas[x.doc.schemaId] ) {
        schemas[x.doc.schemaId].attributes.push(
          {
            displayName: x.doc.name,
            type: x.doc.fieldType,
            field: x.doc.searchField,
            selectField: x.doc.selectField,
            schemaId: x.doc.schemaId,
          }
        )
      } else {
        schemas[x.doc.schemaId] = { attributes: [
          {
            displayName: x.doc.name,
            type: x.doc.fieldType,
            field: x.doc.searchField,
            selectField: x.doc.selectField,
            schemaId: x.doc.schemaId
          }
        ] };
      }
    });

    let schemaPromises = Object.keys(schemas).map( schemaId => fetchSDOSchema(this.props.api, this.props.auth, schemaId) );

    let schemaResults = await Promise.all(schemaPromises);
    schemaResults.map( schemaResult => {
      if(!('errors' in schemaResult)) {
        console.log("Schema result", schemaResult);
        schemas[ schemaResult.data.schema.id ].schema = schemaResult.data.schema.dataRegistry.name;
        schemas[ schemaResult.data.schema.id ].author = schemaResult.data.schema.dataRegistry.createdBy.organization.name;
        schemas[ schemaResult.data.schema.id ].version = `${schemaResult.data.schema.majorVersion}.${schemaResult.data.schema.minorVersion}`;
      } else {
        console.warn('Couldn\'t lookup schema', schemaResult.errors);
      }
    })

    let autocompleteResults = Object.keys(schemas).map( schema => schemas[schema] );

    this.setState( { autocompleteResults: autocompleteResults, openModal: true, loading: false } );
    console.log("Schemas", schemas);
  }

  onChangeAutocomplete = async (evt) => {
    this.setState( {
      selectedAttribute: undefined,
      selectedOperator: undefined,
      value1: undefined,
      value2: undefined,
      autocompleteValue: evt.target.value,
      autocompleteResults: undefined,
    } );
  }

  showGeolocationModal = async (evt) => {
    this.setState({ showGeolocationModal: true });
  }

  getGeolocationPoint = (evt) => {
    this.setState({
      showGeolocationModal: false,
      value1: this.geoModal.getFilterValue()
    })
  }

  closeGeolocationModal = (evt) => {
    this.setState({ showGeolocationModal: false });
  }

  hasType() {
    return this.state.selectedAttribute && this.state.selectedAttribute.type;
  }

  hasOperator() {
    return this.state.selectedOperator && this.state.selectedOperator.length > 0;
  }

  hasValue(type, operator) {
    if(operator === 'range') {
      if(type === 'string') {
        return  this.state.value1 && this.state.value2 && this.state.value1.trim().length > 0 && this.state.value2.trim().length > 0;
      } else if (type === 'number' || type === 'integer' || type === 'dateTime') {
        return this.state.value1 && this.state.value2;
      } else if (type === 'boolean') {
        return Boolean(this.state.value1) && Boolean(this.state.value2);
      } else {
        console.warn('Unknown range type', type);
      }
    } else {
      if(type === 'string') {
        return  this.state.value1 && this.state.value1.trim().length > 0;
      } else if (type === 'number' || type === 'integer' || type === 'dateTime') {
        return this.state.value1;
      } else if (type === 'boolean') {
        return Boolean(this.state.value1);
      } else {
        // geopoint handle later
        return this.state.value1;
      }
    }
  }

  returnValue() {
    const getUTCDate = (dateString = Date.now()) => {
      const date = new Date(dateString);

      return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
      );
    };

    if( !this.hasType() || !this.hasOperator() || !this.hasValue(this.state.selectedAttribute.type, this.state.selectedOperator)) {
      return;
    } else {
      let convertedValue1 = this.state.value1;
      let convertedValue2 = this.state.value2;
      if(this.state.selectedAttribute.type === 'dateTime') {
        convertedValue1 = this.state.value1 && this.state.value1.trim().length > 0 ? format(getUTCDate(parse(this.state.value1)), 'YYYY-MM-DDTHH:mm:ss.sss') + 'Z' : null;
        convertedValue2 =  this.state.value2 && this.state.value2.trim().length > 0 ? format(getUTCDate(parse(this.state.value2)), 'YYYY-MM-DDTHH:mm:ss.sss') + 'Z' : null;
      }

      return (
        {
          type: this.state.selectedAttribute.type,
          operator: this.state.selectedOperator,
          value1: convertedValue1,
          value2: convertedValue2,
          select: this.state.selectedAttribute.selectField,
          field: this.state.selectedAttribute.field,
          schemaId: this.state.selectedAttribute.schemaId
        }
      );
    }
  }

  onSelectAttribute = (selectedAttribute) => {
    let defaultOperator;
    let value1 = undefined;
    let value2 = undefined;
    if(selectedAttribute.type === 'geoPoint') {
      defaultOperator = 'within';
    } else {
      defaultOperator = 'is';
      if(selectedAttribute.type === 'dateTime') {
        value1 = format(
          new Date(),
          'YYYY-MM-DDTHH:mm'
        )
        console.log("Value1", value1);
      } else if (selectedAttribute.type === 'boolean') {
        value1 = "true";
      }
    }
    this.setState(
      {
        autocompleteValue: selectedAttribute.field.split('.').slice(-1)[0],
        selectedAttribute: selectedAttribute,
        selectedOperator: defaultOperator,
        value1: value1,
        value2: value2,
        openModal: false,
        schemaId: selectedAttribute.schemaId
      }
    );
  }

  openAttribute = (evt) => {
    if(this.state.autocompleteResults) {
      this.setState( { openModal: true} );
    } else {
      this.searchField(this.state.autocompleteValue);
    }
  }

  closeAttribute = () => {
    this.setState( { openModal: false });
  }

  onSelectOperator = (event) => {
    let value1 = this.state.value1;
    let value2 = this.state.value2;
    if(event.target.value === 'range' && this.state.selectedOperator !== 'range') {
      value1 = '';
      value2 = '';
    }
    this.setState({ selectedOperator: event.target.value, value1: value1, value2: value2 });
  }

  getSelectedOperatorLabel(value) {
    return StructuredDataModal.OPERATOR_LABELS[value]
  }

  renderOperators(type) {
    let operators = [];
    if(type === 'string') {
      operators = [...StructuredDataModal.STRING_OPERATORS];
    } else if (type === 'number' || type === 'integer' || type === 'dateTime') {
      operators = [...StructuredDataModal.NUMERIC_OPERATORS];
    } else if (type === 'boolean') {
      operators = [...StructuredDataModal.BOOLEAN_OPERATORS];
    } else if (type === 'geoPoint') {
      operators = [...StructuredDataModal.GEOLOCATION_OPERATORS];
    }

    if(operators.length === 1) {
      if(type !== 'boolean') {
        return (
          <Fragment>
            <StaticTextField value={ this.state.selectedOperator } marginRight />
          </Fragment>
        );
      }
    } else {
      return (
        <Fragment>
            <TextField
              select
              margin="normal"
              style={ { marginRight: "0.5em" } }
              value={ this.state.selectedOperator }
              onChange={ this.onSelectOperator }
              SelectProps={
                {
                  renderValue: this.getSelectedOperatorLabel,
                  disableUnderline: true,
                }
              }
            >
              { operators.map( operator => (
                  <MenuItem key={operator} value={operator} style={{ justifyContent: 'space-between'} }>
                    <Typography variant={ 'headline' }>{ StructuredDataModal.OPERATOR_LABELS[operator] }</Typography>
                    <Typography align="right" variant={ 'headline' }>{ StructuredDataModal.SYMBOL_LABELS[operator] }</Typography>
                  </MenuItem>)
                )
              }
          </TextField>
        </Fragment>
      );
    }
  }

  getInputType(type) {
    if(type === 'number' || type === 'integer') {
      return 'number';
    } else if (type === 'dateTime') {
      return 'datetime-local';
    } else {
      return 'string';
    }
  }

  onChangeValue = (field) => {
    return (event) => {
      this.setState( { [field]: event.target.value });
    }
  }

  renderGeolocationLabel( geoPoint ) {
    if(!geoPoint) {
      return;
    }
    return `${Number((geoPoint.distance).toFixed(0))} meters of ${Number((geoPoint.latitude).toFixed(2))}, ${Number((geoPoint.longitude).toFixed(2))}`;
  }

  renderGeolocationModal(showGeolocationModal) {
    if(showGeolocationModal) {
      return (
      <Dialog PaperProps={{ style: { width: '100%'} } } open={ showGeolocationModal }>
      <DialogTitle>Search by Geolocation</DialogTitle>
      <DialogContent>
        <GeolocationModal modalState={ this.state.value1 } ref={ input => { this.geoModal = input; } } />
      </DialogContent>
      <DialogActions>
        <Button onClick={this.closeGeolocationModal} color="primary">
          Cancel
        </Button>
        <Button onClick={this.getGeolocationPoint} color="primary">
          Submit
        </Button>
      </DialogActions>
      </Dialog>)
    }
  }

  renderValue(operator, type) {
    const valueFields = [];
    if (type === 'boolean') {
      return (
        <Fragment>
          <RadioGroup
          onChange={ this.onChangeValue('value1') }
          value={ this.state.value1 }
          style={{ flexDirection: 'row' }}
          aria-label="bool_value"
          name="bool_value"
          margin="normal"
          >
            <FormControlLabel key="bool_value1_true" value="true" control={<Radio />} label="True" />
            <FormControlLabel key="bool_value1_false" value="false" control={<Radio />} label="False" />
          </RadioGroup>
        </Fragment>
      );
    } else if (operator === 'range') {
      return (
        <Fragment>
          <TextField
          onChange={ this.onChangeValue('value1') }
          type={ this.getInputType(type) }
          value={ this.state.value1 }
          margin="normal"
          style={ styles.row }
          required
          id="value1" />
          <StaticTextField value={ 'and' } marginLeft marginRight/>
          <TextField
          onChange={ this.onChangeValue('value2') }
          type={ this.getInputType(type) }
          value={ this.state.value2 }
          margin="normal"
          style={ styles.row }
          required
          id="value2"
          />
        </Fragment>
      );
    } else if (operator === 'within') {
      return (
        <Fragment>
          <TextField
          onChange={ this.onChangeValue('value1') }
          onMouseDown={ this.showGeolocationModal }
          margin="normal"
          value={ this.renderGeolocationLabel(this.state.value1) }
          style={ styles.row }
          required
          placeholder="select geolocation"
          id="value1"
          />
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <TextField
          onChange={ this.onChangeValue('value1') }
          type={ this.getInputType(type) }
          value={ this.state.value1 }
          margin="normal"
          style={ styles.row }
          required
          placeholder="search value"
          id="value1"
          />
        </Fragment>
      );
    }
  }

  render() {
    return [
      <SearchAttribute
        onOpen={ this.openAttribute }
        onBlur={ this.closeAttribute }
        onSelect={ this.onSelectAttribute }
        onFocusAutocomplete={ this.onFocusAutocomplete }
        isOpen={ this.state.openModal }
        selectedItem={ this.state.autocompleteValue }
        onChange={ this.onChangeAutocomplete }
        data={ this.state.autocompleteResults }
        loading= { this.state.loading }
      />,
      <FormControl fullWidth style={{ display: "flex", flexDirection: "row" }}>
        { this.state.selectedAttribute && this.state.selectedAttribute.type ? this.renderOperators(this.state.selectedAttribute.type) : null }
        { this.state.selectedOperator && this.state.selectedOperator.length > 0 ? this.renderValue(this.state.selectedOperator, this.state.selectedAttribute.type) : null }
        { this.renderGeolocationModal(this.state.showGeolocationModal) }
      </FormControl>,

    ]
  }
}
StructuredDataModal.defaultProps = {
  modalState: { search: ''}
};

const StructuredDataDisplay = modalState => {
  const getAbbreviation = (modalState) => {
    if (modalState.operator === 'range') {
      return `${modalState.field.split('.').slice(-1)[0]} ${StructuredDataModal.OPERATOR_ABRV[modalState.operator]} (${modalState.value1},${modalState.value2})`
    } else if (modalState.operator === 'within') {
      return `${Number((modalState.value1.distance).toFixed(0))} meters of ${Number((modalState.value1.latitude).toFixed(2))}, ${Number((modalState.value1.longitude).toFixed(2))}`
    } else {
      return  `${modalState.field.split('.').slice(-1)[0]} ${StructuredDataModal.OPERATOR_ABRV[modalState.operator]} ${modalState.value1}`
    }
  }
  return {
    abbreviation: getAbbreviation(modalState),
    exclude: modalState.operator.indexOf('not') !== -1,
    thumbnail: null
  };
};


export default StructuredDataModal;

export {
  StructuredDataModal,
  StructuredDataDisplay
};
