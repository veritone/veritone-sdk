import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import DataPicker from './';

const items = [
  {
    id: '1',
    type: 'folder',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'A folder'
  },
  {
    id: '2',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'An audio.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '3',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'Game of thrones.mp4',
    primaryAsset: { contentType: 'video/mp4' }
  },
  {
    id: '4',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '5',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
  {
    id: '6',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'An audio.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '7',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'Game of thrones.mp4',
    primaryAsset: { contentType: 'video/mp4' }
  },
  {
    id: '8',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '9',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
  {
    id: '10',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
  {
    id: '11',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'An audio.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '12',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'Game of thrones.mp4',
    primaryAsset: { contentType: 'video/mp4' }
  },
  {
    id: '13',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '14',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
  {
    id: '15',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'An audio.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '16',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'Game of thrones.mp4',
    primaryAsset: { contentType: 'video/mp4' }
  },
  {
    id: '17',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '18',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
  {
    id: '19',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
];

const pathList = [
  {
    id: '1'
  },
  {
    label: 'Child',
    id: '2'
  }
]

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

storiesOf('DataPicker', module)
  .add('Basic', () => (
    <DataPicker
      items={items}
      triggerPagination={action('triggerPagination')}
      onCancel={action('onCancel')}
      isLoading={boolean('isLoading', false)}
      isLoaded={boolean('isLoaded', false)}
      pathList={pathList}
      onCrumbClick={action('onCrumbClick')}
      onSearch={action('onSearch')}
      onClear={action('onClear')}
      onSort={action('onSort')}
      onSelect={action('onSelect')}
      onRejectFile={action('onRejectFile')}
      onUpload={action('onUpload')}
      onDeleteFile={action('onDeleteFile')}
      percentageUploadingFiles={percentByFiles}
      onSelectItem={action('onSelectItem')}
    />
  ))
  .add('No file upload', () => (
    <DataPicker
      items={items}
      triggerPagination={action('triggerPagination')}
      onCancel={action('onCancel')}
      isLoading={boolean('isLoading', false)}
      isLoaded={boolean('isLoaded', false)}
      pathList={pathList}
      onCrumbClick={action('onCrumbClick')}
      onSearch={action('onSearch')}
      onClear={action('onClear')}
      onSort={action('onSort')}
      onSelect={action('onSelect')}
      onRejectFile={action('onRejectFile')}
      onUpload={action('onUpload')}
      onDeleteFile={action('onDeleteFile')}
      percentageUploadingFiles={[]}
      onSelectItem={action('onSelectItem')}
    />
  ))
  .add('Error / Initial loading', () => (
    <DataPicker
      items={[]}
      triggerPagination={action('triggerPagination')}
      onCancel={action('onCancel')}
      isLoading={boolean('isLoading', false)}
      isLoaded={boolean('isLoaded', false)}
      isError={boolean('isError', false)}
      pathList={pathList}
      onCrumbClick={action('onCrumbClick')}
      onSearch={action('onSearch')}
      onClear={action('onClear')}
      onSort={action('onSort')}
      onSelect={action('onSelect')}
      onRejectFile={action('onRejectFile')}
      onUpload={action('onUpload')}
      onDeleteFile={action('onDeleteFile')}
      percentageUploadingFiles={[]}
      onSelectItem={action('onSelectItem')}
    />
  ))