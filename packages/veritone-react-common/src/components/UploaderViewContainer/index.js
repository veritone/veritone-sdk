import React from 'react';
import { arrayOf, string, func, shape, bool, number } from 'prop-types';

import FileUploader from '../FilePicker/FileUploader';
import FileProgressList from '../FilePicker/FileProgressList';
import FilePickerFooter from '../FilePicker/FilePickerFooter';
import DragDropContext from '../FilePicker/DragDropContext';

import styles from './styles.scss';

const DragDropFileUploader = DragDropContext(FileUploader);

const UploadViewContainer = ({
  accept,
  onSelect,
  onReject,
  percentageUploadingFiles,
  onCancel,
  onUpload,
  onDeleteFile,
  multiple
  containerStyle
}) => (
    <div className={styles['uploader-container']} style={containerStyle}>
      <div className={styles['uploader-content']}>
        <div className={styles['uploader-upload-area']}>
          <DragDropFileUploader
            acceptedFileTypes={accept}
            onFilesSelected={onSelect}
            multiple={multiple}
            onFilesRejected={onReject}
          />
        </div>
        {
          percentageUploadingFiles.length > 0 && (
            <div className={styles['uploader-file-list']}>
              <FileProgressList
                percentByFiles={percentageUploadingFiles}
                handleAbort={onDeleteFile}
              />
            </div>
          )
        }
      </div>
      <FilePickerFooter
        title="Upload"
        onCancel={onCancel}
        disabled={percentageUploadingFiles.length > 0 &&
          percentageUploadingFiles
          .some(percent => percent.value.percent > 0)}
        onSubmit={onUpload}
      />
    </div>
  )

UploadViewContainer.propTypes = {
  accept: arrayOf(string),
  onSelect: func.isRequired,
  onUpload: func.isRequired,
  onCancel: func,
  onDeleteFile: func,
  onReject: func,
  multiple: bool,
  containerStyle: shape({
    heigh: number,
    width: number
  }),
  percentageUploadingFiles: arrayOf(shape({
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
  multiple: true
}

export default UploadViewContainer;
