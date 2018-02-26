import React from 'react';
import { Avatar, Button, Chip, ListItemSecondaryAction, Paper, TextField, ListItem, ListItemText, MenuItem } from 'material-ui';
import Downshift from 'downshift';
import { isArray } from 'lodash';
import Rx from 'rxjs/Rx';
import cx from 'classnames';
import { bool, func, string, shape, arrayOf } from 'prop-types';
import styles from './styles.scss';

import Typography from 'material-ui/Typography';

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
    defaultIsOpen: bool,
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
    cancel: func
  };

  state = JSON.parse(JSON.stringify(this.props.componentState));

  componentDidMount() {
    this.subscription = this.debouncedOnChange$
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap( debouncedText => this.props.onChange(debouncedText) )
      .subscribe();
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.componentState.queryString !== this.props.componentState.queryString) {
      this.setState({
        queryString: nextProps.componentState.queryString
      });
    }
  }

  debouncedOnChange = event => {
    let text = event.target.value;
    this.debouncedOnChange$.next(text);
    this.setState({ 
      queryString: text 
    });
  };

  onEnter = event => {
    if (event.key === 'Enter') {
      // if (isArray(this.props.componentState.queryResults) && this.props.componentState.queryResults.length) {
      //   this.props.applyFilter();
      // }
    }
  };

  render() {
    return (
      <div>
        <div>
          <SearchAutocompleteDownshift
            defaultIsOpen={ this.props.defaultIsOpen }
            cancel={ this.props.cancel }
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
  defaultIsOpen,
  cancel,
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
      isOpen={ defaultIsOpen }
      render={({
        getInputProps,
        getItemProps,
        selectedItem,
        inputValue,
        highlightedIndex,
        isOpen,
      }) => (
        <div>
          <TextField
            {...getInputProps({
              value: queryString,
              placeholder: "Type to search",
              autoFocus: true,
              fullWidth: true,
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
                      <MenuItem><Typography color="textSecondary">{ section.header }</Typography></MenuItem>
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
                                  <Typography style={{ paddingLeft: "1em" }}>{ item.label }</Typography>
                                  <Typography style={{ paddingLeft: "1em" }} color="textSecondary">{ item.description }</Typography>
                                </MenuItem>
                              )
                            })
                          : <MenuItem><Typography style={{ paddingLeft: "1em" }}>No Results</Typography></MenuItem>
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
  cancel: () => console.log('You clicked cancel')
};

export default SearchAutocompleteContainer;
