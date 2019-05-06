import React from 'react';
import classNames from 'classnames';
import { MenuItem } from '@material-ui/core';

import styles from './BreadcrumbItem.scss';

import breadcrumbItem from './breadcrumbItemShape';

const BreadcrumbItem = ({ label, id, index, icon, onClick, isHidden = false }) => (
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
      {label}
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
          {label}
        </span>
      </span>
    )
)

BreadcrumbItem.propTypes = breadcrumbItem;

export default BreadcrumbItem;
