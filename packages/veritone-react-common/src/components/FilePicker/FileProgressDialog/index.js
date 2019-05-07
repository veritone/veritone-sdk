import React from 'react';
import { number, string, oneOf, arrayOf, shape, any, func } from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { get } from 'lodash';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Info from '@material-ui/icons/Info';
import Warning from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';

import AudioIcon from '@material-ui/icons/PlayCircleOutline';
import VideoIcon from '@material-ui/icons/LocalMovies';
import ImageIcon from '@material-ui/icons/Photo';
import TextIcon from '@material-ui/icons/ShortText';

import { formatBytes } from '../../../helpers/format.js';

import FilePickerHeader from '../FilePickerHeader';
import FileProgressList from '../FileProgressList';

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
    onClose: func.isRequired,
    onRetryDone: func.isRequired,
    retryRequest: func.isRequired,
    handleAbort: func,
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

  handleAbortAll = () => {
    const { handleAbort } = this.props;
    handleAbort && handleAbort();
  }

  handleClose = () => {
    const { onClose } = this.props;
    this.handleAbortAll();
    onClose && onClose();
  }

  renderProgress() {
    const {
      percentByFiles,
      handleAbort
    } = this.props;
    const closeFunc = handleAbort ? this.handleClose : null;

    return (
      <div>
        <FilePickerHeader 
          title="Uploading"
          hideTabs
          onClose={closeFunc} />
        <div className={styles.progressListContainer}>
          <FileProgressList
            percentByFiles={percentByFiles}
            handleAbort={handleAbort} />
        </div>
      </div>
    );
  }

  renderComplete() {
    const icon = {
      success: (
        <CheckCircle classes={{ root: styles.resolveIcon }}
          style={{ fill: green[500] }}
          data-testtarget="successIcon"
        />
      ),
      failure: (
        <Info classes={{ root: styles.resolveIcon }}
          style={{ color: '#F44336' }}
          data-testtarget="failureIcon"
        />
      ),
      warning: (
        <Warning classes={{ root: styles.resolveIcon }}
          style={{ color: '#ffc107' }}
          data-testtarget="warnIcon"
        />
      )
    }[this.props.completeStatus];

    const {
      percentByFiles,
      onClose
    } = this.props;

    const completeDialog = this.props.completeStatus !== 'success' ? (
      <div className={styles.contentFlexer}>
        <FilePickerHeader 
          title={`Upload ${this.props.completeStatus}`}
          message={this.props.progressMessage}
          titleIcon={icon}
          hideTabs
          onClose={onClose} />
        <div className={styles.contentFlexer}>
          <div className={styles.progressListContainer}>
            <FileProgressList percentByFiles={percentByFiles} showErrors />
          </div>
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
        </div>
      </div>
    ) : null;

    return completeDialog
  }

  render() {
    return (
      <Card
        className={styles.container}
        style={{ width: this.props.width }}>
        {this.props.completeStatus
          ? this.renderComplete() : this.renderProgress()
        }
      </Card>
    );
  }
}
