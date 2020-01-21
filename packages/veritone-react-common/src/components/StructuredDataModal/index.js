import React, { Fragment } from 'react';
import { bool, func, object, number, string, any, array } from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { FormControl, FormControlLabel } from '@material-ui/core';
import { Radio, RadioGroup } from '@material-ui/core';
import { ListItem, ListItemText } from '@material-ui/core';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';

import { format, parse } from 'date-fns';
import { get } from 'lodash';

import SelectSchemas from '../InfiniteSelect/SelectSchemas';
import SelectAttributes from '../InfiniteSelect/SelectAttributes';
import StaticTextField from './StaticTextField';
import { GeolocationModal } from '../GeolocationModal';

import { getAttribute } from '../InfiniteSelect/graphql';
import Loader from '../InfiniteSelect/Loader';
import StringValuePicker from './SearchAttribute/autocomplete';
import { fetchAutocompleteValues } from './SearchAttribute/fetchAutocomplete';

import Rx from 'rxjs/Rx';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';

import styles from './styles.scss';

class StructuredDataModal extends React.Component {
  async componentDidMount() {
    if (this.props.modalState.field) {
      let state = await this.rehydrateProps(this.props.modalState);

      if (this._schemaPicker) {
        this._schemaPicker.onSelect(state.selectedSchema);
      }

      if (this._attributePicker) {
        this._attributePicker.onSelect(state.selectedAttribute);
      }

      this.setState(state);
    } else if (this.props.presetSDOAttribute) {
      let state = await this.rehydrateProps(this.props.presetSDOAttribute);
      state.value1 = undefined;
      state.value2 = undefined;

      if (this._schemaPicker) {
        this._schemaPicker.onSelect(state.selectedSchema);
      }

      if (this._attributePicker) {
        this._attributePicker.onSelect(state.selectedAttribute);
      }

      this.setState(state);
    } else if (this.props.presetSDOSchema) {
      const schemaLookup = await getAttribute({
        api: this.props.api,
        auth: this.props.auth,
        schemaId: this.props.presetSDOSchema
      });

      const selectedSchema = {
        id: get(schemaLookup, 'data.schema.dataRegistry.id'),
        name: get(schemaLookup, 'data.schema.dataRegistry.name'),
        organization: get(
          schemaLookup,
          'data.schema.dataRegistry.organization.name'
        ),
        majorVersion: get(
          schemaLookup,
          'data.schema.dataRegistry.publishedSchema.majorVersion'
        )
      };

      this.setState(
        {
          selectedSchema
        },
        () => this._schemaPicker.onSelect(selectedSchema)
      );
    }
  }

  state = {
    type: undefined,
    selectedSchema: undefined,
    selectedAttribute: undefined,
    selectedOperator: undefined,
    value1: undefined,
    value2: undefined,
    select: undefined,
    field: undefined
  };

  static propTypes = {
    open: bool,
    modalState: object,
    cancel: func,
    majorVersion: number,
    schemaId: string,
    presetSDOAttribute: any,
    api: string,
    auth: string,
    presetSDOSchema: string,
    sourceFilters: array
  };

  static defaultProps = {
    modalState: {},
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
  };

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
  };

  static SYMBOL_LABELS = {
    gte: '≥',
    lte: '≤',
    gt: '>',
    lt: '<'
  };

  static SUPPORTED_TYPES = [
    'string',
    'number',
    'integer',
    'dateTime',
    'boolean',
    'geoPoint'
  ];

  static STRING_OPERATORS = ['contains', 'not_contains', 'is', 'is_not'];
  static NUMERIC_OPERATORS = [
    'is',
    'is_not',
    'gt',
    'gte',
    'lt',
    'lte',
    'range'
  ];
  static BOOLEAN_OPERATORS = ['is'];
  static GEOLOCATION_OPERATORS = ['within'];

  // converts CSP data structure back to modal's internal types
  rehydrateProps = async props => {
    const type = get(props, 'type');
    const schemaId = get(props, 'schemaId');
    let majorVersion = get(props, 'majorVersion');
    let dataRegistryId = get(props, 'dataRegistryId');
    let convertedValue1 = get(props, 'value1');
    let convertedValue2 = get(props, 'value2');

    if (type === 'dateTime') {
      convertedValue1 = convertedValue1
        ? format(parse(convertedValue1), 'YYYY-MM-DDTHH:mm')
        : undefined;
      convertedValue2 = convertedValue1
        ? format(parse(convertedValue2), 'YYYY-MM-DDTHH:mm')
        : undefined;
    }

    // need to lookup orgName, schemaName from database because those values are not immutable
    const schemaLookup = await getAttribute({
      api: this.props.api,
      auth: this.props.auth,
      schemaId
    });

    // need to lookup schemaName and orgName since those can change
    if (!dataRegistryId) {
      dataRegistryId = get(schemaLookup, 'data.schema.dataRegistry.id');
    }
    const schemaName = get(schemaLookup, 'data.schema.dataRegistry.name');
    const orgName = get(
      schemaLookup,
      'data.schema.dataRegistry.organization.name'
    );

    // preserve backwards compatability with existing SDO watchlists.
    // old sdo watchlists don't specify the major version, so we default to the published one
    if (!majorVersion) {
      majorVersion = get(
        schemaLookup,
        'data.schema.dataRegistry.publishedSchema.majorVersion'
      );
    }

    let state = {
      type,
      selectedSchema: {
        id: dataRegistryId,
        name: schemaName,
        organization: orgName,
        majorVersion: majorVersion
      },
      selectedAttribute: {
        id: schemaId,
        majorVersion: majorVersion,
        organization: orgName,
        name: get(props, 'name'),
        field: get(props, 'field'),
        schemaName: schemaName,
        type: type
      },
      selectedOperator: get(props, 'operator'),
      selectedDataRegistryId: dataRegistryId,
      selectedSchemaMajorVersion: majorVersion,
      value1: convertedValue1,
      value2: convertedValue2,
      name: get(props, 'name'),
      select: get(props, 'select'),
      schemaId: get(props, 'schemaId'),
      majorVersion: majorVersion,
      field: get(props, 'field')
    };
    return state;
  };

  onSelectSchema = data => {
    if (this._attributePicker) {
      this._attributePicker.resetSelect();
    }

    this.setState({
      selectedDataRegistryId: data.id,
      selectedSchemaMajorVersion: data.majorVersion,
      selectedAttribute: undefined,
      selectedOperator: undefined,
      value1: undefined,
      value2: undefined,
      select: undefined,
      field: undefined
    });
  };

  onSelectAttribute = selectedAttribute => {
    let defaultOperator;
    let value1 = undefined;
    let value2 = undefined;

    if (
      get(selectedAttribute, 'field') !==
      get(this.state.selectedAttribute, 'field')
    ) {
      value1 = '';
      value2 = '';
    }

    if (selectedAttribute.type === 'geoPoint') {
      defaultOperator = 'within';
      if (
        get(selectedAttribute, 'field') !==
        get(this.state.selectedAttribute, 'field')
      ) {
        value1 = undefined;
        value2 = undefined;
      }
    } else {
      defaultOperator = 'is';
      if (selectedAttribute.type === 'dateTime') {
        value1 = format(new Date(), 'YYYY-MM-DDTHH:mm');
      } else if (selectedAttribute.type === 'boolean') {
        value1 = 'true';
      } else if (selectedAttribute.type === 'string') {
        defaultOperator = 'contains';
      }
    }

    this.setState({
      selectedAttribute: {
        id: selectedAttribute.id,
        type: selectedAttribute.type,
        name: selectedAttribute.name,
        field: selectedAttribute.field,
        schemaName: selectedAttribute.schemaName
      },
      selectedOperator: defaultOperator,
      value1: value1,
      value2: value2,
      schemaId: selectedAttribute.id,
      field: selectedAttribute.field,
      loadingAutocomplete: false,
      showStringAutoComplete: false
    });
  };

  onSelectAutocompleteValue = value => {
    this.setState({
      value1: value,
      showStringAutoComplete: false,
      loadingAutocomplete: false
    });
  };

  showGeolocationModal = async () => {
    this.setState({ showGeolocationModal: true });
  };

  getGeolocationPoint = () => {
    this.setState({
      showGeolocationModal: false,
      value1: this.geoModal.getFilterValue()
    });
  };

  closeGeolocationModal = () => {
    this.setState({ showGeolocationModal: false });
  };

  hasType() {
    return this.state.selectedAttribute && this.state.selectedAttribute.type;
  }

  hasOperator() {
    return (
      this.state.selectedOperator && this.state.selectedOperator.length > 0
    );
  }

  hasValue(type, operator) {
    if (operator === 'range') {
      if (type === 'string') {
        return (
          this.state.value1 &&
          this.state.value2 &&
          this.state.value1.trim().length > 0 &&
          this.state.value2.trim().length > 0
        );
      } else if (
        type === 'number' ||
        type === 'integer' ||
        type === 'dateTime'
      ) {
        return this.state.value1 && this.state.value2;
      } else {
        console.warn('Unknown range type', type);
      }
    } else {
      if (type === 'string') {
        return this.state.value1 && this.state.value1.trim().length > 0;
      } else if (
        type === 'number' ||
        type === 'integer' ||
        type === 'dateTime'
      ) {
        return this.state.value1;
      } else if (type === 'boolean') {
        return Boolean(this.state.value1);
      } else {
        // geopoint handle later
        return this.state.value1;
      }
    }
  }

  showAutocompleteValue = e => {
    this.stop$ = Rx.Observable.fromEvent(e.target, 'blur');
    this.stop$.take(1).subscribe();

    Rx.Observable.fromEvent(e.target, 'keyup')
      .map(x => x.target.value)
      .distinctUntilChanged()
      .debounceTime(500)
      .last(debouncedText => this.searchField(debouncedText))
      .takeUntil(this.stop$)
      .subscribe();
  };

  hideAutocompleteValue = () => {
    this.setState({
      showStringAutoComplete: false
    });
  };

  returnValue() {
    const getUTCDate = (dateString = Date.now()) => {
      const date = new Date(dateString);

      return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );
    };

    if (
      !this.hasType() ||
      !this.hasOperator() ||
      !this.hasValue(
        this.state.selectedAttribute.type,
        this.state.selectedOperator
      )
    ) {
      return;
    } else {
      let convertedValue1 = this.state.value1;
      let convertedValue2 = this.state.value2;
      if (this.state.selectedAttribute.type === 'dateTime') {
        convertedValue1 =
          this.state.value1 && this.state.value1.trim().length > 0
            ? format(
                getUTCDate(parse(this.state.value1)),
                'YYYY-MM-DDTHH:mm:ss.sss'
              ) + 'Z'
            : null;
        convertedValue2 =
          this.state.value2 && this.state.value2.trim().length > 0
            ? format(
                getUTCDate(parse(this.state.value2)),
                'YYYY-MM-DDTHH:mm:ss.sss'
              ) + 'Z'
            : null;
      }

      return {
        type: get(this.state.selectedAttribute, 'type'),
        operator: this.state.selectedOperator,
        value1: convertedValue1,
        value2: convertedValue2,
        select: get(this.state.selectedAttribute, 'field').split('.')[0],
        schemaId: this.state.schemaId,
        dataRegistryId: this.state.selectedDataRegistryId,
        name: get(this.state.selectedAttribute, 'name'),
        majorVersion: this.state.selectedSchemaMajorVersion,
        field: get(this.state.selectedAttribute, 'field')
      };
    }
  }

  onSelectOperator = event => {
    let value1 = this.state.value1;
    let value2 = this.state.value2;
    if (
      event.target.value === 'range' &&
      this.state.selectedOperator !== 'range'
    ) {
      value1 = '';
      value2 = '';
    }
    this.setState({
      selectedOperator: event.target.value,
      value1: value1,
      value2: value2
    });
  };

  getSelectedOperatorLabel(value) {
    return StructuredDataModal.OPERATOR_LABELS[value];
  }

  renderOperators(type) {
    let operators = [];
    if (type === 'string') {
      operators = [...StructuredDataModal.STRING_OPERATORS];
    } else if (type === 'number' || type === 'integer' || type === 'dateTime') {
      operators = [...StructuredDataModal.NUMERIC_OPERATORS];
    } else if (type === 'boolean') {
      operators = [...StructuredDataModal.BOOLEAN_OPERATORS];
    } else if (type === 'geoPoint') {
      operators = [...StructuredDataModal.GEOLOCATION_OPERATORS];
    }

    if (operators.length === 1) {
      if (type !== 'boolean') {
        return (
          <Fragment>
            <StaticTextField value={this.state.selectedOperator} marginRight />
          </Fragment>
        );
      }
    } else {
      return (
        <Fragment>
          <TextField
            select
            margin="none"
            style={{ marginRight: '0.5em' }}
            value={this.state.selectedOperator}
            onChange={this.onSelectOperator}
            SelectProps={{
              renderValue: this.getSelectedOperatorLabel,
              disableUnderline: true
            }}
          >
            {operators.map(operator => (
              <ListItem
                key={operator}
                value={operator}
                style={{ justifyContent: 'space-between' }}
              >
                <ListItemText variant="subtitle1">
                  {StructuredDataModal.OPERATOR_LABELS[operator]}
                </ListItemText>
                <ListItemText align="right" variant="subtitle1">
                  {StructuredDataModal.SYMBOL_LABELS[operator]}
                </ListItemText>
              </ListItem>
            ))}
          </TextField>
        </Fragment>
      );
    }
  }

  getInputType(type) {
    if (type === 'number' || type === 'integer') {
      return 'number';
    } else if (type === 'dateTime') {
      return 'datetime-local';
    } else {
      return 'string';
    }
  }

  onChangeValue = field => {
    return event => {
      this.setState({ [field]: event.target.value });
    };
  };

  async searchField(inputValue) {
    if (
      !inputValue ||
      inputValue.length === 0 ||
      inputValue.trim() !== this.state.value1
    ) {
      return;
    }

    if (
      this.state.selectedAttribute &&
      inputValue &&
      inputValue.trim().length > 0
    ) {
      this.setState({
        showStringAutoComplete: true,
        loadingAutocomplete: true,
        autocompleteValues: undefined
      });

      let field = this.state.selectedAttribute.field;
      let values = await fetchAutocompleteValues(
        this.props.api,
        this.props.auth,
        inputValue.trim().toLowerCase(),
        field,
        this.props.sourceFilters
      );
      let autocompleteValues =
        values && values.fields ? values.fields[field] : [];
      autocompleteValues = autocompleteValues.map(value => get(value, 'key'));
      this.setState({
        loadingAutocomplete: false,
        showStringAutoComplete: true,
        autocompleteValues
      });
    }
  }

  getAutoCompleteValue = e => {
    this.setState({ value1: e.target.value });
  };

  renderGeolocationLabel(geoPoint) {
    if (!geoPoint) {
      return;
    }
    return `${Number(geoPoint.distance.toFixed(0))} meters of ${Number(
      geoPoint.latitude.toFixed(2)
    )}, ${Number(geoPoint.longitude.toFixed(2))}`;
  }

  renderGeolocationModal = () => {
    return (
      <Dialog
        PaperProps={{
          style: { width: '100%', minHeight: '65vh', maxWidth: '75%' }
        }}
        open={this.state.showGeolocationModal}
      >
        <DialogTitle>Search by Geolocation</DialogTitle>
        <DialogContent>
          <GeolocationModal
            modalState={this.state.value1}
            ref={input => {
              this.geoModal = input;
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeGeolocationModal} color="primary">
            Cancel
          </Button>
          <Button onClick={this.getGeolocationPoint} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderValue(operator, type) {
    if (type === 'boolean') {
      return (
        <Fragment>
          <RadioGroup
            key="value1"
            onChange={this.onChangeValue('value1')}
            value={this.state.value1}
            style={{ flexDirection: 'row' }}
            aria-label="bool_value"
            name="bool_value"
            margin="normal"
          >
            <FormControlLabel
              key="bool_value1_true"
              value="true"
              control={<Radio />}
              label="True"
            />
            <FormControlLabel
              key="bool_value1_false"
              value="false"
              control={<Radio />}
              label="False"
            />
          </RadioGroup>
        </Fragment>
      );
    } else if (operator === 'range') {
      return (
        <Fragment>
          <TextField
            key="value1"
            onChange={this.onChangeValue('value1')}
            type={this.getInputType(type)}
            value={this.state.value1}
            margin="normal"
            className={styles['row']}
            required
            id="value1"
          />
          <StaticTextField value={'and'} marginLeft marginRight />
          <TextField
            key="value2"
            onChange={this.onChangeValue('value2')}
            type={this.getInputType(type)}
            value={this.state.value2}
            margin="normal"
            className={styles['row']}
            required
            id="value2"
          />
        </Fragment>
      );
    } else if (operator === 'within') {
      return (
        <Fragment>
          <TextField
            key="value1"
            onChange={this.onChangeValue('value1')}
            onMouseDown={this.showGeolocationModal}
            margin="normal"
            value={this.renderGeolocationLabel(this.state.value1)}
            className={styles['row']}
            required
            placeholder="select geolocation"
            id="value1"
          />
        </Fragment>
      );
    } else if (this.getInputType(type) === 'string') {
      return (
        <StringValuePicker
          loader={<Loader />}
          loading={this.state.loadingAutocomplete}
          onChange={this.getAutoCompleteValue}
          value={this.state.value1}
          items={this.state.autocompleteValues}
          onSelect={this.onSelectAutocompleteValue}
          onFocusAutocomplete={this.showAutocompleteValue}
          onBlurAutocomplete={this.hideAutocompleteValue}
          open={this.state.showStringAutoComplete}
        />
      );
    } else {
      return (
        <Fragment>
          <TextField
            key="value1"
            onChange={this.onChangeValue('value1')}
            type={this.getInputType(type)}
            value={this.state.value1}
            margin="none"
            className={styles['row']}
            required
            placeholder="search value"
            id="value1"
          />
        </Fragment>
      );
    }
  }

  setSchemaPicker = ref => {
    this._schemaPicker = ref;
  };

  setAttributePicker = ref => {
    this._attributePicker = ref;
  };

  render() {
    const selectedType = get(this.state.selectedAttribute, 'type');

    return [
      <SelectSchemas
        key="schemas"
        ref={this.setSchemaPicker}
        api={this.props.api}
        auth={this.props.auth}
        onSelect={this.onSelectSchema}
        selected={this.state.selectedSchema || null}
        autocompleteValue
      />,
      <SelectAttributes
        key="attributes"
        ref={this.setAttributePicker}
        placeholder={'Search by property'}
        api={this.props.api}
        auth={this.props.auth}
        selected={this.state.selectedAttribute || null}
        onSelect={this.onSelectAttribute}
        dataRegistryId={this.state.selectedDataRegistryId}
        majorVersion={this.state.selectedSchemaMajorVersion}
      />,
      <FormControl
        key="formControl"
        fullWidth
        margin="none"
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        {selectedType && this.renderOperators(selectedType)}
        {this.state.selectedOperator &&
          this.state.selectedOperator.length > 0 &&
          selectedType &&
          this.renderValue(this.state.selectedOperator, selectedType)}
        {this.state.showGeolocationModal && this.renderGeolocationModal()}
      </FormControl>
    ];
  }
}
StructuredDataModal.defaultProps = {
  modalState: { search: '' }
};

const StructuredDataDisplay = modalState => {
  const getAbbreviation = modalState => {
    const fieldName =
      modalState.name || modalState.field.split('.').slice(-1)[0];

    if (modalState.operator === 'range') {
      return `${fieldName} ${
        StructuredDataModal.OPERATOR_ABRV[modalState.operator]
      } (${modalState.value1},${modalState.value2})`;
    } else if (modalState.operator === 'within') {
      return `${Number(
        modalState.value1.distance.toFixed(0)
      )} meters of ${Number(modalState.value1.latitude.toFixed(2))}, ${Number(
        modalState.value1.longitude.toFixed(2)
      )}`;
    } else {
      return `${fieldName} ${
        StructuredDataModal.OPERATOR_ABRV[modalState.operator]
      } ${modalState.value1}`;
    }
  };
  return {
    abbreviation: getAbbreviation(modalState),
    exclude: modalState.operator.indexOf('not') !== -1,
    thumbnail: null
  };
};

export default StructuredDataModal;

export { StructuredDataModal, StructuredDataDisplay };
