import React from 'react';
import { Avatar, Button, Chip, MenuItem, Paper, TextField } from 'material-ui';
import Downshift from 'downshift';
import { isArray } from 'lodash';
import Rx from 'rxjs/Rx';
import cx from 'classnames';
import { bool, func, string, shape, arrayOf } from 'prop-types';
import styles from './styles.scss';

const autocompletePillLabelClass = cx(styles['autocompletePillLabel']);
const autocompletePillClass = cx(styles['autocompletePill']);
const deleteIconClass = cx(styles['deleteIcon']);

class SearchAutocompleteContainer extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedOnChange$ = new Rx.Subject();
  }

  static propTypes = {
    selectResult: func,
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
      )
    }),
    onChange: func,
    applyFilter: func,
    cancel: func
  };

  state = JSON.parse(JSON.stringify(this.props.componentState));

  componentDidMount() {
      this.subscription = this.debouncedOnChange$
        .debounceTime(500)
        .distinctUntilChanged()
        .switchMap( debouncedText => this.props.onChange(debouncedText) )
        .subscribe(debouncedText => {
          this.props.onChange(debouncedText)
        });
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  debouncedOnChange = event => {
    let text = event.target.value;
    this.debouncedOnChange$.next(text);
    this.setState(Object.assign({}, this.state, { queryString: text }));
  };

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
          <SearchAutocompleteDownshift
            cancel={ this.props.cancel }
            applyFilter={ this.props.applyFilter }
            debouncedOnChange={ this.debouncedOnChange }
            onKeyPress={ this.onEnter }
            queryString={ this.state.queryString }
            results={ this.props.componentState.queryResults }
            selectResult={ this.props.selectResult }
          />
        </div>
      </div>
    );
  }
}

const SearchAutocompleteDownshift = ({
  cancel,
  applyFilter,
  debouncedOnChange,
  onKeyPress,
  inputValue,
  queryString,
  results,
  selectResult
}) => {
  const RESULT_COUNT_PER_CATEGORY = 10;
  const itemToString = (item) => item && item.label;
  const onFocus = (event) => event.target.select();
  return (
    <Downshift
      itemToString={ itemToString }
      onSelect={ selectResult }
      render={({
        getInputProps,
        getItemProps,
        selectedItem,
        inputValue,
        highlightedIndex,
        isOpen
      }) => (
        <div>
          <TextField
            {...getInputProps({
              value: queryString,
              placeholder: "Type to search",
              autoFocus: true,
              onFocus: onFocus,
              onChange: debouncedOnChange,
              onKeyPress: onKeyPress
            })}
          />
          { isOpen ?
            <Paper square>
              {
                results && results.reduce((result, section, sectionIndex) => {
                  result.sections.push(
                    <div key={ 'section_' + sectionIndex }>
                      <div>{ section.header }</div>
                      <div>
                        {
                          section.items && section.items.length
                          ? section.items.slice(0, RESULT_COUNT_PER_CATEGORY).map((item, index) => {
                              const indexAcc = result.itemIndex++;
                              return (
                                <MenuItem
                                  key={ 'item' + indexAcc }
                                  component="div"
                                  {...getItemProps({
                                    item: item,
                                    index: indexAcc,
                                    selected: highlightedIndex === indexAcc
                                  })}
                                >
                                  { item.image
                                    ? <Avatar src={ item.image } />
                                    : null
                                  }
                                  <div>{ item.label }</div>
                                  <div>{ item.description }</div>
                                </MenuItem>
                              )
                            })
                          : <div>No Results</div>
                        }
                      </div>
                    </div>
                  );
                  return result;
                }, { sections: [], itemIndex: 0 } ).sections
              }
            </Paper>
            : null
          }
        </div>
      )}
    />
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
