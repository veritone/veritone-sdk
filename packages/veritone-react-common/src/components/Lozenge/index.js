import React from 'react';

import { string } from 'prop-types';

import {
  orange
} from 'material-ui/colors';

import styles from './styles.scss';


const engineClasses = {
  // text: {
  //   icon: 'transcription',
  //   color: orange[600],
  // },
  // vision: {
  //   icon: 'transcription',
  //   color: orange[600],
  // },
  // biometrics: {
  //   icon: 'transcription',
  //   color: orange[600],
  // },
  // speech: {
  //   icon: 'transcription',
  //   color: orange[600],
  // },
  // audio: {
  //   icon: 'transcription',
  //   color: orange[600],
  // },
  // data: {
  //   icon: 'transcription',
  //   color: orange[600],
  // },
  transcription: {
    icon: 'transcription',
    color: orange[600],
  },
}


const Lozenge = ({ type }) => {
  const { icon, color } = engineClasses[type];

  return (
    <div
      className={styles.lozenge}
      style={{ backgroundColor: color }}
    >
      <i className={`icon-${icon}`} />
      {type}
    </div>
  );
};

Lozenge.propTypes = {
  type: string.isRequired
};

export default Lozenge;
