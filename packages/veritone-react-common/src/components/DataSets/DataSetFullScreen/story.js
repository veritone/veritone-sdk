// import React from 'react';
// import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';

// import DataSetFullScreen from './'


// var numberOfFields = 8;
// var data = [
//   {
//     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
//     name: 'TwitterDev',
//     time_zone: 'Pacific Time (US & Canada)',
//     text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
//     profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
//     Attribute: 'really long attribute name', 
//     Attribute2: 'description', 
//     Attribute3: 'description 2',
//     a: 'a',
//     b: 'b',
//     c: 'c'
//   },
//   {
//     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
//     name: 'TwitterDev',
//     time_zone: 'Pacific Time (US & Canada)',
//     text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
//     profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
//     Attribute: 'really long attribute name', 
//     Attribute2: 'description', 
//     Attribute3: 'description 2',
//     a: 'a',
//     b: 'b',
//     c: 'c'
//   },
//   {
//     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
//     name: 'TwitterDev',
//     time_zone: 'Pacific Time (US & Canada)',
//     text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
//     profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
//     Attribute: 'really long attribute name', 
//     Attribute2: 'description', 
//     Attribute3: 'description 2',
//     a: 'a',
//     b: 'b',
//     c: 'c'
//   },
//   {
//     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
//     name: 'TwitterDev',
//     time_zone: 'Pacific Time (US & Canada)',
//     text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
//     profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
//     Attribute: 'really long attribute name', 
//     Attribute2: 'description', 
//     Attribute3: 'description 2',
//     a: 'a',
//     b: 'b',
//     c: 'c'
//   },
//   {
//     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
//     name: 'TwitterDev',
//     time_zone: 'Pacific Time (US & Canada)',
//     text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
//     profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
//     Attribute: 'really long attribute name', 
//     Attribute2: 'description', 
//     Attribute3: 'description 2',
//     a: 'a',
//     b: 'b',
//     c: 'c'
//   },
//   {
//     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
//     name: 'TwitterDev',
//     time_zone: 'Pacific Time (US & Canada)',
//     text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
//     profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
//     Attribute: 'really long attribute name', 
//     Attribute2: 'description', 
//     Attribute3: 'description 2',
//     a: 'a',
//     b: 'b',
//     c: 'c'
//   },
//   {
//     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
//     name: 'TwitterDev',
//     time_zone: 'Pacific Time (US & Canada)',
//     text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
//     profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
//     Attribute: 'really long attribute name', 
//     Attribute2: 'description', 
//     Attribute3: 'description 2',
//     a: 'a',
//     b: 'b',
//     c: 'c'
//   },
//   {
//     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
//     name: 'TwitterDev',
//     time_zone: 'Pacific Time (US & Canada)',
//     text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
//     profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
//     Attribute: 'really long attribute name', 
//     Attribute2: 'description', 
//     Attribute3: 'description 2',
//     a: 'a',
//     b: 'b',
//     c: 'c'
//   },
//   {
//     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
//     name: 'TwitterDev',
//     time_zone: 'Pacific Time (US & Canada)',
//     text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
//     profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
//     Attribute: 'really long attribute name', 
//     Attribute2: 'description', 
//     Attribute3: 'description 2',
//     a: 'a',
//     b: 'b',
//     c: 'c'
//   },
//   {
//     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
//     name: 'TwitterDev',
//     time_zone: 'Pacific Time (US & Canada)',
//     text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
//     profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
//     Attribute: 'really long attribute name', 
//     Attribute2: 'description', 
//     Attribute3: 'description 2',
//     a: 'a',
//     b: 'b',
//     c: 'c'
//   }
// ];

// var sdoSourceInfo = {
//   dataSetName: 'Twitter Data Set 1',
//   sourceName: '@therealtrump',
//   sourceImage: 'https://image.flaticon.com/icons/svg/25/25305.svg',
//   sourceSelection: 'therealtrump (Source Name)',
//   sourceSelections: ['therealtrump (Source Name)', 'therealstump (Source Name)']
// };


// storiesOf('DataSetFullScreen', module)
//   .add('Base', () => (
//     <DataSetFullScreen numberOfFields={numberOfFields} data={data} sdoSourceInfo={sdoSourceInfo} />
//   ))