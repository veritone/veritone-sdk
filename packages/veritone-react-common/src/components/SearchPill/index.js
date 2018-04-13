import React from 'react';
import { func, objectOf, any, bool, string } from 'prop-types';

import Chip from 'material-ui/Chip';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';

import { withTheme } from 'material-ui/styles';
import { withStyles } from 'material-ui/styles';
import { emphasize, fade } from 'material-ui/styles/colorManipulator';

import styles from './styles.scss';

const SearchPill = ({
  engineCategoryIcon,
  onClick,
  onDelete,
  label,
  highlighted,
  selected,
  exclude,
  theme
}) => {
  let engineCategoryIconColor = styles['engineCategoryIconColor'];
  let textColor = selected
    ? styles['selectedColor']
    : theme.palette.text.primary;

  let dynamicStyles = theme => {
    let chipColor = theme.palette.background.default;
    let hoverColor = styles['searchPillHoverColor'];

    if (selected && styles['selectedBackgroundColor']) {
      chipColor = styles['selectedBackgroundColor'];
      hoverColor = styles['selectedBackgroundColor'];
      engineCategoryIconColor = styles['selectedColor'];
    } else if (highlighted && styles['highlightedBackgroundColor']) {
      chipColor = styles['highlightedBackgroundColor'];
      hoverColor = fade(styles['highlightedBackgroundColor'], 0.5);
    } else if (exclude && styles['excludeBackgroundColor']) {
      chipColor = styles['excludeBackgroundColor'];
    } else {
      chipColor = styles['searchPillBackgroundColor'];
    }

    return {
      root: {
        color: theme.palette.getContrastText(chipColor),
        backgroundColor: chipColor
      },
      avatar: {
        color:
          engineCategoryIconColor || theme.palette.getContrastText(chipColor),
        marginLeft: theme.spacing.unit * 0.5
      },
      clickable: {
        cursor: 'pointer',
        '&:hover, &:focus': {
          backgroundColor: hoverColor || emphasize(chipColor, 0.08)
        },
        '&:active': {
          backgroundColor: hoverColor || emphasize(chipColor, 0.12)
        }
      },
      deletable: {
        '&:focus': {
          backgroundColor: emphasize(chipColor, 0.08)
        }
      },
      deleteIcon: {
        paddingLeft: theme.spacing.unit * 0.5,
        visibility: highlighted && !selected ? 'hidden' : 'visible',
        '&:hover': {
          color: selected ? fade(theme.palette.text.primary, 0.26) : undefined
        }
      }
    };
  };

  const ChipFactory = ({ classes, ...props }) => (
    <Chip classes={classes} {...props} />
  );
  ChipFactory.propTypes = {
    classes: objectOf(any)
  };

  let StyledChip = withStyles(dynamicStyles)(ChipFactory);

  return (
    <StyledChip
      avatar={
        <Icon>
          <div className={engineCategoryIcon} />
        </Icon>
      }
      label={
        <Typography style={{ color: textColor }} variant="subheading">
          {label}
        </Typography>
      }
      onClick={onClick}
      onDelete={onDelete}
    />
  );
};

SearchPill.propTypes = {
  engineCategoryIcon: string.isRequired,
  onClick: func,
  onDelete: func,
  label: string.isRequired,
  highlighted: bool,
  selected: bool,
  exclude: bool,
  theme: objectOf(any)
};

export default withTheme()(SearchPill);
