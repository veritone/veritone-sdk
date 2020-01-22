import React from 'react';
import { func, number, bool, string, arrayOf, shape, any } from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/styles';

import SearchBar from './SearchBar';

import styles from './styles';

class SelectBar extends React.Component {
  static propTypes = {
    id: string.isRequired,
    currentTab: string.isRequired,
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
    count: number.isRequired,
    classes: shape({ any }),
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.selectBar}>
        <Checkbox
          color="primary"
          checked={!!this.props.isChecked}
          onChange={this.props.onCheckAll}
          disabled={!this.props.count}
        />
        <div>Select All ({this.props.count})</div>

        <div className={classes.selectBarIcons}>
          <SearchBar
            key={
              this.props.id + this.props.isSearchOpen + this.props.currentTab
            }
            id={this.props.id}
            onSearch={this.props.onSearch}
            onClearSearch={this.props.onClearSearch}
            onToggleSearch={this.props.onToggleSearch}
            searchQuery={this.props.searchQuery}
            isOpen={this.props.isSearchOpen}
          />
          {this.props.actionMenuItems && (
            <div className={classes.actionMenuDividerContainer}>
              <div className={classes.actionMenuDivider} />
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

export default withStyles(styles)(SelectBar);
