import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import CheckIcon from '@material-ui/icons/Done';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import { objectOf, any, func, arrayOf, string, bool, number, shape, oneOfType } from 'prop-types';
import { get, noop, isArray, isFunction } from 'lodash';

import styles from './styles.scss';

export default class InfiniteDropdownMenu extends React.Component {
  static propTypes = {
    value: oneOfType([
      oneOfType([string, number]),
      arrayOf(string),
      arrayOf(number)
    ]),
    label: string,
    secondaryNameKey: string,
    handleSelectionChange: func.isRequired,
    loadNextPage: func,
    hasNextPage: bool,
    isNextPageLoading: bool,
    multiple: bool,   // Don't use this... it's not completely flushed out
    items: arrayOf(
      shape({
        id: oneOfType([string, number]),
        name: string
      })
    ),
    customTriggers: arrayOf(
      shape({
        label: string.isRequired,
        trigger: func.isRequired
      })
    ),
    pageSize: number,
    readOnly: bool
  };

  static defaultProps = {
    pageSize: 30
  };

  state = {
    anchorEl: null
  };

  UNSAFE_componentWillMount() {
    if (isFunction(this.props.loadNextPage)) {
      this.props.loadNextPage({ startIndex: 0, stopIndex: this.props.pageSize });
    }
  }

  handleMenuClick = event => {
    if (!this.props.readOnly) {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  isRowLoaded = ({ index }) => get(this.props.items, index);

  rowRenderer = ({ index, key, style }) => {
    let item;
    if (!this.isRowLoaded({ index })) {
      item = {
        name: 'Loading...'
      };
    } else {
      item = this.props.items[index];
    }

    const secondaryNameDisplay = get(item, this.props.secondaryNameKey);

    const handleItemClick = item => () => {
      this.props.handleSelectionChange(item);
      this.handleMenuClose();
    };

    const isSelected = this.props.multiple ?
      (isArray(this.props.value)
        && this.props.value.some(val => val === item.id)
      ) : item.id === this.props.value

    return (
      <div
        key={key}
        style={style}
      >
        <MenuItem
          key={item.id}
          value={item.id}
          selected={isSelected}
          onClick={handleItemClick(item)}
        >
          {isSelected ? (
            <span className={styles.menuIconSpacer}>
              <CheckIcon />
            </span>
          ) : (
            <span className={styles.menuIconSpacer} />
          )}
          <span className={styles.menuItemName}>{item.name}</span>
          {secondaryNameDisplay ? (
            <span className={styles.secondaryNameDisplay}>
              {secondaryNameDisplay}
            </span>
          ) : null }
        </MenuItem>
      </div>
    );
  };

  openCustomTrigger = trigger => () => {
    this.setState({ anchorEl: null }, trigger);
  }

  // To suppress InfiniteLoader warnings
  dummyLoadNextPage = ({startIndex, stopIndex}) => {
    return Promise.resolve([]);
  }

  render() {
    const list = this.props.items || [];
    const rowCount = this.props.hasNextPage
      ? list.length + this.props.pageSize
      : list.length;
    const loadMoreRows = this.props.isNextPageLoading
      ? noop
      : (this.props.loadNextPage || this.dummyLoadNextPage);

    return (
      <ItemSelector
        initialValue={this.props.value}
        multiple={this.props.multiple}
        items={list}
        handleSelectionChange={this.props.handleSelectionChange}
        handleMenuClose={this.handleMenuClose}
        handleMenuClick={this.handleMenuClick}
        selectLabel={this.props.label}
        anchorEl={this.state.anchorEl}
        rowCount={rowCount}
        loadMoreRows={loadMoreRows}
        isRowLoaded={this.isRowLoaded}
        rowRenderer={this.rowRenderer}
        openCustomTrigger={this.openCustomTrigger}
        customTriggers={this.props.customTriggers}
      />
    );
  }
}

const ItemSelector = ({
  initialValue,
  multiple,
  items,
  handleSelectionChange,
  selectLabel,
  handleMenuClick,
  handleMenuClose,
  anchorEl,
  rowCount,
  loadMoreRows,
  isRowLoaded,
  rowRenderer,
  readOnly,
  openCustomTrigger,
  customTriggers
}) => {
  const menuId = 'long-menu';
  const dummyItem = 'dummy-item';
  const selectedValue = multiple ?
    items.filter(item => initialValue.find(id => item.id)) :
    items.find(item => item.id === initialValue);

  return (
    <FormControl>
      <InputLabel htmlFor="select-item" className={styles.itemLabel}>
        {selectLabel}
      </InputLabel>
      <Select
        className={styles.itemSelector}
        value={initialValue || dummyItem}
        onClick={handleMenuClick}
        aria-label="Select Source"
        aria-owns={anchorEl ? menuId : null}
        aria-haspopup="true"
        readOnly
        inputProps={{
          name: 'item',
          id: 'select-item'
        }}
      >
        <MenuItem key={dummyItem} value={initialValue || dummyItem}>
          {
            multiple ?
              selectedValue.map(option => option.name).join(', ') :
              (selectedValue ? selectedValue.name : '---')
          }
        </MenuItem>
      </Select>
      <Menu
        id={menuId}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorEl={anchorEl}
        PaperProps={{
          style: {
            maxHeight: 400,
            minWidth: 400,
            overflow: 'hidden',
            width: 'auto'
          }
        }}
      >
        <div key="scroll-container" className={styles.itemScrollContainer}>
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRows}
            rowCount={rowCount}
            threshold={3}
          >
            {({ onRowsRendered, registerChild }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    width={width}
                    height={144}
                    rowCount={rowCount}
                    rowHeight={48}
                    ref={registerChild}
                    onRowsRendered={onRowsRendered}
                    rowRenderer={rowRenderer}
                  />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        </div>
        <div>
        {
          isArray(customTriggers) ?
          customTriggers.map((customTrigger, index) => {
            const customKey = customTrigger.label.split(' ').join('');
            return (
              <MenuItem
                className={styles.customTriggerItem}
                key={'custom-trigger-' + customKey}
                value={null}
                onClick={openCustomTrigger(customTrigger.trigger)}
              >
                {customTrigger.label}
              </MenuItem>
            );
          }) : null
        }
        </div>
      </Menu>
    </FormControl>
  );
};

ItemSelector.propTypes = {
  initialValue: oneOfType([
    oneOfType([string, number]),
    arrayOf(string),
    arrayOf(number)
  ]),
  items: arrayOf(
    shape({
      id: oneOfType([number, string]),
      name: string
    })
  ).isRequired,
  handleSelectionChange: func.isRequired,
  selectLabel: string,
  handleMenuClick: func,
  handleMenuClose: func,
  anchorEl: objectOf(any),
  rowCount: number,
  loadMoreRows: func,
  isRowLoaded: func,
  rowRenderer: func,
  customTriggers: arrayOf(shape({
    label: string.isRequired,
    trigger: func.isRequired
  })),
  openCustomTrigger: func,
  multiple: bool,
  readOnly: bool
};
