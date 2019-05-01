import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { number, select, text, boolean, object } from '@storybook/addon-knobs';

import FilePicker from './';
import FileProgressDialog from './FileProgressDialog';

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

const complete = boolean('complete');
const completeStatus = select('completeStatus', {
  success: 'success',
  failure: 'failure',
  warning: 'warning'
});

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
  .add('All formats', () => (
    <FilePicker
      accept={allFormats}
      onPickFiles={action('upload files')}
      onRequestClose={action('close modal')}
    />
  )).add('File Progress Dialog', () => (
    <FileProgressDialog
      percentByFiles={object('percentByFiles', [{
        key: 'audio_file.flac',
        value: {
          type: 'audio/flac',
          percent: 10
        }
      }, {
        key: 'video_file.mp4',
        value: {
          type: 'video/mp4',
          percent: 20
        }
      }, {
        key: 'image_file.png',
        value: {
          type: 'image/gif',
          percent: 80
        }
      }, {
        key: 'text_file.png',
        value: {
          type: 'application',
          percent: 90
        }
      }])}
      percentComplete={number('percentComplete', 20, {
        range: true,
        min: 0,
        max: 100,
        step: 1
      })}
      progressMessage={text('progressMessage', 'retrieving signed URLs')}
      completeStatus={complete ? completeStatus : null}
    />
  ));
