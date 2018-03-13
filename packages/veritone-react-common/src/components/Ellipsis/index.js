import React from 'react';
import { string, number } from 'prop-types';
import Truncate from 'react-dotdotdot';

const Ellipsis = ({ text, lines = 3 }) => (
  <Truncate clamp={lines}>{text}</Truncate>
);

Ellipsis.propTypes = {
  text: string.isRequired,
  lines: number.isRequired
};

export default Ellipsis;
