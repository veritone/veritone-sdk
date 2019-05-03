import React from 'react';
import classNames from 'classnames';
import { MenuItem } from '@material-ui/core';

import styles from './BreadcrumbItem.scss';

import breadcrumbItem from './breadcrumbItemShape';

const BreadcrumbItem = ({ label, id, index, onClick, isHidden = false }) => (
  isHidden ? (
    <MenuItem
      onClick={onClick}
      data-id={id}
      data-index={index}
    >
      <span
        data-id={id}
        data-index={index}
        className={classNames('icon-empty-folder', styles['font-icon'])}
      />
      {label}
    </MenuItem>
  ) : (
      <span
        onClick={onClick}
        className={styles['crumb-item']}
        data-id={id}
        data-index={index}
      >
        {label}
      </span>
    )
)

BreadcrumbItem.propTypes = breadcrumbItem;

export default BreadcrumbItem;
