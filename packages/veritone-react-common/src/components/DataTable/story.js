
// import React from 'react';

// import { PaginatedTable, Column } from './';
// import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';

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




// function PageTable(props) {
//   const tableEmptyMessage =
//     'Nothing to see here! This table will show your engines when some exist.';

//   const tableEmptyFailureMessage =
//     'Engines failed to load; please try again later.';

//   function getRowData(i) {
//     return props.data[i];
//   };

//   const columns = Object.keys(props.data[0]).map((column, index) => {
//     return <Column dataKey={column} header={column} key={index}/>
//   })

//   return (
//     <PaginatedTable
//       rowGetter={getRowData}
//       rowCount={props.data.length}
//       uiState={{page:1, perPage: 10}}
//     >
//       {columns}
//     </PaginatedTable>
//   );
// }
  

// storiesOf('Table', module)
//   .add('Page', () => (
//     <PageTable data={data}/>
//   ))