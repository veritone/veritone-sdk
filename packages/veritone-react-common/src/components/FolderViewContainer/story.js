import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import FolderViewContainer from './';

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
    primaryAsset: { contentType: 'audio/mp3' },
    fileLocation: "https://api.veritone.com/media-streamer/download/tdo/490514081"
  },
  {
    id: '3',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'Game of thrones.mp4',
    primaryAsset: { contentType: 'video/mp4' },
    fileLocation: "https://api.veritone.com/media-streamer/download/tdo/490514081"    
  },
  {
    id: '4',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' },
    fileLocation: "https://api.veritone.com/media-streamer/download/tdo/490514081"
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
    primaryAsset: { contentType: 'video/mp4' },
    fileLocation: "https://api.veritone.com/media-streamer/download/tdo/490514081"
  },
  {
    id: '8',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' },
    fileLocation: "https://api.veritone.com/media-streamer/download/tdo/490514081"
  },
  {
    id: '9',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' },
    fileLocation: "https://api.veritone.com/media-streamer/download/tdo/490514081"
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
    primaryAsset: { contentType: 'audio/mp3' },
    fileLocation: "https://api.veritone.com/media-streamer/download/tdo/490514081"
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
    primaryAsset: { contentType: 'audio/mp3' },
    fileLocation: "https://api.veritone.com/media-streamer/download/tdo/490514081"

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
    primaryAsset: { contentType: 'video/mp4' },
    fileLocation: "https://api.veritone.com/media-streamer/download/tdo/490514081"
  },
  {
    id: '17',
    type: 'tdo',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' },
    fileLocation: "https://api.veritone.com/media-streamer/download/tdo/490514081"
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

storiesOf('FolderViewContainer', module)
  .add('Loading', () => (
    <FolderViewContainer
      onSelectItem={action('onSelectItem')}
      triggerPagination={action('triggerPagination')}
      viewType={text('viewType', 'list')}
      isLoading
    />
  ))
  .add('Null', () => (
    <FolderViewContainer
      onSelectItem={action('onSelectItem')}
      triggerPagination={action('triggerPagination')}
      viewType={text('viewType', 'list')}
      isLoaded
    />
  ))
  .add('Basic', () => (
    <FolderViewContainer
      items={items}
      onSelectItem={action('onSelectItem')}
      triggerPagination={action('triggerPagination')}
      viewType={text('viewType', 'list')}
      isLoading={boolean('isLoading', false)}
      isError={boolean('isError', false)}
      onSubmit={action('onSubmit')}
      onCancel={action('onCancel')}
    />
  ))
