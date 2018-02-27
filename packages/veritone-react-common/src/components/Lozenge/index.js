import React from 'react';

import { camelCase } from 'lodash';
import { string } from 'prop-types';

import {
  orange,
  pink,
  blue,
  teal,
  deepPurple,
  indigo
} from 'material-ui/colors';

import styles from './styles.scss';

const categoryColorMap = {
  objectDetection: blue['A100'],
  fingerprint: teal[500],
  geolocation: indigo[500],
  translate: orange[500],
  human: pink[500],
  textRecognition: orange[500],
  logoRecognition: blue['A100'],
  transcription: pink[500],
  facialDetection: teal[500],
  audioDetection: deepPurple[500],
  musicDetection: deepPurple[500] 
};

const Lozenge = ({ type, icon = '' }) => {
  return (
    <div
      className={styles.lozenge}
      style={{ backgroundColor: categoryColorMap[camelCase(type)] || pink[500] }}
    >
      <i className={icon} />
      {type}
    </div>
  );
};

Lozenge.propTypes = {
  type: string.isRequired
};

export default Lozenge;
