import React from 'react';
import { string } from 'prop-types';
import { blue } from 'material-ui/colors';

import styles from './styles.scss';

const Lozenge = ({ children, iconClassName, backgroundColor, textColor }) => {
  return (
    <div
      className={styles.lozenge}
      style={{
        backgroundColor: backgroundColor || blue[500],
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
