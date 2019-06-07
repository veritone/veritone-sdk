import React from 'react';
import { string, bool, func, node, number } from 'prop-types';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import styles from './styles.scss';

const BreadcrumbItem = ({ name, id, index, icon, onClick, isHidden = false }) => (
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
        className={styles['crumb-item']}
      >
        {icon}
        <span className={cx({
          [styles['icon-spacer']]: icon && name
        })}>
          {name}
        </span>
      </Button>
    )
)

BreadcrumbItem.propTypes = {
  id: string.isRequired,
  index: number,
  name: string,
  isHidden: bool,
  icon: node,
  onClick: func,
};

export default BreadcrumbItem;
