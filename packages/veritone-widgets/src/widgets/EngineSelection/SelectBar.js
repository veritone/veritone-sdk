import React from 'react';
import { string, node } from 'prop-types';

import LibCheckbox from 'material-ui/Checkbox';

import styles from './styles.scss';

export default class SelectBar extends React.Component {
  static propTypes = {
  };

  onCheck() {
    console.log('test')
  }

  render() {
    // const { } = this.props;
    return (
      <div className={styles.selectBar}>
        <LibCheckbox onCheck={this.onCheck} />
        Select All (721)
      </div>
    );
  }
}