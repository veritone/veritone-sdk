import React from 'react';
import { string } from 'prop-types';
import Lozenge from 'components/Lozenge';

import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import { withStyles } from 'helpers/withStyles';

import styles from './styles';
const classes = withStyles(styles);
const white = '#FFFFFF';
const stateStyles = {
  active: {
    backgroundColor: green['A700'],
    color: white
  },
  inactive: {
    backgroundColor: grey[500],
    color: white
  },
  paused: {
    backgroundColor: white,
    border: `1px solid ${blueGrey[500]}`,
    color: blueGrey[500]
  },
  processing: {
    backgroundColor: blue[500],
    color: white
  }
};

class StatusPill extends React.Component {
  static propTypes = {
    status: string
  };

  static defaultProps = {
    status: 'processing'
  };

  render() {
    const pillStyles = stateStyles[this.props.status || 'processing'];

    return (
      <Lozenge
        backgroundColor={pillStyles.backgroundColor}
        textColor={pillStyles.color}
        border={pillStyles.border}
        className={classes.statusPill}
        data-test="statusPill"
      >
        <span className={classes.statusPillText} data-test="statusPillText">{this.props.status}</span>
      </Lozenge>
    );
  }
}

export default StatusPill;
