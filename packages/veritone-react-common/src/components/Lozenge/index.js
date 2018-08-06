import React from 'react';
import { string, node } from 'prop-types';
import indigo from '@material-ui/core/colors/indigo';

import styles from './styles.scss';

const Lozenge = ({
  children,
  iconClassName,
  backgroundColor,
  textColor,
  border,
  className
}) => {
  return (
    <div
      className={className || styles.lozenge}
      style={{
        backgroundColor: backgroundColor || indigo[500],
        color: textColor || '#fff',
        border: border || 'none'
      }}
    >
      {iconClassName && <i className={iconClassName} />}
      {children}
    </div>
  );
};

Lozenge.propTypes = {
  children: node.isRequired,
  iconClassName: string,
  backgroundColor: string,
  textColor: string,
  border: string,
  className: string
};

export default Lozenge;
