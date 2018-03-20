import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Nullstate from './Nullstate';
import SourceGridView from './GridView';
import FullScreenView from './FullScreen';


var sourceInfo = [
  {
    name: 'Hillary Clinton Twitter',
    status: 'active',
    // adapter: 'Facebook',
    ingestionType: 'Data set',
    creationDate: 'Wed Jul 13, 2016 09:23 PM',
    lastIngested: 'Wed Jul 13, 2016 09:23 PM',
    thumbnail: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    sourceType: 'Facebook'
  },
  {
    name: 'Donald Trump Twitter Posts 2',
    status: 'paused',
    // adapter: 'Twitter',
    ingestionType: 'Data set',
    creationDate: 'Wed Jul 13, 2016 09:23 PM',
    lastIngested: 'Wed Jul 13, 2016 09:23 PM',
    thumbnail: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    sourceType: 'Twitter'
  },
  {
    name: 'Donald Trump Twitter Posts 3',
    status: 'processing',
    // adapter: 'Twitter',
    ingestionType: 'Data set',
    creationDate: 'Wed Jul 13, 2016 09:23 PM',
    lastIngested: 'Wed Jul 13, 2016 09:23 PM',
    thumbnail: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    sourceType: 'Twitter'
  },
  {
    name: 'Donald Trump Twitter Posts 4',
    status: 'inactive',
    // adapter: 'Twitter',
    ingestionType: 'Data set',
    creationDate: 'Wed Jul 13, 2016 09:23 PM',
    lastIngested: 'Wed Jul 13, 2016 09:23 PM',
    thumbnail: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    sourceType: 'Twitter'
  }
];

var sourceTypes = [
  {
    name: 'Twitter',
    fields: {
      url: 'http://www.twitter.com/hillaryclinton',
      username: 'jane@twitter.com',
      password: 'Password'
    }
  },
  {
    name: 'Facebook',
    fields: {
      url: 'http://www.facebook.com/hillaryclinton',
      url2: 'http://www.facebook.com/jane',
      username: 'jane@facebook.com',
      password: 'Password'
    }
  }
];

  
var assets = {
  data: [
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
  ],
  schemaInfo: {
    schemaSelection: 'Tweet',
    schemaSelections: ['Tweet', 'Twat', 'Twot']
  }
};

var jobInfo = [

];


storiesOf('SourceManagement', module)
  .add('Nullstate', () => (
    <Nullstate />
  ))
  .add('Grid', () => (
    <SourceGridView sourceInfo={sourceInfo} />
  ))
  .add('FullScreen', () => (
    <FullScreenView startingTabIndex={2} sourceTypes={sourceTypes} assets={assets} jobInfo={jobInfo} />
  ))