import React from 'react';
import { Avatar, Paper, TextField } from '@material-ui/core';
import Downshift from 'downshift';
import { bool, func, string, shape, arrayOf, array } from 'prop-types';

import Rx from 'rxjs/Rx';
import "rxjs/add/operator/take";
import "rxjs/add/operator/takeUntil";

import Typography from '@material-ui/core/Typography';
import { List, ListItem, ListItemText } from '@material-ui/core';

// const autocompletePillLabelClass = cx(styles['autocompletePillLabel']);
// const autocompletePillClass = cx(styles['autocompletePill']);
// const deleteIconClass = cx(styles['deleteIcon']);

class SearchAutocompleteContainer extends React.Component {
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
    onClickAutocomplete: func,
    onChange: func,
    isOpen: bool,
    cancel: func
  };

  state = JSON.parse(JSON.stringify(this.props.componentState));

  debouncedOnChange = e => {
    this.stop$ = Rx.Observable.fromEvent(e.target, 'focusout');
    this.stop$.take(1).subscribe();

    Rx.Observable.fromEvent(e.target, 'keyup').map( x => x.target.value).distinctUntilChanged().debounceTime(500).last( debouncedText => this.props.onChange(debouncedText) )
    .takeUntil(this.stop$).subscribe();
  };

  onKeyDown = e => {
    this.setState({queryString: e.target.value});
  }

  onEnter = event => {
    if (event.key === 'Enter') {
      // if (isArray(this.props.componentState.queryResults) && this.props.componentState.queryResults.length) {
      //   this.props.applyFilter();
      // }
    }
  };

  selectResult = (result) => {
    if(this.props.selectResult) {
      this.props.selectResult(result);
    }
    if(result && result.label) {
      this.setState({
        queryString: result.label
      })
    }
  }

  render() {
    return (
      <SearchAutocompleteDownshift
        defaultIsOpen={ this.props.defaultIsOpen }
        cancel={ this.props.cancel }
        debouncedOnChange={ this.debouncedOnChange }
        onKeyPress={ this.onEnter }
        onChange={ this.onKeyDown }
        queryString={ this.state.queryString }
        results={ this.props.componentState.queryResults }
        selectResult={ this.selectResult }
        onClickAutocomplete={ this.props.onClickAutocomplete }
        isOpen={this.props.isOpen}
      />
    );
  }
}

const SearchAutocompleteDownshift = ({
  defaultIsOpen,
  debouncedOnChange,
  onChange,
  onKeyPress,
  queryString,
  results,
  selectResult,
  onClickAutocomplete,
  isOpen
}) => {
  const RESULT_COUNT_PER_CATEGORY = 10;
  const itemToString = (item) => item && item.label;
  const onFocus = (event) => { debouncedOnChange(event); event.target.select() };

  return (
    <Downshift
      isOpen={isOpen}
      itemToString={ itemToString }
      onSelect={ selectResult }
      defaultIsOpen={ defaultIsOpen }
    >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          highlightedIndex,
          openMenu
        }) => (
        <div>
          <TextField
            {...getInputProps({
              value: queryString,
              placeholder: "Type to search",
              autoFocus: true,
              fullWidth: true,
              onFocus: onFocus,
              onChange: onChange,
              onClick: () => {
                if(onClickAutocomplete) {
                  onClickAutocomplete();
                }
                openMenu();
              },
              onKeyPress: onKeyPress
            })}
          />
          { isOpen && results && results.length ?
            <Paper square
              style={{
                maxHeight: '300px',
                overflow: 'auto',
              }}
            >
              <List dense={true}>
              {
                results && results.reduce((result, section, sectionIndex) => {
                  result.sections.push(
                    <div key={ 'section_' + sectionIndex }>
                      <ListItem>
                        <ListItemText primary={section.header}/>
                      </ListItem>
                      <div>
                        {
                          section.items && section.items.length
                          ? section.items.slice(0, RESULT_COUNT_PER_CATEGORY).map((item) => {
                              const indexAcc = result.itemIndex++;
                              return (
                                <ListItem button
                                  key={ 'item' + indexAcc }
                                  component="div"
                                  {...getItemProps({
                                    item: item,
                                    index: indexAcc,
                                    selected: highlightedIndex === indexAcc,
                                    style: {
                                      backgroundColor:
                                        highlightedIndex === indexAcc ? '#eeeeee' : null,
                                    }
                                  })}
                                >
                                  { item.image
                                    ? <Avatar src={ item.image } />
                                    : null
                                  }
                                  <ListItemText style={{ paddingLeft: "1em" }} primary={item.label} secondary={item.description}/>
                                </ListItem>
                              )
                            })
                          : <ListItem><Typography style={{ paddingLeft: "1em" }}>No Results</Typography></ListItem>
                        }
                      </div>
                    </div>
                  );
                  return result;
                }, { sections: [], itemIndex: 0 } ).sections
              }
              </List>
            </Paper>
            : null
          }
        </div>
      )}
    </Downshift>
  );
};

SearchAutocompleteDownshift.propTypes = {
  defaultIsOpen: bool,
  debouncedOnChange: func,
  onChange: func,
  onKeyPress: func,
  queryString: string,
  results: array,
  selectResult: func,
  onClickAutocomplete: func,
  isOpen: bool,
}

SearchAutocompleteContainer.defaultProps = {
  componentState: {
    error: false,
    queryString: '',
    queryResults: []
  },
  onChange: value => console.log('Autocomplete field changed', value),
  cancel: () => console.log('You clicked cancel')
};

export {
  SearchAutocompleteContainer,
  SearchAutocompleteDownshift
}

export default SearchAutocompleteContainer;
