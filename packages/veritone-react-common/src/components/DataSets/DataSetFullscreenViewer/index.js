import React from 'react';

import {
  string,
  bool,
  arrayOf,
  number,
  any
} from 'prop-types';

import { Field } from 'redux-form';

import { InputLabel } from 'material-ui/Input';
import {
  FormControl
} from 'material-ui/Form';
import {
  Checkbox,
} from 'components/formComponents';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';

import SDOTile from 'components/SDO/SDOTile';

import styles from './styles.scss';

export default class DataSetFullscreen extends React.Component {
  static propTypes = {

  };

  static defaultProps = {

  };

  state = {

  };

  render() {
    return (
      <div>
        Test
        
      </div>
    );
  }
}