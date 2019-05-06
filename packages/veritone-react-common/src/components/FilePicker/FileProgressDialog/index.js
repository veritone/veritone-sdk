import React from 'react';
import { number, string, oneOf, arrayOf, shape, any, func } from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { get } from 'lodash';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Info from '@material-ui/icons/Info';
import Warning from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import AudioIcon from '@material-ui/icons/PlayCircleOutline';
import VideoIcon from '@material-ui/icons/LocalMovies';
import ImageIcon from '@material-ui/icons/Photo';
import TextIcon from '@material-ui/icons/ShortText';

import { formatBytes } from '../../../helpers/format.js';

import styles from './styles.scss';

export default class FileProgressDialog extends React.Component {
  static propTypes = {
    percentByFiles: arrayOf(shape({
      key: string,
      value: shape({
        name: string,
        type: string,
        size: number,
        percent: number,
        error: any
      }).isRequired
    })),
    onRetryDone: func.isRequired,
    retryRequest: func.isRequired,
    height: number,
    width: number,
    progressMessage: string,
    completeStatus: oneOf(['success', 'failure', 'warning'])
  };

  static defaultProps = {
    percentByFiles: [],
    progressMessage: '',
    width: 600
  };

  renderProgress() {
    const {
      percentByFiles
    } = this.props;

    return (
      <div className={styles.fileProgressContainer}>
        {
          percentByFiles.filter(file => !get(file, 'value.error')).map(file => (
            <div key={file.key} className={styles.fileProgressItem}>
              <LinearProgress
                className={styles.fileProgressBar}
                classes={{
                  barColorPrimary: styles.fileProgressBarPrimary,
                  barColorSecondary: styles.fileProgressBarSecondary
                }}
                variant="determinate"
                value={file.value.percent} />
              <div className={styles.fileProgressItemOverlay}>
                { this.getFileMediaIcon(file) }
                <span className={styles.fileName}>{file.value.name || file.key}</span>
                <div className={styles.sizeContainer}>
                  <span className={styles.fileSize}>{formatBytes(file.value.size)}</span>
                </div>
              </div>
              <div className={styles.progressTextOverlay} style={{ marginLeft: `${file.value.percent}%` }}>
                <span className={styles.progressText}>{file.value.percent}%</span>
              </div>
            </div>
          ))
        }
      </div>
    );
  }

  renderComplete() {
    const icon = {
      success: (
        <CheckCircle
          classes={{
            root: styles.resolveIcon
          }}
          style={{
            fill: green[500]
          }}
          data-testtarget="successIcon"
        />
      ),

      failure: (
        <Info
          classes={{
            root: styles.resolveIcon
          }}
          style={{
            color: '#F44336'
          }}
          data-testtarget="failureIcon"
        />
      ),

      warning: (
        <Warning
          classes={{
            root: styles.resolveIcon
          }}
          style={{
            color: '#ffc107'
          }}
          data-testtarget="warnIcon"
        />
      )
    }[this.props.completeStatus];

    const {
      percentByFiles
    } = this.props;

    const completeDialog = this.props.completeStatus !== 'success' ? (
      <Card className={styles.resolveContainer}>
        <CardHeader
          className={styles.resolveHeader}
          avatar={icon}
          title={`Upload ${this.props.completeStatus}`} />
        <CardContent style={{ padding: 0 }}>
          <div className={styles.progressMessage}>
            {this.props.progressMessage}
          </div>
          {
            percentByFiles.filter(file => get(file, 'value.error')).map(file => (
              <div key={file.key} className={styles.fileProgressItem}>
                <LinearProgress
                  className={styles.fileProgressBar}
                  classes={{
                    barColorPrimary: styles.fileProgressBarPrimary,
                    barColorSecondary: styles.fileProgressBarSecondary
                  }}
                  variant="determinate"
                  value={0} />
                <div className={styles.fileProgressItemOverlay}>
                  { this.getFileMediaIcon(file) }
                  <span className={styles.fileName}>{file.value.name || file.key}</span>
                  <div className={styles.sizeContainer}>
                    <span className={styles.fileSize}>{formatBytes(file.value.size)}</span>
                  </div>
                </div>

              </div>
            ))
          }
        </CardContent>
        <CardActions className={styles.resolveActions}>
          <Button
            onClick={this.props.onRetryDone}>
            Done
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.props.retryRequest}>
            Retry All
          </Button>
        </CardActions>
      </Card>
    ) : null;

    return completeDialog
  }

  getFileMediaIcon = file => {
    const type = get(file, 'value.type');
    const icons = {
      audio: (<AudioIcon className={styles.fileIcon} />),
      video: (<VideoIcon className={styles.fileIcon} />),
      image: (<ImageIcon className={styles.fileIcon} />),
      text: (<TextIcon className={styles.fileIcon} />)
    };
    const iconKeys = Object.keys(icons);
    for (let index in iconKeys) {
      const key = iconKeys[index];
      if (type && type.includes(key)) {
        return (
          <div className={cx(styles.fileIconContainer, styles[key])}>
            { icons[key] }
          </div>
        );
      }
    }
    return (
      <div className={cx(styles.fileIconContainer, styles.text)}>
        { icons.text }
      </div>
    );
  }

  render() {
    return (
      <Paper
        classes={{ root: styles.container }}
        style={{ height: this.props.height, width: this.props.width }}
      >
        <div>
          {this.props.completeStatus
            ? this.renderComplete() : this.renderProgress()
          }
        </div>
      </Paper>
    );
  }
}
