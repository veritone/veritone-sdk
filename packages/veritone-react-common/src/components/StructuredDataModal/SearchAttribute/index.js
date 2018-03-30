import React from 'react';

import Downshift from 'downshift';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { List, ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';

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

const renderSections = ({results, getItemProps, highlightedIndex}) => {
  if(!results) {
    return [];
  }

  const versions = results.reduce((x, y) => {
    if (y.author in x) {
      x[y.author] += 1;
    } else {
      x[y.author] = 1;
    }
    return x;
  }, {});

  return results.reduce((result, section, sectionIndex) => {
    result.sections.push(
      <div key={sectionIndex}>
        <div>
          {section.schema} { versions[section.author] > 1 ? (`v${section.version}`) : null }
          by { section.author }
        </div>
        {section.attributes.map((language, languageIndex) => {
          const index = result.itemIndex++;
          return (
            <div style={{ backgroundColor: highlightedIndex === index ? '#eeeeee' : null }} {...getItemProps({item: language, index})} key={`"${language.field}"`}>
              { language.displayName || language.field }
            </div>
          )
        })}
      </div>
    )

    return result;
  }, { sections: [], itemIndex: 0}).sections
}

const SearchAttribute = ( { onSelect, selectedItem, isOpen, onOpen, onBlur, onChange, onFocusAutocomplete, data } ) => {
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
      render={({ getInputProps, getItemProps, isOpen, highlightedIndex }) =>
        {
          return (
          <div>
              {renderInput(getInputProps({
                  onFocus: onFocusAutocomplete,
                  open: onOpen,
                  onChange: onChange,
                  value: selectedItem || '',
                  placeholder: 'Search by attribute',
                  id: 'integration-downshift'
                }))}
              {isOpen ? <Paper>
                  {
                    renderSections({
                      results: data,
                      getItemProps,
                      highlightedIndex
                    })
                  }
                </Paper> : null}
            </div>
        )}
   } />)
}

export default SearchAttribute;
