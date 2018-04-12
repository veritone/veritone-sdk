import React from 'react';

import { arrayOf, string, element, node } from 'prop-types';

import styles from './styles.scss';

//TODO: icons should pass in the icon elements, so the onClick is included already
export default class ModalHeader extends React.Component {
  static propTypes = {
    children: node,
    title: string,
    icons: arrayOf(element)
  };

  static defaultProps = {
    icons: []
  };

  render() {
    return (
      <div className={styles['modal-header']}>
        <div className={styles.fullScreenTopBar}>
          <span className={styles.topBarTitle}>{this.props.title}</span>
          <div className={styles.iconGroup}>{this.props.icons}</div>
        </div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}
