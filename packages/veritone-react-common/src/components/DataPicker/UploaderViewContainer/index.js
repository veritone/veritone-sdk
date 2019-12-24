import React from 'react';
import { arrayOf, string, func, shape, bool, number, object, oneOfType } from 'prop-types';

import HTML from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Info from '@material-ui/icons/Info';
import Warning from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';
import { makeStyles } from '@material-ui/styles';

import FileUploader from '../../FilePicker/FileUploader';
import FileList from '../../FilePicker/FileList';
import FilePickerHeader from '../../FilePicker/FilePickerHeader';
import FileProgressList from '../../FilePicker/FileProgressList';
import FilePickerFooter from '../../FilePicker/FilePickerFooter';

import styles from './styles';

const useStyles = makeStyles(styles);

const UploadViewContainer = ({
  accept,
  onFilesSelected,
  onReject,
  uploadPickerState,
  uploadStatusMsg,
  uploadSuccess,
  uploadWarning,
  uploadError,
  uploadedFiles,
  percentByFiles,
  onCancel,
  onUpload,
  handleAbort,
  onRetryDone,
  retryRequest,
  onDeleteFile,
  multiple,
  containerStyle,
  onRemoveFile,
  isFullScreen
}) => {
  const classes = useStyles();
  const completeStatus = {
    [uploadSuccess]: 'success',
    [uploadWarning]: 'warning',
    [uploadError]: 'failure'
  }[true];
  const icon = {
    success: (<CheckCircle style={{ fill: green[500] }} />),
    failure: (<Info style={{ color: '#F44336' }} />),
    warning: (<Warning style={{ color: '#ffc107' }} />)
  }[completeStatus];
  const uploadDisabled = (
    percentByFiles
    && percentByFiles.length > 0
    && percentByFiles.some(percent => percent.value.percent > 0)
  ) || (uploadedFiles && !uploadedFiles.length);

  return (
    <div className={classes['uploaderContainer']} style={containerStyle}>
      <div className={classes['uploaderContent']}>
        {
          uploadPickerState === 'selecting'
            ? (
              <div className={classes['uploaderUploadArea']}>
                <DndProvider backend={HTML}>
                  <FileUploader
                    acceptedFileTypes={accept}
                    onFilesSelected={onFilesSelected}
                    multiple={multiple}
                    onFilesRejected={onReject}
                  />
                </DndProvider>
                {uploadedFiles && !!uploadedFiles.length && (
                  <FileList
                    files={uploadedFiles}
                    onRemoveFile={onRemoveFile}
                  />
                )}
              </div>
            ) : (
              <div className={classes['uploaderFileList']}>
                <div>
                  <FilePickerHeader
                    title={completeStatus ? `Upload ${completeStatus}` : 'Uploading'}
                    titleIcon={icon}
                    message={uploadStatusMsg}
                    hideTabs />
                  <div className={classes['uploadProgressContainer']}>
                    <FileProgressList
                      percentByFiles={percentByFiles}
                      handleAbort={handleAbort}
                      showErrors={completeStatus && completeStatus !== 'success'}
                    />
                  </div>
                </div>
                {
                  completeStatus && completeStatus !== 'success'
                  && percentByFiles && !!percentByFiles.length
                  && (
                    <div
                      className={classes['uploaderRetryButtonContainer']}
                      data-veritone-element="picker-retry-controls"
                    >
                      <Button
                        onClick={onRetryDone}>
                        Done
                    </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={retryRequest}>
                        Retry All
                    </Button>
                    </div>
                  )
                }
              </div>
            )
        }
      </div>
      <FilePickerFooter
        title="Upload"
        onCancel={onCancel}
        disabled={uploadDisabled}
        onSubmit={onUpload}
        hasIntercom={isFullScreen}
      />
    </div>
  );
}

UploadViewContainer.propTypes = {
  accept: arrayOf(string),
  onFilesSelected: func.isRequired,
  onUpload: func.isRequired,
  onCancel: func,
  onDeleteFile: func,
  onReject: func,
  multiple: bool,
  containerStyle: shape({
    heigh: number,
    width: number
  }),
  percentByFiles: arrayOf(shape({
    key: string,
    value: shape({
      type: string,
      percent: number,
      size: number,
      error: string
    })
  })),
  uploadPickerState: string,
  uploadStatusMsg: string,
  uploadSuccess: oneOfType([string, bool]),
  uploadError: oneOfType([string, bool]),
  uploadWarning: oneOfType([string, bool]),
  uploadedFiles: arrayOf(object),
  handleAbort: func,
  onRetryDone: func,
  retryRequest: func,
  onRemoveFile: func,
  isFullScreen: bool
};

UploadViewContainer.defaultProps = {
  accept: [],
  multiple: true
}

export default UploadViewContainer;
