import React from 'react';
import cx from 'classnames';
import { node, bool, string, shape, any } from 'prop-types';
import { withStyles } from '@material-ui/styles';

import styles from './styles';

class FullScreenDialog extends React.Component {
  static propTypes = {
    children: node,
    open: bool,
    className: string,
    classes: shape({ any }),
  };
  static defaultProps = {};

  render() {
    const { classes } = this.props;
    const containerClasses = cx(
      classes['dialog'],
      this.props.open && classes['dialogIsOpen'],
      this.props.className
    );

    return <div className={containerClasses}>{this.props.children}</div>;
  }
}

export default withStyles(styles)(FullScreenDialog);
