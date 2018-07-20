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

import { objectOf, any, func, arrayOf, string, bool, number } from 'prop-types';
import { get, cloneDeep, noop } from 'lodash';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

@withMuiThemeProvider
export default class InfiniteDropdownMenu extends React.Component {
  static propTypes = {
    id: string,
    label: string,
    pageSize: number,
    handleSelectionChange: func.isRequired,
    loadNextPage: func.isRequired
  };

  static defaultProps = {
    pageSize: 30
  };

  state = {
    hasNextPage: false,
    isNextPageLoading: false,
    items: [],
    anchorEl: null
  }

  UNSAFE_componentWillMount() {
    this.loadMoreRows({ startIndex: 0, stopIndex: this.props.pageSize });
  }

  loadMoreRows = ({startIndex, stopIndex}) => {
    this.setState({ isNextPageLoading: true });
    return this.props.loadNextPage({startIndex, stopIndex}).then(nextPage => {
      const newState = {
        hasNextPage: !!get(nextPage, 'length'),
        isNextPageLoading: false,
        items: cloneDeep(this.state.items).concat(nextPage)
      }
      if (newState.items.length && !this.props.id) {
        this.props.handleSelectionChange(newState.items[0]);
      }
      this.setState(newState);
      return nextPage;
    });
  }

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  isRowLoaded = ({ index }) => get(this.state.items, index);

  rowRenderer = ({ index, key, style }) => {
    let item;
    if (!this.isRowLoaded({ index })) {
      item = {
        name: 'Loading...'
      };
    } else {
      item = this.state.items[index];
    }

    const handleItemClick = item => () => {
      this.props.handleSelectionChange(item);
      this.handleMenuClose();
    }

    return (
      <div
        key={key}
        style={style}
      >
        <MenuItem
          key={item.id}
          value={item.id}
          selected={item.id === this.props.id}
          onClick={handleItemClick(item)}
        >
          {item.id === this.props.id ? (
            <span className={styles.menuIconSpacer}>
              <CheckIcon />
            </span>
          ) : (
            <span className={styles.menuIconSpacer} />
          )}
          <span className={styles.menuItemName}>{item.name}</span>
        </MenuItem>
      </div>
    );
  };

  render() {
    const rowCount = this.state.hasNextPage
      ? this.state.items.length + this.props.pageSize
      : this.state.items.length;
    const loadMoreRows = this.state.isNextPageLoading
      ? noop
      : this.loadMoreRows;

    return (
      <ItemSelector
        initialValue={this.props.id}
        items={this.state.items}
        handleSelectionChange={this.props.handleSelectionChange}
        handleMenuClose={this.handleMenuClose}
        handleMenuClick={this.handleMenuClick}
        selectLabel={this.props.label}
        anchorEl={this.state.anchorEl}
        rowCount={rowCount}
        loadMoreRows={loadMoreRows}
        isRowLoaded={this.isRowLoaded}
        rowRenderer={this.rowRenderer}
      />
    );
  }
}

const ItemSelector = ({
  initialValue,
  items,
  handleSelectionChange,
  selectLabel,
  handleMenuClick,
  handleMenuClose,
  anchorEl,
  rowCount,
  loadMoreRows,
  isRowLoaded,
  rowRenderer
}) => {
  const menuId = 'long-menu';
  const dummyItem = 'dummy-item';
  const selectedItem = items.find(item => item.id === initialValue);

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
          {selectedItem ? selectedItem.name : '---'}
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
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={rowCount}
          children={({ onRowsRendered, registerChild }) => (
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
        />
      </Menu>
    </FormControl>
  );
};

ItemSelector.propTypes = {
  initialValue: string,
  items: arrayOf(objectOf(any)).isRequired,
  handleSelectionChange: func.isRequired,
  selectLabel: string,
  handleMenuClick: func,
  handleMenuClose: func,
  anchorEl: objectOf(any),
  rowCount: number,
  loadMoreRows: func,
  isRowLoaded: func,
  rowRenderer: func
};
