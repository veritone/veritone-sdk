import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SDOCard from './SDOCard';
import SDOTile from './SDOTile';
import SDOFullScreenCard from './SDOFullScreenCard';
import SDOMediaDetailsCard from './SDOMediaDetailsCard';



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
  sourceName: '@therealtrump',
  sourceImage: 'https://image.flaticon.com/icons/svg/25/25305.svg',
  sourceSelection: 'therealtrump',
  sourceSelections: ['therealtrump', 'therealstump']
};

var sdoSchemaInfo = {
  schemaSelection: 'Tweet',
  schemaSelections: ['Tweet', 'Twat', 'Twot']
};

var sdoEngineInfo = {
  engineSelection: 'Engine Name 1',
  engineSelections: ['Engine Name 1', 'Engine Name 2']
};



// FOR SDO TILE
var checkAll = false;
var columns = {
  createdAt: 'Sat Dec 14 04:35:55 +0000 2013',
  name: 'TwitterDev',
  timeZone: 'Pacific Time (US & Canada)',
  text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
  profileImage: 'https://image.flaticon.com/icons/svg/25/25305.svg',
  Attribute: 'really long attribute name', 
  Attribute2: 'description', 
  Attribute3: 'description 2',
  a: 'a',
  b: 'b',
  c: 'c'
};
var numberOfFields = 8;

storiesOf('SDO', module)
  .add('FullScreenCard', () => (
    <SDOFullScreenCard numberOfFields={numberOfFields} data={data} sdoSourceInfo={sdoSourceInfo} sdoSchemaInfo={sdoSchemaInfo} sdoEngineInfo={sdoEngineInfo} />
  ))
  .add('MediaDetailsCard', () => (
    <SDOMediaDetailsCard numberOfFields={numberOfFields} data={data} sdoSourceInfo={sdoSourceInfo} sdoSchemaInfo={sdoSchemaInfo} sdoEngineInfo={sdoEngineInfo} />
  ))
  .add('Card', () => (
    <SDOCard data={data} sdoSourceInfo={sdoSourceInfo} />
  ))
  .add('Tile', () => (
    <SDOTile checkAll={checkAll} numberOfFields={numberOfFields} columns={columns} />
  ))