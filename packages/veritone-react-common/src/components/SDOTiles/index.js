import React from 'react';

import {
  string,
  bool,
  arrayOf,
} from 'prop-types';

import {
  Checkbox
} from 'components/formComponents';

import SDOTile from './SDOTile';

import styles from './styles.scss';

export default class SDOTiles extends React.Component {
  static propTypes = {

  };

  static defaultProps = {

  };

  state = {
    checkedAll: false
  }

  render() {
    return (
      <div>
        SDO Tiles View
        <SDOTile/>
      </div>
    );
  }

}