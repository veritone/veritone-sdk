import React from 'react';
import { func } from 'prop-types';
import classNames from 'classnames';

import styles from './BreadcrumbElipsis.scss';


const BreadcrumbElipsis = ({ onClick }) => (
  <span className={classNames(
    'icon-more_vert',
    styles['icon-rotate'],
    styles['icon-spread']
  )}
    onClick={onClick}
  />
);

BreadcrumbElipsis.propTypes = {
  onClick: func
}

export default BreadcrumbElipsis;
