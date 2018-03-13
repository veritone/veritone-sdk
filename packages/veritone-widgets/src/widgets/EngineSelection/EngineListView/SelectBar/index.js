import React from 'react';
import { func, number, bool, string } from 'prop-types';

// import IconButton from 'material-ui/IconButton';
// import Menu, { MenuItem } from 'material-ui/Menu';
// import { ListItemText } from 'material-ui/List';

import Checkbox from 'material-ui/Checkbox';
// import SortIcon from 'material-ui-icons/SortByAlpha';

import SearchBar from './SearchBar';

import styles from './styles.scss';

export default class SelectBar extends React.Component {
  static propTypes = {
    onCheckAll: func.isRequired,
    searchQuery: string,
    onSearch: func.isRequired,
    onClearSearch: func.isRequired,
    isChecked: bool.isRequired,
    isDisabled: bool.isRequired,
    isSearchOpen: bool.isRequired,
    onToggleSearch: func.isRequired,
    count: number.isRequired
  };

  // state = {
  //   sortMenuIsOpen: false,
  //   sortMenuAnchorEl: null
  // };

  // openSortMenu = event => {
  //   this.setState({
  //     sortMenuIsOpen: true,
  //     sortMenuAnchorEl: event.currentTarget
  //   });
  // };

  // closeSortMenu = () => {
  //   this.setState({
  //     sortMenuIsOpen: false
  //   });
  // };

  render() {
    // const sortMenuItems = [
    //   {
    //     label: 'Category',
    //     handler: () => console.log('clicked Category filter...')
    //   },
    //   {
    //     label: 'Newest',
    //     handler: () => console.log('clicked Newest filter...')
    //   }
    // ];

    return (
      <div className={styles.selectBar}>
        <Checkbox
          checked={!!this.props.isChecked}
          onChange={this.props.onCheckAll}
          disabled={!this.props.count}
        />
        <div>Select All ({this.props.count})</div>

        <div className={styles.selectBarIcons}>
          <SearchBar
            onSearch={this.props.onSearch}
            onClearSearch={this.props.onClearSearch}
            onToggleSearch={this.props.onToggleSearch}
            searchQuery={this.props.searchQuery}
            isOpen={this.props.isSearchOpen}
            isDisabled={this.props.isDisabled}
          />
          {/* <IconButton
            onClick={this.openSortMenu}
            key="button"
            className="sortMenuButton"
            disabled={this.props.isDisabled}
          >
            <SortIcon />
          </IconButton>
          <Menu
            key="menu"
            open={this.state.sortMenuIsOpen}
            onRequestClose={this.closeSortMenu}
            anchorEl={this.state.sortMenuAnchorEl}
          >
            {sortMenuItems.map(({ label, handler }) => (
              <MenuItem button key={label} onClick={handler}>
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Menu> */}
        </div>
      </div>
    );
  }
}
