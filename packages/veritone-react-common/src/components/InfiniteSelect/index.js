import React from 'react';
import { arrayOf, object, node, shape, any } from 'prop-types';

import Downshift from 'downshift';

import Select from '@material-ui/core/Select';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Check from '@material-ui/icons/Check';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';

import DropDownButton from './DropDownButton';

import cx from 'classnames';
import styles from './styles';

import { get } from 'lodash';

import Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';

@withStyles(styles)
export default class InfiniteSelect extends React.Component {
  state = {
    // currently selected dropdown item
    autocompleteValue: !this.props.defaultSelected && get(this.props.selected, 'name') || '',
    open: false,
    highlightedIndex: 0,
    classes: shape({ any }),
  };

  onClick = () => {
    if (!this.state.oepn) {
      this.open();
    }
  };

  componentDidUpdate(prevProps) {
    if (
      !this.props.selected && prevProps.selected
    ) {
      this.setState({
        autocompleteValue: ''
      });
    }

    if (this.props.defaultSelected && !prevProps.defaultSelected) {
      this.props.resetSelect();
      this.props.onSelect({ name: 'All Schemas' });
    } else if (
      this.props.selected && !this.props.defaultSelected && get(this.props.selected, 'name') !== get(prevProps.selected, 'name')
    ) {
      this.setState({
        autocompleteValue: get(this.props.selected, 'name')
      });
    }
  }

  open = () => {
    if (
      this.state.autocompleteValue &&
      this.state.autocompleteValue !== get(this.props.selected, 'name')
    ) {
      this.setState(
        {
          open: true,
          highlightedIndex: this.props.data.indexOf(this.props.selected) || 0
        },
        () => this.props.loadMoreData(this.state.autocompleteValue)
      );
    } else {
      this.setState(
        {
          open: true,
          highlightedIndex: this.props.data.indexOf(this.props.selected) || 0
        },
        () => this.props.loadMoreData('')
      );
    }
  };

  handleAutocompleteChange = e => {
    this.stop$ = Rx.Observable.fromEvent(e.target, 'focusout');
    this.stop$.take(1).subscribe();

    Rx.Observable.fromEvent(e.target, 'keyup')
      .map(x => x.target.value)
      .distinctUntilChanged()
      .debounceTime(500)
      .last(debouncedText => this.props.loadMoreData(debouncedText))
      .takeUntil(this.stop$)
      .subscribe();

    this.props.resetSelect();
    this.setState(
      {
        autocompleteValue: e.target.value,
        highlightedIndex: 0
      },
      () => {
        if (this.props.handleAutocompleteChange) {
          this.props.handleAutocompleteChange(e.target.value);
        }
      }
    );
  };

  onChange = row => {
    this.props.onSelect(row);

    this.setState({
      open: false,
      highlightedIndex: this.props.data.indexOf(row),
      autocompleteValue: row.name
    });
  };

  onKeyDown = e => {
    if (!this.state.open && e.keyCode === 40) {
      this.open();
    }
    e.target.focus();

    // change the selected item on enter
    if (e.keyCode === 13) {
      this.onChange(this.props.data[this.state.highlightedIndex]);
    } else if (e.keyCode === 27) {
      // close the dropdown on esc
      this.close();
    } else if (e.keyCode === 38) {
      // highlight the previous item if possible
      e.preventDefault();
      if (this.state.highlightedIndex > 0) {
        this.setState(prevState => ({
          highlightedIndex: prevState.highlightedIndex - 1
        }));
      }
    } else if (e.keyCode === 40) {
      // highlight the next item if possible, otherwise try to infinitely load
      e.preventDefault();
      if (this.state.highlightedIndex < this.props.data.length - 1) {
        this.setState(prevState => ({
          highlightedIndex: prevState.highlightedIndex + 1
        }));
      }
    }
  };

  onSelect = item => e => {
    this.onChange(item);
  }

  infiniteScroll = e => {
    if (
      !this.props.done && this._scrollContainer &&
      this._scrollContainer.scrollTop >=
      this._scrollContainer.scrollHeight -
      (250 + this._scrollContainer.clientHeight)
    ) {
      let searchValue =
        this.props.selected &&
          this.props.selected.name === this.state.autocompleteValue
          ? ''
          : this.state.autocompleteValue;
      this.props.loadMoreData(searchValue);
    }
  }

  onScroll = e => {
    Rx.Observable.fromEvent(e.target, 'scroll').debounceTime(50).subscribe(this.infiniteScroll);
  };

  setScrollContainer = ref => {
    this._scrollContainer = ref;
  };

  renderValue = value => {
    return value.name;
  };

  close = evt => {
    if (evt) {
      evt.stopPropagation();
    }

    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.pickerContainer} key={this.props.key}>
        <Downshift
          onSelect={this.props.onChange}
          isOpen={this.state.open}
          highlightedIndex={this.state.highlightedIndex}
          selectedItem={this.props.selected}
          itemToString={books => (books ? books.name : '')}
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
              <div>
                <TextField
                  fullWidth
                  inputProps={{
                    name: this.props.name || 'super_select',
                    id: this.props.name || 'super_select'
                  }}
                  InputProps={{
                    endAdornment: (
                      <DropDownButton open={isOpen} close={this.close} />
                    ),
                    onBlur: this.close,
                    onFocus: this.open
                  }}
                  placeholder={
                    this.props.defaultSelected
                      ? get(this.props.selected, 'name')
                      : this.props.placeholder
                  }
                  onChange={this.handleAutocompleteChange}
                  value={this.state.autocompleteValue}
                  onKeyDown={this.onKeyDown}
                  onClick={this.onClick}
                />
                {isOpen ? (
                  <Paper>
                    <div
                      ref={this.setScrollContainer}
                      style={{ maxHeight: '400px', overflowY: 'auto' }}
                      onScroll={this.onScroll}
                    >
                      {this.props.data &&
                        this.props.data.length === 0 &&
                        this.props.done && (
                          <ListItem>{this.props.noChoices}</ListItem>
                        )}
                      {this.props.data.map((item, index) => {
                        return (
                          <ListItem
                            className={classes.hover}
                            style={{
                              backgroundColor:
                                highlightedIndex === index ||
                                  (selectedItem &&
                                    selectedItem.name === item.name)
                                  ? '#eeeeee'
                                  : null,
                              borderBottom:
                                index === 0 && this.props.selected
                                  ? '1px dashed #cccccc'
                                  : null
                            }}
                            {...getItemProps({ index, item, onMouseDown: this.onSelect(item) })}
                            key={`${item.name}_${index}`}
                          >
                            {this.props.defaultSelected || selectedItem ? (
                              <Check
                                color="primary"
                                classes={{
                                  root: cx({
                                    [classes['hidden']]:
                                      !selectedItem ||
                                      (selectedItem &&
                                        selectedItem.name !== item.name)
                                  })
                                }}
                              />
                            ) : null}
                            {this.props.display(item)}
                          </ListItem>
                        );
                      })}
                      {this.props.loading ? (
                        <ListItem>{this.props.loader}</ListItem>
                      ) : null}
                    </div>
                  </Paper>
                ) : null}
              </div>
            )}
        </Downshift>
      </div>
    );
  }
}

InfiniteSelect.propTypes = {
  loader: node,
  selected: object
};

InfiniteSelect.defaultProps = {
  type: 'input'
};
