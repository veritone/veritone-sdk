import React from 'react';
import { number, string } from 'prop-types';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './styles.scss';

@withMuiThemeProvider
export default class ProgressDialog extends React.Component {
  static propTypes = {
    percentComplete: number,
    progressMessage: string,
    height: number,
    width: number
  };

  static defaultProps = {
    percentComplete: 0,
    progressMessage: '',
    height: 400,
    width: 600
  };

  render() {
    return (
      <Paper
        classes={{ root: styles.container }}
        style={{ height: this.props.height, width: this.props.width }}
      >
        <div className={styles.progressPercentageContainer}>
          <div className={styles.percentage}>{this.props.percentComplete}%</div>
          <CircularProgress
            className={styles.progress}
            size={125}
            thickness={1}
          />
        </div>
        <p className={styles.progressMessage}>{this.props.progressMessage}</p>
      </Paper>
    );
  }
}
