import React from 'react';
import { string } from 'prop-types';
import indigo from '@material-ui/core/colors/indigo';

import styles from './styles.scss';

const Lozenge = ({ children, iconClassName, backgroundColor, textColor }) => {
  return (
    <div
      className={styles.lozenge}
      style={{
        backgroundColor: backgroundColor || indigo[500],
        color: textColor || '#fff'
      }}
    >
      {iconClassName && <i className={iconClassName} />}
      {children}
    </div>
  );
};

Lozenge.propTypes = {
  children: string.isRequired,
  iconClassName: string,
  backgroundColor: string,
  textColor: string
};

export default Lozenge;
