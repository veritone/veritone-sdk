import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import IngestionJobFullScreen from './IngestionJobFullScreen';
import IngestionJobTileView from './IngestionJobTileView';
import IngestionJobGridCard from './IngestionJobGridView/IngestionJobGridCard';
import IngestionJobGridView from './IngestionJobGridView';
import IngestionJobNullstate from './IngestionJobNullstate';


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

var sdoSourceInfo = {
  dataSetName: 'Twitter Data Set 1',
  sourceName: '@therealtrump',
  sourceImage: 'https://image.flaticon.com/icons/svg/25/25305.svg',
  sourceSelection: 'therealtrump (Source Name)',
  sourceSelections: ['therealtrump (Source Name)', 'therealstump (Source Name)']
};



// FOR DATA SET VIEWER
var dataSetInfo = [
  {
    jobName: 'Twitter Data Set 1',
    schema: 'Twitter Schema Version 2.3',
    startTime: 'Wed Jul 13, 2016 09:23 PM'
  },
  {
    jobName: 'Twitter Data Set 2',
    schema: 'Twitter Schema Version 2.3',
    startTime: 'Wed Jul 13, 2016 09:23 PM'
  },
  {
    jobName: 'Twitter Data Set 3',
    schema: 'Twitter Schema Version 2.3',
    startTime: 'Wed Jul 13, 2016 09:23 PM'
  },
  {
    jobName: 'Twitter Data Set 4',
    schema: 'A different Twitter Schema Version 2.3',
    startTime: 'Wed Jul 13, 2016 09:23 PM'
  }
];


// FOR DATA SET SOURCE CARD
var jobCardData = {
  sourceName: 'Twitter Dataset 1',
  schemaName: 'Twitter Schema Version 2.3',
  creationDate: 'Wed Jul 13, 2016 09:23 PM',
  thumbnail: 'https://image.flaticon.com/icons/svg/25/25305.svg'
};


// FOR DATA SET SOURCE VIEW
var jobData = [
  {
    sourceName: 'Twitter Dataset 1',
    schemaName: 'Twitter Schema Version 2.3',
    creationDate: 'Wed Jul 13, 2016 09:23 PM',
    thumbnail: 'https://image.flaticon.com/icons/svg/25/25305.svg'
  },
  {
    sourceName: 'Twitter Dataset 2',
    schemaName: 'Twitter Schema Version 3.3',
    creationDate: 'Wed Jul 15, 2016 09:23 PM',
    thumbnail: 'https://image.flaticon.com/icons/svg/25/25305.svg'
  },
  {
    sourceName: 'Twitter Dataset 3',
    schemaName: 'Twitter Schema Version 4.3',
    creationDate: 'Wed Jul 13, 2017 09:23 PM',
  },
  {
    sourceName: 'Twitter Dataset 4',
    schemaName: 'Twitter Schema Version 5.3',
    creationDate: 'Wed Jul 13, 2016 10:23 PM',
  }
]


storiesOf('DataSets', module)
  .add('FullScreen', () => (
    <IngestionJobFullScreen data={data} sdoSourceInfo={sdoSourceInfo} />
  ))
  .add('Tile View', () => (
    <IngestionJobTileView dataSetInfo={dataSetInfo}/>
  ))
  .add('Grid Card', () => (
    <IngestionJobGridCard checkedAll={false} sourceName={jobCardData.sourceName} schemaVersion={jobCardData.schemaName} creationDate={jobCardData.creationDate} thumbnail={jobCardData.thumbnail} />
  ))
  .add('Grid View', () => (
    <IngestionJobGridView jobData={jobData}/>
  ))
  .add('NullState', () => (
    <IngestionJobNullstate />
  ))