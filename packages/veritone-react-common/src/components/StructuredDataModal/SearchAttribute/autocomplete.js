import React from 'react';
import { shape, any, func, bool, array, oneOfType, arrayOf, node, string } from 'prop-types';
import Downshift from 'downshift';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { ListItem, ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

@withStyles(styles)
export default class StringValuePicker extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Downshift
        onSelect={this.props.onSelect}
        itemToString={item => (item ? item.value : '')}
        isOpen={this.props.open}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          highlightedIndex,
          selectedItem
        }) => (
            <div className={classes.autocompleteContainer}>
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
                      key={item}
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

StringValuePicker.propTypes = {
  classes: shape({ any }),
  onSelect: func,
  open: bool,
  onChange: func,
  value: any,
  onBlurAutocomplete: func,
  onFocusAutocomplete: func,
  loading: bool,
  items: array,
  loader: oneOfType([string, node, arrayOf(node)])
};
