import React from 'react';

import Downshift from 'downshift';

import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { List, ListItem, ListItemText } from '@material-ui/core';

import styles from '../styles.scss';

export default class StringValuePicker extends React.Component {
  render() {
    return (
      <Downshift
        onSelect={this.props.onSelect}
        itemToString={item => (item ? item.value : '')}
        isOpen={this.props.open}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem
        }) => (
          <div className={styles.autocomplete_container}>
            <TextField
              fullWidth
              autoFocus
              margin={'none'}
              {...getInputProps({
                onChange: this.props.onChange,
                value: this.props.value,
                onBlur: this.props.onBlurAutocomplete,
                onFocus: this.props.onFocusAutocomplete
              })}
            />
            <Paper style={{
                maxHeight: '300px',
                overflow: 'auto',
              }}>
              {isOpen &&
                this.props.items && (
                  <ListItem style={{ borderBottom: this.props.items && this.props.items.length > 0 ? '1px dashed #ccc' : null }}>
                    <ListItemText
                      secondary={
                        this.props.items && this.props.items.length === 0
                          ? 'No Suggestions'
                          : 'Suggestions'
                      }
                    />
                  </ListItem>
                )}
              {isOpen && this.props.loading ? (
                <ListItem>{this.props.loader}</ListItem>
              ) : null}
              {isOpen && !this.props.loading && this.props.items
                ? this.props.items.map((item, index) => (
                    <ListItem
                      {...getItemProps({
                        key: item,
                        index,
                        item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? '#eeeeee' : null,
                          fontWeight: selectedItem === item ? 'bold' : 'normal'
                        }
                      })}
                    >
                      <ListItemText primary={item} />
                    </ListItem>
                  ))
                : null}
            </Paper>
          </div>
        )}
      </Downshift>
    );
  }
}
