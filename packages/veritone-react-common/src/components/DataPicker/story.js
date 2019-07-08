import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, select } from '@storybook/addon-knobs';
import DataPicker from './';

const items = [
  {
    id: '1',
    type: 'folder',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'A folder'
  },
  {
    id: '2',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    startDateTime: '2019-06-03T21:58:20.000Z',
    stopDateTime: '2019-06-03T21:59:25.000Z',
    name: 'An audio.mp3',
    primaryAsset: { contentType: 'audio/mp3', signedUri: 'https://inspirent.s3.amazonaws.com/assets/100364828/1c94f0bb-d370-4fc2-bcef-ae3d7a3e8437.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQMR5VATUHU3MEGOA%2F20190603%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190603T215541Z&X-Amz-Expires=10800&X-Amz-Signature=e72589639c5fdf4caa8dc8675703e37665e8d4c1d76904d66b648fdee608b9c6&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22jLQvOyXMRNewKVLBlH62.mp4%22' }
  },
  {
    id: '3',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    startDateTime: '2019-06-03T21:58:20.000Z',
    stopDateTime: '2019-06-03T21:59:25.000Z',
    name: 'Game of thrones.mp4',
    primaryAsset: { contentType: 'video/mp4', signedUri: 'https://inspirent.s3.amazonaws.com/assets/100475387/66c50ed3-d5d8-4a78-a3bc-f226613b7eac.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQMR5VATUHU3MEGOA%2F20190603%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190603T215541Z&X-Amz-Expires=10800&X-Amz-Signature=26dae18984525f04efe4df259b0820467fe8361f8b1a72bf26183a079b8d0aa1&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22k2YOCylXRAmaSzSDYdQi.mp4%22' }
  },
  {
    id: '4',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '5',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
  {
    id: '6',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'An audio.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '7',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'Game of thrones.mp4',
    primaryAsset: { contentType: 'video/mp4' }
  },
  {
    id: '8',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '9',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
  {
    id: '10',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
  {
    id: '11',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'An audio.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '12',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'Game of thrones.mp4',
    primaryAsset: { contentType: 'video/mp4' }
  },
  {
    id: '13',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '14',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
  {
    id: '15',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'An audio.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '16',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'Game of thrones.mp4',
    primaryAsset: { contentType: 'video/mp4' }
  },
  {
    id: '17',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' }
  },
  {
    id: '18',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
  {
    id: '19',
    type: 'tdo',
    createdDateTime: '2019-03-29T22:34:00.000Z',
    modifiedDateTime: '2019-03-29T22:34:00.000Z',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }
  },
];

const pathList = [
  {
    name: 'Child 1',
    id: '1'
  },
  {
    name: 'Child 2',
    id: '2'
  },
  {
    name: 'Child 3',
    id: '3'
  },
  {
    name: 'Child 4',
    id: '4'
  },
  {
    name: 'Child 5',
    id: '5'
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
  .add('DataPicker: Basic', () => (
    <DataPicker
      availablePickerTypes={['folder', 'stream', 'upload']}
      toggleContentView={action('toggleContentView')}
      items={items}
      currentPickerType={select(
        'currentPickerType', 
        {
          folder: 'folder',
          upload: 'upload',
          stream: 'stream'
        },
        'folder'
      )}
      setPickerType={action('setPickerType')}
      triggerPagination={action('triggerPagination')}
      onCancel={action('onCancel')}
      isLoading={boolean('isLoading', false)}
      isLoaded={boolean('isLoaded', true)}
      pathList={pathList}
      onCrumbClick={action('onCrumbClick')}
      onSearch={action('onSearch')}
      onClear={action('onClear')}
      onSort={action('onSort')}
      onSelect={action('onSelect')}
      onRejectFile={action('onRejectFile')}
      onUpload={action('onUpload')}
      onDeleteFile={action('onDeleteFile')}
      percentByFiles={percentByFiles}
    />
  ))
  .add('DataPicker: Empty Current Directory', () => (
    <DataPicker
      availablePickerTypes={['folder', 'stream', 'upload']}
      toggleContentView={action('toggleContentView')}
      items={[]}
      currentPickerType={select(
        'currentPickerType', 
        {
          folder: 'folder',
          upload: 'upload',
          stream: 'stream'
        },
        'folder'
      )}
      setPickerType={action('setPickerType')}
      triggerPagination={action('triggerPagination')}
      onCancel={action('onCancel')}
      isLoading={boolean('isLoading', false)}
      isLoaded={boolean('isLoaded', true)}
      pathList={pathList}
      onCrumbClick={action('onCrumbClick')}
      onSearch={action('onSearch')}
      onClear={action('onClear')}
      onSort={action('onSort')}
      onSelect={action('onSelect')}
      onRejectFile={action('onRejectFile')}
      onUpload={action('onUpload')}
      onDeleteFile={action('onDeleteFile')}
      percentByFiles={percentByFiles}
    />
  ))
  .add('DataPicker: No file upload', () => (
    <DataPicker
      availablePickerTypes={['folder', 'stream']}
      toggleContentView={action('toggleContentView')}
      items={items}
      currentPickerType={select(
        'currentPickerType', 
        {
          folder: 'folder',
          stream: 'stream'
        },
        'folder'
      )}
      setPickerType={action('setPickerType')}
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
      percentByFiles={[]}
    />
  ))
  .add('DataPicker: Error / Initial loading', () => (
    <DataPicker
      availablePickerTypes={['folder', 'stream', 'upload']}
      toggleContentView={action('toggleContentView')}
      items={[]}
      currentPickerType={select(
        'currentPickerType', 
        {
          folder: 'folder',
          upload: 'upload',
          stream: 'stream'
        },
        'folder'
      )}
      setPickerType={action('setPickerType')}
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
      percentByFiles={[]}
    />
  ))

export {
  items,
  pathList,
  percentByFiles
};