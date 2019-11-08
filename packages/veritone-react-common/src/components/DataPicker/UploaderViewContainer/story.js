import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import UploaderViewContainer from './';

const allFormats = [
  'application/json',
  'application/msword',
  'application/pdf',
  'application/rtf',
  'application/smil+xml',
  'application/ttml+xml',
  'application/vnd.ms-outlook',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/x-flv',
  'application/xml',
  'application/x-www-form-urlencoded',
  'audio/aac',
  'audio/flac',
  'audio/midi',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/webm',
  'image/gif',
  'image/jpeg',
  'image/tiff',
  'message/rfc822',
  'text/csv',
  'text/html',
  'text/plain',
  'text/plain; charset=utf-8',
  'video/3gpp',
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/quicktime',
  'video/webm',
  'video/x-m4v',
  'video/x-ms-wmv',
  'video/x-msvideo'
];

const percentByFiles = [{
  key: 'audio_file.flac',
  value: {
    type: 'audio/flac',
    percent: 10,
    size: 82356235
  }
}, {
  key: 'video_file.mp4',
  value: {
    type: 'video/mp4',
    percent: 20,
    size: 23856925352
  }
}, {
  key: 'image_file.png',
  value: {
    type: 'image/gif',
    percent: 80,
    size: 38529
  }
}, {
  key: 'text_file.txt',
  value: {
    type: 'application/text',
    percent: 90,
    size: 569182
  }
}, {
  key: 'error_file.bin',
  value: {
    type: 'application/json',
    percent: 69,
    size: 56283756,
    error: 'failed'
  }
}];


storiesOf('DataPicker', module)
  .add('UploaderViewContainer: Selecting', () => (
    <UploaderViewContainer
      accept={allFormats}
      uploadPickerState={'selecting'}
      uploadedFiles={[]}
      onFilesSelected={action('onFilesSelected')}
      handleAbort={action('handleAbort')}
      onReject={action('onReject')}
      onCancel={action('onCancel')}
      onDeleteFile={action('onDelete')}
      onUpload={action('onUpload')}
      multiple
      percentByFiles={percentByFiles}
    />
  ))
  .add('UploaderViewContainer: Uploading', () => (
    <UploaderViewContainer
      accept={allFormats}
      uploadPickerState={'uploading'}
      uploadedFiles={[]}
      onFilesSelected={action('onFilesSelected')}
      handleAbort={action('handleAbort')}
      onReject={action('onReject')}
      onCancel={action('onCancel')}
      onDeleteFile={action('onDelete')}
      onUpload={action('onUpload')}
      multiple
      percentByFiles={percentByFiles}
    />
  ))
  .add('UploaderViewContainer: Error State', () => (
    <UploaderViewContainer
      accept={allFormats}
      uploadPickerState={'complete'}
      uploadError
      uploadStatusMsg={'Some fake files failed'}
      onFilesSelected={action('onFilesSelected')}
      handleAbort={action('handleAbort')}
      onReject={action('onReject')}
      onCancel={action('onCancel')}
      onDeleteFile={action('onDelete')}
      onUpload={action('onUpload')}
      multiple
      percentByFiles={percentByFiles}
    />
  ))

  export {
    allFormats,
    percentByFiles
  };