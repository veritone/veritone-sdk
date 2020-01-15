import React from 'react';
import {
  string,
  number,
  arrayOf,
  shape,
  bool,
  func,
  any
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
import { withStyles } from '@material-ui/styles';

import { formatBytes } from '../../../helpers/format.js';

import styles from './styles';

class FileProgressList extends React.Component {
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
    handleAbort: func,
    classes: shape({ any }),
  };

  getFileMediaIcon = file => {
    const type = get(file, 'value.type');
    const { classes } = this.props;
    const icons = {
      audio: (<AudioIcon className={classes.fileIcon} data-test-target="audio" />),
      video: (<VideoIcon className={classes.fileIcon} data-test-target="video" />),
      image: (<ImageIcon className={classes.fileIcon} data-test-target="image" />),
      text: (<TextIcon className={classes.fileIcon} data-test-target="text" />)
    };
    const iconKeys = Object.keys(icons);
    for (let index in iconKeys) {
      const key = iconKeys[index];
      if (type && type.includes(key)) {
        return (
          <div className={cx(classes.fileIconContainer, classes[key])}>
            {icons[key]}
          </div>
        );
      }
    }
    return (
      <div className={cx(classes.fileIconContainer, classes.text)}>
        {icons.text}
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
      handleAbort,
      classes
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
              className={classes.fileProgressItem}
              data-test-target={file.key}>
              <LinearProgress
                className={classes.fileProgressBar}
                classes={{
                  barColorPrimary: get(file, 'value.error')
                    ? classes.fileProgressBarError
                    : classes.fileProgressBarPrimary
                }}
                variant="determinate"
                value={
                  showErrors ? 0 : file.value.percent
                } />
              <div className={classes.fileProgressItemOverlay}>
                {this.getFileMediaIcon(file)}
                <span className={classes.fileName}>{file.value.name || file.key}</span>
                <div className={classes.sizeContainer}>
                  <span className={classes.fileSize}>{formatBytes(file.value.size)}</span>
                </div>
                {handleAbort && file.value.percent != 100 && (
                  <div className={classes.abortContainer}>
                    <IconButton onClick={this.handleAbortFile(file.key)}>
                      <AbortIcon />
                    </IconButton>
                  </div>
                )}
              </div>
              {!showErrors && file.value.percent != 100 && (
                <div className={classes.progressTextOverlay} style={{ marginLeft: `${file.value.percent}%` }}>
                  <span className={classes.progressText}>{file.value.percent}%</span>
                </div>
              )}
            </div>
          ))
        }
      </div>
    );
  };
}

export default withStyles(styles)(FileProgressList);
