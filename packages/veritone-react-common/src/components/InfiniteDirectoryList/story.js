import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import InfiniteDirectoryList from './';

const items = [
  { id: '1',
    type: 'folder',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'A folder' },
  { id: '2',
    type: 'audio/mp3',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'An audio.mp3',
    primaryAsset: { contentType: 'audio/mp3'}},
  { id: '3',
    type: 'video/mp4',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'Game of thrones.mp4',
    primaryAsset: { contentType: 'video/mp4'}},
  { id: '4',
    type: 'audio/mp3',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3'}},
  { id: '5',
    type: 'doc',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml'}},
  { id: '6',
    type: 'audio/mp3',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'An audio.mp3',
    primaryAsset: { contentType: 'audio/mp3' }},
  { id: '7',
    type: 'video/mp4',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'Game of thrones.mp4',
    primaryAsset: { contentType: 'video/mp4' }},
  { id: '8',
    type: 'audio/mp3',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'City of stars.mp3',
    primaryAsset: { contentType: 'audio/mp3' }},
  { id: '9',
    type: 'doc',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }},
  { id: '10',
    type: 'doc',
    createdDateTime: 'Mar 29, 2019 3:34 PM',
    modifiedDateTime: 'Mar 29, 2019 3:34 PM',
    name: 'maps.xml',
    primaryAsset: { contentType: 'doc/xml' }},
]

storiesOf('InfiniteDirectoryList', module)
  .add('Basic', () => (
    <InfiniteDirectoryList
      items={items}
      headers={['Name', 'Created Date Time', 'Modified Date Time', 'Type']}
      triggerPagination={action('triggerPagination')}
      onSelectItem={action('onSelectItem')}
      isLoading={boolean('isLoading', false)}
    />
  ))
