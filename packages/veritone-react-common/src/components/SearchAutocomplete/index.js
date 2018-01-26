import React from 'react';
import { Avatar, Button, Chip, TextField } from 'material-ui';
import Downshift from 'downshift';
import Rx from 'rxjs/Rx';
import { isArray } from 'lodash';

import cx from 'classnames';
import { bool, func, string, shape, arrayOf } from 'prop-types';
import styles from './styles.scss';

const autocompletePillLabelClass = cx(styles['autocompletePillLabel']);
const autocompletePillClass = cx(styles['autocompletePill']);
const deleteIconClass = cx(styles['deleteIcon']);

class SearchAutocompleteContainer extends React.Component {
  static propTypes = {
    selectPill: func,
    deselectPill: func,
    componentState: shape({
      error: bool,
      queryString: string,
      queryResults: arrayOf(
        shape({
          header: string,
          items: arrayOf(shape({
            id: string,
            type: string,
            image: string,
            label: string,
            description: string
          }))
        })
      ),
      selectedResults: arrayOf(
        shape({
          id: string,
          type: string,
          image: string,
          label: string,
          description: string
        })
      )
    }),
    onChange: func,
    applyFilter: func,
    cancel: func
  };

  state = JSON.parse(JSON.stringify(this.props.componentState));

  onEnter = event => {
    if (event.key === 'Enter') {
      console.log('Pressed Enter');
      if (this.state.queryString) {
        this.selectResult();
      } else if (this.state.selectedResults) {
        this.props.applyFilter();
      }
      // TODO: Select the first queryResults' element's item
    }
  };

  selectResult = result => {
    if (result) {
      this.props.selectPill(result);
    } else {
      let queryResults = this.state.queryResults;
      if (isArray(queryResults) && queryResults.length) {
        console.log('Pick top result');
        result = queryResults[0];
        if (result) {
          this.props.selectPill(result);
        }
      } 
    }
  };

  render() {
    console.log('auto props', this.props);
    console.log('auto state', this.state);
    return (
      <div>
        <div>
          {this.props.componentState.selectedResults.map(result => {
            const remove = () => this.props.deselectPill(result);
            return (
              <SearchAutocompletePill
                key={ result.id }
                image={ result.image }
                label={ result.label }
                remove={ remove }
              />
            );
          })}
        </div>
        <div>
          <SearchAutocompleteTextField
            defaultValue={ this.props.componentState.queryString }
            cancel={ this.props.cancel }
            applyFilter={ this.props.applyFilter }
            onChange={ this.props.onChange }
            onKeyPress={ this.onEnter }
            inputValue={ this.state.queryString }
          />
        </div>
        <div>
          <SearchAutocompleteResults
            select={ this.props.selectPill }
            results={ this.props.componentState.queryResults }
          />
        </div>
      </div>
    );
  }
}

const SearchAutocompleteTextField = ({ defaultValue, cancel, applyFilter, onChange, onKeyPress, inputValue }) => {
  return (
    <div>
      <TextField
        id="search_autocomplete_input"
        autoFocus
        margin="none"
        defaultValue={ defaultValue }
        onChange={ onChange }
        onKeyPress={ onKeyPress }
        placeholder="Type to search"
        helperText="Searches within our database"
      />
      <Button
        disabled={!inputValue && !defaultValue}
        onClick={ applyFilter }
        color="primary"
        raised
      >
        Search
      </Button>
    </div>
  );
}

const SearchAutocompletePill = ({ label, remove, image }) => {
  return (
    <Chip
      avatar={<Avatar src={ image } />}
      label={ label }
      className={ autocompletePillClass }
      classes={{ label: autocompletePillLabelClass, deleteIcon: deleteIconClass }}
      onRequestDelete={ remove }
    />
  );
}

const SearchAutocompleteResults = ({ select, results }) => {
  return (
    <div>
      {results.map(result => {
        return (
          <div key={result.header}>
            <div>{ result.header }</div>
            <div>
              { result.items.map(item => {
                const add = () => { select(item) };
                return (
                  <div key="item.id" onClick={ add }>
                    <Avatar src={ item.image } />
                    <div>{ item.label }</div>
                    <div>{ item.description }</div>
                  </div>
                )
              }) }
            </div>
          </div>
        )
      })}
    </div>
  );
};

SearchAutocompleteContainer.defaultProps = {
  componentState: {
    error: false,
    queryString: '',
    queryResults: [],
    selectedResults: [],
    inputValue: []
  },
  onChange: value => console.log('Autocomplete field changed', value),
  selectPill: value => console.log('Selected autocomplete result', value),
  deselectPill: value => console.log('Removed autocomplete result', value),
  applyFilter: value => console.log('Search by autocomplete result', value),
  cancel: () => console.log('You clicked cancel')
};

export default SearchAutocompleteContainer;