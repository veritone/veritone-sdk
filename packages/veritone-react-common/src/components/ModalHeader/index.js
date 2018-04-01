import React from 'react';

import {
  arrayOf, 
  string,
  func,
  element,
  node
} from 'prop-types';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import styles from './styles.scss';

//TODO: icons should pass in the icon elements, so the onClick is included already
export default class ModalHeader extends React.Component {
  static propTypes = {
    children: node,
    title: string,
    icons: arrayOf(element), // supports help, menu, trash, exit
    helpCallback: func,
    menuCallback: func,
    trashCallback: func,
    exitCallback: func
  };
  static defaultProps = {
    icons: []
  };

  state = {
    help: false,
    menu: false,
    trash: false,
    separator: false,
    exit: true,
    // icons: []
  };

  render() {
    return (
      <div className={styles['modal-header']}>
        <div className={styles.fullScreenTopBar}>
            <span className={styles.topBarTitle}>
              {this.props.title}
            </span>
            <div className={styles.iconGroup}>
              {this.props.icons}
            </div>
        </div>
        <div>
          {this.props.children}
        </div>        
      </div>
    );
  };
}