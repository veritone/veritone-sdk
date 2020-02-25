import React from 'react';
import { func } from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from 'helpers/withStyles';

import styles from './styles';

const classes = withStyles(styles);
class AppSwitcherErrorState extends React.Component {
  static propTypes = {
    onRefresh: func
  };

  render() {
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

export default AppSwitcherErrorState;
