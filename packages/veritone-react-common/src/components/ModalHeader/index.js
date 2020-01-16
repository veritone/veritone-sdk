import React from 'react';
import { withStyles } from '@material-ui/styles';
import { arrayOf, string, element, node, shape, any } from 'prop-types';

import styles from './styles';

class ModalHeader extends React.Component {
  static propTypes = {
    children: node,
    title: string,
    icons: arrayOf(element),
    classes: shape({ any })
  };

  static defaultProps = {
    icons: []
  };

  render() {
    const { classes } = this.props;
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

export default withStyles(styles)(ModalHeader);
