import React from 'react';
import { func, number, bool, string } from 'prop-types';

import Checkbox from 'material-ui/Checkbox';

import SearchBar from './SearchBar';

import styles from './styles.scss';

export default class SelectBar extends React.Component {
  static propTypes = {
    onCheckAll: func.isRequired,
    searchQuery: string,
    onSearch: func.isRequired,
    onClearSearch: func.isRequired,
    isChecked: bool.isRequired,
    hideActions: bool.isRequired,
    isSearchOpen: bool.isRequired,
    onToggleSearch: func.isRequired,
    count: number.isRequired
  };

  render() {
    return (
      <div className={styles.selectBar}>
        <Checkbox
          color="primary"
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
            hideActions={this.props.hideActions}
          />
        </div>
      </div>
    );
  }
}
