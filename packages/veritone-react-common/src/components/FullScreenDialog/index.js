import React from 'react';
import cx from 'classnames';
import { node, bool } from 'prop-types';

import styles from './styles.scss';

export default class FullScreenDialog extends React.Component {
  static propTypes = {
    children: node,
    open: bool
  };
  static defaultProps = {};

  render() {
    const containerClasses = cx(
      styles['dialog'],
      this.props.open && styles['dialog--is-open']
    );

    return <div className={containerClasses}>{this.props.children}</div>;
  }
}
