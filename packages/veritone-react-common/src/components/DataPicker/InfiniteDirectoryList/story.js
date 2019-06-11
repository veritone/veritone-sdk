import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import InfiniteDirectoryList from './';

const items = [
  { id: '1', type: 'Folder', date: 'Mar 29, 2019 3:34 PM', name: 'A folder' },
  { id: '2', type: 'audio/mp3', date: 'Mar 29, 2019 3:34 PM', name: 'An audio.mp3' },
  { id: '3', type: 'video/mp4', date: 'Mar 29, 2019 3:34 PM', name: 'Game of thrones.mp4' },
  { id: '4', type: 'audio/mp3', date: 'Mar 29, 2019 3:34 PM', name: 'City of stars.mp3' },
  { id: '5', type: 'doc', date: 'Mar 29, 2019 3:34 PM', name: 'maps.xml' },
  { id: '6', type: 'audio/mp3', date: 'Mar 29, 2019 3:34 PM', name: 'An audio.mp3' },
  { id: '7', type: 'video/mp4', date: 'Mar 29, 2019 3:34 PM', name: 'Game of thrones.mp4' },
  { id: '8', type: 'audio/mp3', date: 'Mar 29, 2019 3:34 PM', name: 'City of stars.mp3' },
  { id: '9', type: 'doc', date: 'Mar 29, 2019 3:34 PM', name: 'maps.xml' },
  { id: '10', type: 'doc', date: 'Mar 29, 2019 3:34 PM', name: 'maps.xml' },
]

storiesOf('DataPicker', module)
  .add('InfiniteDirectoryList: Basic', () => (
    <InfiniteDirectoryList
      items={items}
      headers={['Name', 'Date', 'Type']}
      onMount={action('onMount')}
      triggerPagination={action('loadMore')}
      onSelectItem={action('onSelectItem')}
      finishedLoading={false}
    />
  ))
  .add('InfiniteDirectoryList: Finish loading', () => (
    <InfiniteDirectoryList
      items={items}
      headers={['Name', 'Date', 'Type']}
      onMount={action('onMount')}
      triggerPagination={action('loadMore')}
      onSelectItem={action('onSelectItem')}
      finishedLoading
    />
  ))
