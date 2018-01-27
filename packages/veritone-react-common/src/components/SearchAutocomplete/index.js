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
    selectResult: func,
    componentState: shape({
      error: bool,
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
      )
    }),
    onChange: func,
    applyFilter: func,
    cancel: func
  };

  state = JSON.parse(JSON.stringify(this.props.componentState));

  onEnter = event => {
    if (event.key === 'Enter') {
      if (isArray(this.props.componentState.queryResults) && this.props.componentState.queryResults.length) {
        this.props.applyFilter();
      }
    }
  };

  render() {
    return (
      <div>
        <div>
          <SearchAutocompleteTextField
            cancel={ this.props.cancel }
            applyFilter={ this.props.applyFilter }
            onChange={ this.props.onChange }
            onKeyPress={ this.onEnter }
            queryString={ this.props.componentState.queryString }
            results={ this.props.componentState.queryResults }
          />
        </div>
        <div>
          <SearchAutocompleteResults
            selectResult={ this.props.selectResult }
            results={ this.props.componentState.queryResults }
          />
        </div>
      </div>
    );
  }
}

const SearchAutocompleteTextField = ({ cancel, applyFilter, onChange, onKeyPress, inputValue, queryString, results }) => {
  return (
    <div>
      <TextField
        id="search_autocomplete_input"
        autoFocus
        defaultValue={ queryString }
        margin="none"
        onChange={ onChange }
        onKeyPress={ onKeyPress }
        placeholder="Type to search"
        helperText="Searches within our database"
      />
      <Button
        disabled={ !results.length || !results[0].items || !results[0].items.length }
        onClick={ applyFilter }
        color="primary"
        raised
      >
        Search
      </Button>
    </div>
  );
}

const SearchAutocompleteResults = ({ selectResult, results }) => {
  return (
    <div>
      {results.map(result => {
        return (
          <div key={result.header}>
            <div>{ result.header }</div>
            <div>
              { result.items.map(item => {
                const select = () => { selectResult(item) };
                return (
                  <div key="item.id" onClick={ select }>
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
    inputValue: []
  },
  onChange: value => console.log('Autocomplete field changed', value),
  applyFilter: value => console.log('Search by autocomplete result', value),
  cancel: () => console.log('You clicked cancel')
};

export default SearchAutocompleteContainer;