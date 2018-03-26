import React from 'react';

import {
  any, 
  arrayOf, 
  objectOf,
  func
} from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import ModalHeader from 'components/ModalHeader';
import styles from './styles.scss';

@withMuiThemeProvider
export default class SourceConfiguration extends React.Component {
  static propTypes = {
    name: string,

  };
  static defaultProps = {};

  state = {

  };

  render() {
    return (
      <div>
        <div className={styles.name}>{this.props.name}</div>
      </div>
    );
  };
}