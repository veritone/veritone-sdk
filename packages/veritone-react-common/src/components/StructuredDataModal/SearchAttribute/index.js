/* eslint-disable no-param-reassign */
import React from 'react';
import { func, bool, any } from 'prop-types';
import Downshift from 'downshift';

import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { ListItem, ListItemText } from '@material-ui/core';

const renderInput = inputProps => {
  const { value, onFocus, open, ref, onChange, ...other } = inputProps;
  return (
    <TextField
      fullWidth
      value={value || ''}
      inputRef={ref}
      onChange={onChange}
      inputProps={{
        ...other,
        onFocus,
        onClick: open,
      }}
    />
  );
};

const renderSections = ({ results, getItemProps, highlightedIndex }) => {
  if (results && results.length === 0) {
    return (
      <ListItem dense {...getItemProps({ item: null })} key="no_results">
        <ListItemText style={{ paddingLeft: '1em' }} primary="No results" />
      </ListItem>
    );
  }
  if (!results) {
    return null;
  }

  const versions = results.reduce((x, y) => {
    if (`${y.author}|${y.schema}` in x) {
      x[`${y.author}|${y.schema}`] += 1;
    } else {
      x[`${y.author}|${y.schema}`] = 1;
    }
    return x;
  }, {});

  return results.reduce(
    (result, section, sectionIndex) => {
      result.sections.push(
        <div key={`${section.schema}_${section.author}_${section.version}`}>
          <ListItem dense key={`${sectionIndex}_header`}>
            <ListItemText
              style={{ fontSize: '90%' }}
              primary={`${section.schema || 'Unknown Schema'} ${
                versions[`${section.author}|${section.schema}`] > 1
                  ? `v${section.version}`
                  : ''
              }`}
              secondary={`by ${section.author || 'Unknown Author'}`}
            />
          </ListItem>
          {section.attributes.map(field => {
            // eslint-disable-next-line no-plusplus
            const index = result.itemIndex++;
            if (field && field.field) {
              return (
                <ListItem
                  dense
                  style={{
                    backgroundColor:
                      highlightedIndex === index ? '#eeeeee' : null,
                  }}
                  {...getItemProps({ item: field, index })}
                  key={`"${field.field}"`}
                >
                  <ListItemText
                    style={{ paddingLeft: '1em' }}
                    primary={`${field.displayName || field.field}`}
                  />
                </ListItem>
              );
            }

            return null;
          })}
        </div>
      );

      return result;
    },
    { sections: [], itemIndex: 0 }
  ).sections;
};

const SearchAttribute = ({
  onSelect,
  loading,
  selectedItem,
  isOpen,
  onOpen,
  onBlur,
  onChange,
  onFocusAutocomplete,
  data,
}) => {
  const itemToString = item => (item ? item.displayName || item.field : '');

  return (
    <Downshift
      isOpen={isOpen}
      onOuterClick={onBlur}
      onSelect={onSelect}
      itemToString={itemToString}
      selectedItem={selectedItem}
      results={data}
      render={({
        getInputProps,
        getItemProps,
        isOpen: isOpenRender,
        highlightedIndex,
      }) => (
        <div key="autocomplete_sections">
          {renderInput(
            getInputProps({
              onFocus: onFocusAutocomplete,
              open: onOpen,
              onChange,
              value: selectedItem,
              placeholder: 'Search by attribute',
              id: 'integration-downshift',
            })
          )}
          {loading ? <LinearProgress style={{ height: '0.1em' }} /> : null}
          {isOpenRender && !loading ? (
            <Paper>
              {renderSections({
                results: data,
                getItemProps,
                highlightedIndex,
              })}
            </Paper>
          ) : null}
        </div>
      )}
    />
  );
};

SearchAttribute.propTypes = {
  onSelect: func,
  loading: bool,
  selectedItem: any,
  isOpen: bool,
  onOpen: func,
  onBlur: func,
  onChange: func,
  onFocusAutocomplete: func,
  data: any,
};

export default SearchAttribute;
