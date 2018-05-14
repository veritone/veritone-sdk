import React from 'react';
import { func, bool, string } from 'prop-types';

import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import { Cancel } from 'material-ui-icons';

import cx from 'classnames';
import styles from './styles.scss';

class SearchPill extends React.PureComponent {
  static propTypes = {
    engineCategoryIcon: string.isRequired,
    onClick: func,
    onDelete: func,
    label: string.isRequired,
    highlighted: bool,
    selected: bool,
    exclude: bool
  };

  handleDelete = e => {
    e.stopPropagation();
    this.props.onDelete(e);
  };

  getBackgroundColor() {
    let backgroundColor = styles.searchPillBackgroundColor;
    if (this.props.selected) {
      backgroundColor = styles.searchPillSelectedBackgroundColor;
    } else if (this.props.highlighted) {
      backgroundColor = styles.searchPillHighlightedBackgroundColor;
    } else if (this.props.exclude) {
      backgroundColor = styles.searchPillExcludeBackgroundColor;
    }
    return backgroundColor;
  }

  render() {
    return (
      <div
        className={cx([styles.searchPill, this.getBackgroundColor()])}
        onClick={this.props.onClick}
      >
        <Avatar
          className={cx(this.props.engineCategoryIcon)}
          classes={{
            root: cx([
              styles.engineCategoryIcon,
              { [styles.searchPillSelectedColor]: this.props.selected }
            ])
          }}
        />
        <Typography
          variant="subheading"
          className={cx({
            [styles.searchPillSelectedColor]: this.props.selected
          })}
        >
          {this.props.label}
        </Typography>
        <div data-attribute="deletePill" onClick={this.handleDelete}>
          <Cancel
            style={{
              visibility:
                this.props.highlighted && !this.props.selected ? 'hidden' : null
            }}
            disabled={this.props.selected}
            className={styles.deleteIcon}
          />
        </div>
      </div>
    );
  }
}

export default SearchPill;
