import React from 'react';
import { func } from 'prop-types';
import Button from '@material-ui/core/Button';

import styles from './styles.scss';

export default class AppSwitcherErrorState extends React.Component {
  static propTypes = {
    onRefresh: func
  };

  render() {
    return (
      <div className={styles.appListButtonErrorState}>
        An error occurred loading this content
        <Button variant="contained" onClick={this.props.onRefresh}>
          retry
        </Button>
      </div>
    );
  }
}
