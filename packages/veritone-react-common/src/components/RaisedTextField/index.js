import React from 'react';
import Paper from 'material-ui/Paper';

import PropTypes from 'helpers/PropTypes';
const { func, element, string } = PropTypes;

import styles from './styles.scss';
console.log(styles);

const RaisedTextField = ({ label, value, iconRight, onClickIcon }) => {
  return <Paper>test</Paper>;
};

RaisedTextField.propTypes = {
  label: string,
  value: string,
  iconRight: element,
  onClickIcon: func
};

export default RaisedTextField;
