import React from 'react';
import { func } from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import styles from './styles.scss';

export default class AppSwitcherErrorState extends React.Component {
  static propTypes = {
    handleRefresh: func
  };

  render() {
    return (
      <div className={styles.appListButtonErrorState}>
        An error occurred loading this content
        <RaisedButton label="retry" onClick={this.props.handleRefresh}/>
      </div>
    );
  }
}
