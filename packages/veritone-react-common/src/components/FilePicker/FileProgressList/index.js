import React from 'react';
import {
  string,
  number,
  arrayOf,
  shape,
  bool,
  func
} from 'prop-types';
import { get } from 'lodash';
import cx from 'classnames';

import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import AudioIcon from '@material-ui/icons/PlayCircleOutline';
import VideoIcon from '@material-ui/icons/LocalMovies';
import ImageIcon from '@material-ui/icons/Photo';
import TextIcon from '@material-ui/icons/ShortText';
import AbortIcon from '@material-ui/icons/Delete';

import { formatBytes } from '../../../helpers/format.js';

import styles from './styles.scss';

export default class FileProgressList extends React.Component {
  static propTypes = {
    percentByFiles: arrayOf(shape({
      key: string,
      value: shape({
        name: string,
        type: string,
        size: number,
        percent: number,
        error: string,
        aborted: string
      }).isRequired
    })).isRequired,
    showErrors: bool,
    handleAbort: func
  };

  getFileMediaIcon = file => {
    const type = get(file, 'value.type');
    const icons = {
      audio: (<AudioIcon className={styles.fileIcon} data-test-target="audio" />),
      video: (<VideoIcon className={styles.fileIcon} data-test-target="video" />),
      image: (<ImageIcon className={styles.fileIcon} data-test-target="image" />),
      text: (<TextIcon className={styles.fileIcon} data-test-target="text" />)
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
  };

  handleAbortFile = fileKey => () => {
    const { handleAbort } = this.props;
    handleAbort && handleAbort(fileKey);
  }

  render() {
    const {
      percentByFiles,
      showErrors,
      handleAbort
    } = this.props;

    const files = !showErrors
      ? percentByFiles
      : percentByFiles.filter(file => get(file, 'value.error') && !get(file, 'value.aborted'))

    return (
      <div>
        {
          files.map(file => (
            <div
              key={file.key}
              className={styles.fileProgressItem}
              data-test-target={file.key}>
              <LinearProgress
                className={styles.fileProgressBar}
                classes={{
                  barColorPrimary: get(file, 'value.error')
                    ? styles.fileProgressBarError
                    : styles.fileProgressBarPrimary
                }}
                variant="determinate"
                value={
                  showErrors ? 0 : file.value.percent
                } />
              <div className={styles.fileProgressItemOverlay}>
                { this.getFileMediaIcon(file) }
                <span className={styles.fileName}>{file.value.name || file.key}</span>
                <div className={styles.sizeContainer}>
                  <span className={styles.fileSize}>{formatBytes(file.value.size)}</span>
                </div>
                { handleAbort && file.value.percent != 100 && (
                  <div className={styles.abortContainer}>
                    <IconButton onClick={this.handleAbortFile(file.key)}>
                      <AbortIcon />
                    </IconButton>
                  </div>
                )}
              </div>
              {!showErrors && file.value.percent != 100 && (
                <div className={styles.progressTextOverlay} style={{ marginLeft: `${file.value.percent}%` }}>
                  <span className={styles.progressText}>{file.value.percent}%</span>
                </div>
              )}
            </div>
          ))
        }
      </div>
    );
  };
}
