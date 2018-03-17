import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import IngestionJobFullScreen from './IngestionJobFullScreen';
import IngestionJobTileView from './IngestionJobTileView';
import IngestionJobGridCard from './IngestionJobGridView/IngestionJobGridCard';
import IngestionJobGridView from './IngestionJobGridView';
import IngestionJobNullstate from './Nullstate';


var numberOfFields = 8;
var data = [
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  }
];


// FOR FULLSCREEN VIEW
var sdoSchemaInfo = {
  schemas: [
    {
      schemaName: 'Tweet Post Schema',
      version: '1.1',
    },
    {
      schemaName: 'Tweet Post Schema 2',
      version: '2.0'
    }
  ]
};

var oneJobInfo = {
  jobName: 'Donald Trump Twitter Posts',
  // thumbnail: 'https://static.veritone.com/veritone-ui/default-nullstate.svg'
  thumbnail: 'https://image.flaticon.com/icons/svg/25/25305.svg'
};



// FOR DATA SET VIEWER
var jobInfo = [
  {
    name: 'Donald Trump Twitter Posts 1',
    status: 'active',
    adapter: 'Facebook',
    ingestionType: 'Data set',
    creationDate: 'Wed Jul 13, 2016 09:23 PM',
    lastIngested: 'Wed Jul 13, 2016 09:23 PM',
    thumbnail: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    sourceType: 'Facebook'
  },
  {
    name: 'Donald Trump Twitter Posts 2',
    status: 'paused',
    adapter: 'Twitter',
    ingestionType: 'Data set',
    creationDate: 'Wed Jul 13, 2016 09:23 PM',
    lastIngested: 'Wed Jul 13, 2016 09:23 PM',
    thumbnail: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    sourceType: 'Twitter'
  },
  {
    name: 'Donald Trump Twitter Posts 3',
    status: 'processing',
    adapter: 'Twitter',
    ingestionType: 'Data set',
    creationDate: 'Wed Jul 13, 2016 09:23 PM',
    lastIngested: 'Wed Jul 13, 2016 09:23 PM',
    thumbnail: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    sourceType: 'Twitter'
  },
  {
    name: 'Donald Trump Twitter Posts 4',
    status: 'inactive',
    adapter: 'Twitter',
    ingestionType: 'Data set',
    creationDate: 'Wed Jul 13, 2016 09:23 PM',
    lastIngested: 'Wed Jul 13, 2016 09:23 PM',
    thumbnail: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    sourceType: 'Twitter'
  }
];


storiesOf('IngestionJobs', module)
  .add('FullScreen', () => (
    <IngestionJobFullScreen data={data} sdoSchemaInfo={sdoSchemaInfo} jobInfo={oneJobInfo} />
  ))
  .add('Tile View', () => (
    <IngestionJobTileView jobInfo={jobInfo}/>
  ))
  .add('Grid Card', () => (
    <IngestionJobGridCard checkedAll={false} jobName={jobInfo[0].name} status={jobInfo[0].status} creationDate={jobInfo[0].creationDate} thumbnail={jobInfo[0].thumbnail} />
  ))
  .add('Grid View', () => (
    <IngestionJobGridView jobInfo={jobInfo}/>
  ))
  .add('NullState', () => (
    <IngestionJobNullstate />
  ))