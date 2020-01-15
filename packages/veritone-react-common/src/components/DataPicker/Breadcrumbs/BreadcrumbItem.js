import React from 'react';
import { string, bool, func, node, number } from 'prop-types';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

const BreadcrumbItem = ({ name, id, index, icon, onClick, isHidden = false }) => {
  const classes = useStyles();
  return (
    isHidden ? (
      <MenuItem
        onClick={onClick}
        data-id={id}
        data-index={index}
      >
        {name}
      </MenuItem>
    ) : (
        <Button
          onClick={onClick}
          data-id={id}
          data-index={index}
          className={classes['crumbItem']}
        >
          {icon}
          <span className={cx({
            [classes['iconSpacer']]: icon && name
          })}>
            {name}
          </span>
        </Button>
      )
  )
}

BreadcrumbItem.propTypes = {
  id: string.isRequired,
  index: number,
  name: string,
  isHidden: bool,
  icon: node,
  onClick: func,
};

export default BreadcrumbItem;
