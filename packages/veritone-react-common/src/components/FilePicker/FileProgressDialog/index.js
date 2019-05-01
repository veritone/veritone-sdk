import React from 'react';
import { number, string, oneOf, arrayOf, shape } from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { get } from 'lodash';
import cx from 'classnames';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircle from '@material-ui/icons/CheckCircle';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import Warning from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';

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
        percent: number
      }).isRequired
    })),
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
          percentByFiles.map(file => (
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
            root: styles.resolutionIcon
          }}
          style={{
            fill: green[500]
          }}
          data-testtarget="successIcon"
        />
      ),

      failure: (
        <RemoveCircle
          classes={{
            root: styles.resolutionIcon
          }}
          style={{
            fill: red[500]
          }}
          data-testtarget="failureIcon"
        />
      ),

      warning: (
        <Warning
          classes={{
            root: styles.resolutionIcon
          }}
          style={{
            fill: yellow[500]
          }}
          data-testtarget="warnIcon"
        />
      )
    }[this.props.completeStatus];

    return (
      <div className={styles.textContainer}>
        <div className={styles.resolutionIconContainer}>{icon}</div>
      </div>
     );
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
    let wasCategorized = false;
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
    const transparentBg = this.props.completeStatus ? {
      backgroundColor: 'transparent',
      boxShadow: 'none'
    } : {};
    return (
      <Paper
        classes={{ root: styles.container }}
        style={{ height: this.props.height, width: this.props.width, ...transparentBg }}
      >
        <div>
          {this.props.completeStatus
            ? this.renderComplete()
            : this.renderProgress()}
          <div className={styles.progressMessage}>
            {this.props.progressMessage}
          </div>
        </div>
      </Paper>
    );
  }
}
