import React from 'react';
import { func } from 'prop-types';

import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import LibCheckbox from 'material-ui/Checkbox';
import SortIcon from 'material-ui-icons/SortByAlpha';

import SearchBar from './SearchBar';

import styles from './styles.scss';

export default class SelectBar extends React.Component {
  static propTypes = {
    onCheck: func.isRequired,
    onSearch: func.isRequired
  };

  state = {
    sortMenuOpen: false,
    sortMenuAnchorEl: null
  };

  openSortMenu = event => {
    this.setState({
      sortMenuOpen: true,
      sortMenuAnchorEl: event.currentTarget
    })
  }

  closeSortMenu = () => {
    this.setState({
      sortMenuOpen: false
    })
  }

  render() {
    const sortMenuItems = [{
      label: 'Alphabetical',
      handler: () => console.log('clicked Alphabetical filter...')
    }, {
      label: 'Highest Price',
      handler: () => console.log('clicked Highest price filter...')
    }, {
      label: 'Lowest Price',
      handler: () => console.log('clicked Lowest price filter...')
    }, {
      label: 'Category',
      handler: () => console.log('clicked Category filter...')
    }, {
      label: 'Best Rating',
      handler: () => console.log('clicked Best Rating filter...')
    }, {
      label: 'Newest',
      handler: () => console.log('clicked Newest filter...')
    }]

    return (
      <div className={styles.selectBar}>
        <LibCheckbox onChange={this.props.onCheck} />
        Select All (721)

        <div className={styles.selectBarIcons}>
          <SearchBar onSearch={this.props.onSearch} onClear={this.props.onClearSearch} />
          <IconButton
            onClick={this.openSortMenu}
            key="button"
            className="sortMenuButton"
          >
            <SortIcon />
          </IconButton>
          <Menu
            key="menu"
            open={this.state.sortMenuOpen}
            onRequestClose={this.closeSortMenu}
            anchorEl={this.state.sortMenuAnchorEl}
            getContentAnchorEl={null}
          >
            {sortMenuItems.map(({ label, handler }) => (
              <MenuItem button key={label} onClick={handler}>
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    );
  }
}
