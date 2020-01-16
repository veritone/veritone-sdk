import React from 'react';
import { func, shape, any } from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';

import styles from './styles';

class AppSwitcherErrorState extends React.Component {
  static propTypes = {
    onRefresh: func,
    classes: shape({any}),
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.appListButtonErrorState}>
        An error occurred loading this content
        <Button variant="contained" onClick={this.props.onRefresh}>
          retry
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(AppSwitcherErrorState);
