import React from 'react';
import { string, bool, func, node, number } from 'prop-types';
import classNames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';

import styles from './BreadcrumbItem.scss';

const BreadcrumbItem = ({ name, id, index, icon, onClick, isHidden = false }) => (
  isHidden ? (
    <MenuItem
      onClick={onClick}
      data-id={id}
      data-index={index}
      className={styles['crumb-item']}
    >
      <span
        className={classNames('icon-empty-folder', styles['font-icon'])}
      />
      {name}
    </MenuItem>
  ) : (
      <span
        onClick={onClick}
        data-id={id}
        data-index={index}
        className={styles['crumb-item']}
      >
        {icon}
        <span>
          {name}
        </span>
      </span>
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
