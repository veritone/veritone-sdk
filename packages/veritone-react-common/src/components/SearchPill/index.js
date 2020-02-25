import React from 'react';
import { func, bool, string } from 'prop-types';

import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import { withStyles } from 'helpers/withStyles';
import cx from 'classnames';
import styles from './styles';

const classes = withStyles(styles);
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
    let backgroundColor = classes.searchPillBackgroundColor;
    let dataTest = 'searchPillBackgroundColor';
    if (this.props.selected) {
      backgroundColor = classes.searchPillSelectedBackgroundColor;
      dataTest = 'searchPillSelectedBackgroundColor';
    } else if (this.props.highlighted) {
      backgroundColor = classes.searchPillHighlightedBackgroundColor;
      dataTest = 'searchPillHighlightedBackgroundColor';
    } else if (this.props.exclude) {
      backgroundColor = classes.searchPillExcludeBackgroundColor;
      dataTest = 'searchPillExcludeBackgroundColor';
    }
    return {
      backgroundColor,
      dataTest
    };
  }

  render() {
    const { backgroundColor, dataTest } = this.getBackgroundColor();
    return (
      <Chip
        classes={{
          root: cx(
            classes.searchPill,
            { [classes.searchPillWithoutDelete]: !this.props.onDelete },
            backgroundColor
          ),
          label: cx({
            [classes.searchPillSelectedColor]: this.props.selected
          })
        }}
        icon={
          <Icon
            className={this.props.engineCategoryIcon}
            classes={{
              root: cx([
                classes.engineCategoryIcon,
                { [classes.searchPillSelectedColor]: this.props.selected }
              ])
            }}
          />
        }
        label={this.props.label}
        onDelete={this.props.onDelete}
        onClick={this.props.onClick}
        disabled={this.props.disabled || !this.props.onClick}
        data-test={dataTest}
      />
    );
  }
}

export default SearchPill;
