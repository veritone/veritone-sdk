import React from 'react';
import { string } from 'prop-types';

const Icon = ({ iconClass, color, size }) => (
  <span
    className={iconClass}
    style={{
      padding: '0.25em',
      color,
      display: 'block',
      fontSize: size,
    }}
  />
);
Icon.propTypes = {
  iconClass: string,
  color: string,
  size: string,
};

export default Icon;
