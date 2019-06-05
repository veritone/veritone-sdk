import React from 'react';
import { arrayOf, string, func, shape, bool, number } from 'prop-types';

import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Info from '@material-ui/icons/Info';
import Warning from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';

import FileUploader from '../FilePicker/FileUploader';
import FileList from '../FilePicker/FileList';
import FilePickerHeader from '../FilePicker/FilePickerHeader';
import FileProgressList from '../FilePicker/FileProgressList';
import FilePickerFooter from '../FilePicker/FilePickerFooter';
import DragDropContext from '../FilePicker/DragDropContext';

import styles from './styles.scss';

const DragDropFileUploader = DragDropContext(FileUploader);

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
}) => {
  const completeStatus = {
    [uploadSuccess]: 'success',
    [uploadWarning]: 'warning',
    [uploadError]: 'failure'
  }[true];
  const icon = {
    success: ( <CheckCircle style={{ fill: green[500] }} /> ),
    failure: ( <Info style={{ color: '#F44336' }} /> ),
    warning: ( <Warning style={{ color: '#ffc107' }} /> )
  }[completeStatus];
  const uploadDisabled = (
      percentByFiles
      && percentByFiles.length > 0
      && percentByFiles.some(percent => percent.value.percent > 0)
    ) || (uploadedFiles && !uploadedFiles.length);

  return (
    <div className={styles['uploader-container']} style={containerStyle}>
      <div className={styles['uploader-content']}>
        {
          uploadPickerState === 'selecting'
          ? (
            <div className={styles['uploader-upload-area']}>
              <DragDropFileUploader
                acceptedFileTypes={accept}
                onFilesSelected={onFilesSelected}
                multiple={multiple}
                onFilesRejected={onReject}
              />
              { uploadedFiles && !!uploadedFiles.length && (
                <FileList
                  files={uploadedFiles}
                  onRemoveFile={onRemoveFile}
                />
              )}
            </div>
          ) : (
            <div className={styles['uploader-file-list']}>
              <div>
                <FilePickerHeader
                  title={completeStatus ? `Upload ${completeStatus}` : 'Uploading'}
                  titleIcon={icon}
                  message={uploadStatusMsg}
                  hideTabs />
                <div className={styles['upload-progress-container']}>
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
                  <div className={styles['uploader-retry-button-container']}>
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
  }))
};

UploadViewContainer.defaultProps = {
  accept: [],
  multiple: true,
  containerStyle: {
    width: '100%',
    height: 475
  }
}

export default UploadViewContainer;
