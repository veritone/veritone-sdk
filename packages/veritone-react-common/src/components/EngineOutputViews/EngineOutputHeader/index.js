import React, { Component } from 'react';
import { string, bool, arrayOf, node, oneOfType } from 'prop-types';

import styles from './styles.scss';

class EngineOutputHeader extends Component {
  static propTypes = {
    title: string,
    hideTitle: bool,
    children: oneOfType([
      arrayOf(node),
      node
    ])
  };

  render() {
    let { children, title, hideTitle } = this.props;
    return (
      <div className={styles.engineOutputHeader}>
        { !hideTitle && <div className={styles.headerTitle}>{title}</div> }
        <div className={styles.headerActions}>
          {children}
        </div>
      </div>
    )
  };
}

export default EngineOutputHeader;