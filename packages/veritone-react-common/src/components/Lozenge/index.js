import React from 'react';
import { string, node } from 'prop-types';
import indigo from '@material-ui/core/colors/indigo';
import { makeStyles } from '@material-ui/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

const Lozenge = ({
  children,
  iconClassName,
  backgroundColor,
  textColor,
  border,
  className,
  ...props
}) => {
  const classes = useStyles();
  return (
    <div
      className={className || classes.lozenge}
      style={{
        backgroundColor: backgroundColor || indigo[500],
        color: textColor || '#fff',
        border: border || 'none'
      }}
      {...props}
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
