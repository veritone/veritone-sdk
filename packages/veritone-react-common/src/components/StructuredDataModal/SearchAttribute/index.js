import React from 'react';
import { number, func, array, bool, any } from 'prop-types';
import Downshift from 'downshift';

import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { ListItem, ListItemText } from '@material-ui/core';

const renderInput = (inputProps) => {
  const { value, onFocus, open, ref, onChange, ...other } = inputProps;
  return (
    <TextField
      fullWidth
      autoFocus
      value={value || ''}
      inputRef={ref}
      onChange={onChange}
      inputProps={{
        ...other,
        onFocus: onFocus,
        onClick: open,
      }}
    />
  );
}

const renderSections = ({ results, getItemProps, highlightedIndex }) => {
  if (results && results.length === 0) {
    return (
      <ListItem dense {...getItemProps({ item: null })} key="no_results">
        <ListItemText
          style={{ paddingLeft: "1em" }}
          primary="No results"
        />
      </ListItem>
    )
  } else if (!results) {
    return;
  }

  const versions = results.reduce((x, y) => {
    if (`${y.author}|${y.schema}` in x) {
      x[`${y.author}|${y.schema}`] += 1;
    } else {
      x[`${y.author}|${y.schema}`] = 1;
    }
    return x;
  }, {});

  return results.reduce((result, section, sectionIndex) => {
    const ver = versions[`${section.author}|${section.schema}`] > 1 ? `v${section.version}` : '';
    result.sections.push(
      <div key={`${section.schema}_${section.author}_${section.version}`}>
        <ListItem dense key={`${sectionIndex}_header`}>
          <ListItemText
            style={{ fontSize: "90%" }}
            secondary={`by ${section.author || 'Unknown Author'}`}
            primary={`${section.schema || 'Unknown Schema'} ${ver}`}
          />
        </ListItem>
        {
          section.attributes.map((field) => {
            const index = result.itemIndex++;
            if (field && field.field) {
              return (
                <ListItem dense style={{ backgroundColor: highlightedIndex === index ? '#eeeeee' : null }} {...getItemProps({ item: field, index })} key={`"${field.field}"`}>
                  <ListItemText
                    style={{ paddingLeft: "1em" }}
                    primary={`${field.displayName || field.field}`}
                  />
                </ListItem>
              )
            }
          })
        }
      </div>
    )

    return result;
  }, { sections: [], itemIndex: 0 }).sections
}

renderSections.propTypes = {
  results: array,
  getItemProps: func,
  highlightedIndex: number,
}

const SearchAttribute = ({ onSelect, loading, selectedItem, isOpen, onOpen, onBlur, onChange, onFocusAutocomplete, data }) => {
  const itemToString = (item) => {
    return item ? item.displayName || item.field : '';
  }
  return (<Downshift
    isOpen={isOpen}
    onOuterClick={onBlur}
    onSelect={onSelect}
    itemToString={itemToString}
    selectedItem={selectedItem}
    results={data}
    render={({ getInputProps, getItemProps, isOpen, highlightedIndex }) => {
      return (
        <div key="autocomplete_sections">
          {renderInput(getInputProps({
            onFocus: onFocusAutocomplete,
            open: onOpen,
            onChange: onChange,
            value: selectedItem,
            placeholder: 'Search by attribute',
            id: 'integration-downshift'
          }))}
          {loading ? <LinearProgress style={{ height: "0.1em" }} /> : null}
          {isOpen && !loading ? <Paper>
            {
              renderSections({
                results: data,
                getItemProps,
                highlightedIndex
              })
            }
          </Paper> : null}
        </div>
      )
    }
    } />)
}

SearchAttribute.propTypes = {
  onSelect: func,
  loading: bool,
  selectedItem: any,
  isOpen: bool,
  onOpen: func,
  onBlur: func,
  onChange: func,
  onFocusAutocomplete: func,
  data: any
}

export default SearchAttribute;
