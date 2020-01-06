import React from 'react';
import { func, bool, string } from 'prop-types';

import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';

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
    exclude: bool,
    disabled: bool
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
      <Chip
        classes={{
          root: cx(
            styles.searchPill,
            { [styles.searchPillWithoutDelete]: !this.props.onDelete },
            this.getBackgroundColor()
          ),
          label: cx({
            [styles.searchPillSelectedColor]: this.props.selected
          })
        }}
        icon={
          <Icon
            className={this.props.engineCategoryIcon}
            classes={{
              root: cx([
                styles.engineCategoryIcon,
                { [styles.searchPillSelectedColor]: this.props.selected }
              ])
            }}
          />
        }
        label={this.props.label}
        onDelete={this.props.onDelete}
        onClick={this.props.onClick}
        disabled={this.props.disabled || !this.props.onClick}
      />
    );
  }
}

export default SearchPill;
