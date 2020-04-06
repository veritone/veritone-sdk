import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select, object, boolean } from '@storybook/addon-knobs';

import FileProgressDialog from './FileProgressDialog';
import FileProgressList from './FileProgressList';
import FilePicker from './';

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
    error: true
  }
}];

storiesOf('FilePicker', module)
  .add('Base', () => (
    <FilePicker
      onPickFiles={action('upload files')}
      onRequestClose={action('close modal')}
    />
  ))
  .add('With Options', () => (
    <FilePicker
      accept={['image/svg+xml', '.png', '.jpg']}
      height={800}
      width={800}
      onPickFiles={action('upload files')}
      onRequestClose={action('close modal')}
    />
  ))
  .add('With Multiple', () => (
    <FilePicker
      accept={['image/svg+xml', '.png', '.jpg']}
      height={800}
      width={800}
      multiple
      maxFiles={2}
      onPickFiles={action('upload files')}
      onRequestClose={action('close modal')}
    />
  ))
  .add('Flat on a page', () => (
    <FilePicker
      accept={['image/svg+xml', '.png', '.jpg']}
      height={800}
      width={800}
      onPickFiles={action('upload files')}
      multiple
      allowUrlUpload={false}
    />
  ))
  .add('Flat on a page with max file limit', () => (
    <FilePicker
      accept={['image/svg+xml', '.png', '.jpg']}
      height={800}
      width={800}
      onPickFiles={action('upload files')}
      multiple
      maxFiles={5}
      allowUrlUpload={false}
    />
  ))
  .add('Flat with scrollbars', () => (
    <div style={{ height: '500px', width: '600px' }}>
      <FilePicker
        accept={['image/svg+xml', '.png', '.jpg']}
        height={'100%'}
        multiple
        onPickFiles={action('upload files')}
        allowUrlUpload={false}
      />
    </div>
  ))
  .add('All formats', () => (
    <FilePicker
      accept={allFormats}
      onPickFiles={action('upload files')}
      onRequestClose={action('close modal')}
      multiple
    />
  )).add('File Progress Dialog', () => (
    <FileProgressDialog
      percentByFiles={object('percentByFiles', percentByFiles)}
      progressMessage={`We couldn't upload these files.`}
      completeStatus={select('completeStatus', {
        success: 'success',
        failure: 'failure',
        warning: 'warning'
      })}
      height={450}
      width={600}
      retryRequest={action('Retry Request')}
      onRetryDone={action('Retry Done')}
      handleAbort={action('Handle abort')}
      onClose={action('On Close')}
    />
  )).add('File Progress List', () => (
    <FileProgressList
      percentByFiles={object('percentByFiles', percentByFiles)}
      handleAbort={action('Handle abort')}
      showErrors={boolean('Show Errors', false)}
    />
  ));
