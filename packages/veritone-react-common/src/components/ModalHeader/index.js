import React from 'react';
import { withStyles } from 'helpers/withStyles';
import { arrayOf, string, element, node } from 'prop-types';

import styles from './styles';
const classes = withStyles(styles);
class ModalHeader extends React.Component {
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
      <div className={classes.modalHeader}>
        <div className={classes.fullScreenTopBar}>
          <span className={classes.topBarTitle}>{this.props.title}</span>
          <div className={classes.iconGroup}>{this.props.icons}</div>
        </div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

export default ModalHeader;
