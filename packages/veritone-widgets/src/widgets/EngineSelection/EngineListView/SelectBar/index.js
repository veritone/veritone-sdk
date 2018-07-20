import React from 'react';
import { func, number, bool, string, arrayOf, shape } from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import SearchBar from './SearchBar';

import styles from './styles.scss';

export default class SelectBar extends React.Component {
  static propTypes = {
    id: string.isRequired,
    currentTabIndex: number.isRequired,
    onCheckAll: func.isRequired,
    searchQuery: string,
    onSearch: func.isRequired,
    onClearSearch: func.isRequired,
    isChecked: bool.isRequired,
    isSearchOpen: bool.isRequired,
    onToggleSearch: func.isRequired,
    actionMenuItems: arrayOf(
      shape({
        buttonText: string,
        iconClass: string,
        onClick: func.isRequired
      })
    ),
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
            key={
              this.props.id +
              this.props.isSearchOpen +
              this.props.currentTabIndex
            }
            id={this.props.id}
            onSearch={this.props.onSearch}
            onClearSearch={this.props.onClearSearch}
            onToggleSearch={this.props.onToggleSearch}
            searchQuery={this.props.searchQuery}
            isOpen={this.props.isSearchOpen}
          />
          {this.props.actionMenuItems && (
            <div className={styles.actionMenuDividerContainer}>
              <div className={styles.actionMenuDivider} />
            </div>
          )}
          {this.props.actionMenuItems &&
            this.props.actionMenuItems.map(
              ({ buttonText, iconClass, onClick }) =>
                buttonText ? (
                  <Button
                    key={`${buttonText}-${iconClass}`}
                    onClick={onClick}
                    color="primary"
                  >
                    {buttonText}
                  </Button>
                ) : (
                  <IconButton
                    key={`${buttonText}-${iconClass}`}
                    onClick={onClick}
                  >
                    <i className={iconClass} />
                  </IconButton>
                )
            )}
        </div>
      </div>
    );
  }
}
