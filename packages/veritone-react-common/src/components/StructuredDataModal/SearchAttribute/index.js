import React from 'react';

import Downshift from 'downshift';

import { LinearProgress } from 'material-ui/Progress';
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
  if(results && results.length === 0) {
    return (
      <ListItem dense {...getItemProps( { item: null })} key="no_results">
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
    result.sections.push(
      <div key={sectionIndex}>
        <ListItem dense>
          <ListItemText
            style={{ fontSize: "75%"}}
            primary={ `${section.schema || 'Unknown Schema'} ${versions[`${section.author}|${section.schema}`] > 1 ? (`v${section.version}`) : ''}`}
            secondary={ `by ${section.author || 'Unknown Author'}` }
          />
        </ListItem>
        {section.attributes.map((field, fieldIndex) => {
          const index = result.itemIndex++;
          return (
            <ListItem dense style={{ backgroundColor: highlightedIndex === index ? '#eeeeee' : null }} {...getItemProps({item: field, index})} key={`"${field.field}"`}>
              <ListItemText
                style={{ paddingLeft: "1em" }}
                primary={ `${ field.displayName || field.field }`}
              />
            </ListItem>
          )
        })}
      </div>
    )

    return result;
  }, { sections: [], itemIndex: 0}).sections
}

const SearchAttribute = ( { onSelect, loading, selectedItem, isOpen, onOpen, onBlur, onChange, onFocusAutocomplete, data } ) => {
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
                  value: selectedItem,
                  placeholder: 'Search by attribute',
                  id: 'integration-downshift'
                }))}
              { loading ? <LinearProgress style={ {height: "0.1em" }} /> : null }
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
        )}
   } />)
}

export default SearchAttribute;
