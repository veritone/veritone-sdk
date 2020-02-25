import React from 'react';
import cx from 'classnames';
import { node, bool, string } from 'prop-types';
import { withStyles } from 'helpers/withStyles';

import styles from './styles';

const classes = withStyles(styles);
class FullScreenDialog extends React.Component {
  static propTypes = {
    children: node,
    open: bool,
    className: string
  };
  static defaultProps = {};

  render() {
    const containerClasses = cx(
      classes['dialog'],
      this.props.open && classes['dialogIsOpen'],
      this.props.className
    );

    return <div className={containerClasses}>{this.props.children}</div>;
  }
}

export default FullScreenDialog;
