import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SDOCard from './SDOCard';
import SDOTile from './SDOTile';
import SDOFullScreenCard from './SDOFullScreenCard';
// import SDOMediaDetailsCard from './SDOMediaDetailsCard';



var numberOfFields = 8;
var data = [
  {
    schemaId: 'schemaId1',
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
    schemaId: 'schemaId2',
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'Twitter',
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
    schemaId: 'schemaId3',
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'Facebook',
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
    schemaId: 'schemaId4',
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'Instagram',
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
];

var schemaData1 = {
  created_at: {
    type: 'dateTime',
  },
  name: {
    type: 'string',
  },
  time_zone: {
    type: 'string',
  },
  text: {
    type: 'string',
  },
  profile_image: {
    type: 'string',
  },
  Attribute: {
    type: 'number', 
  },
  Attribute2: {
    type: 'integer',
  }, 
  Attribute3: {
    type: 'string',
  },
  a: {
    type: 'string',
  },
  b: {
    type: 'geoPoint',
  },
  c: {
    type: 'string'
  }
};

var schemaData2 = {
  created_at: {
    type: 'dateTime',
  },
  name: {
    type: 'string',
  },
  time_zone: {
    type: 'string',
  },
  text: {
    type: 'string',
  },
  profile_image: {
    type: 'string',
  },
  Attribute: {
    type: 'number', 
  },
  Attribute2: {
    type: 'integer',
  }, 
  Attribute3: {
    type: 'string',
  },
  a: {
    type: 'string',
  },
  b: {
    type: 'geoPoint',
  },
  c: {
    type: 'string'
  }
};
var schemaData3 = {
  created_at: {
    type: 'dateTime',
  },
  name: {
    type: 'string',
  },
  time_zone: {
    type: 'string',
  },
  text: {
    type: 'string',
  },
  profile_image: {
    type: 'string',
  },
  Attribute: {
    type: 'number', 
  },
  Attribute2: {
    type: 'integer',
  }, 
  Attribute3: {
    type: 'string',
  },
  a: {
    type: 'string',
  },
  b: {
    type: 'geoPoint',
  },
  c: {
    type: 'string'
  }
};
var schemaData4 = {
  created_at: {
    type: 'dateTime',
  },
  name: {
    type: 'string',
  },
  time_zone: {
    type: 'string',
  },
  text: {
    type: 'string',
  },
  profile_image: {
    type: 'string',
  },
  Attribute: {
    type: 'number', 
  },
  Attribute2: {
    type: 'integer',
  }, 
  Attribute3: {
    type: 'string',
  },
  a: {
    type: 'string',
  },
  b: {
    type: 'geoPoint',
  },
  c: {
    type: 'string'
  }
};

function schemaCallback(schemaId) {
  if (schemaId === 'schemaId1') {
    return schemaData1;
  } else if (schemaId === 'schemaId2') {
    return schemaData2;
  } else if (schemaId === 'schemaId3') {
    return schemaData3;
  } else if (schemaId === 'schemaId4') {
    return schemaData4;
  } else {
    return schemaData1
  }
}

//TODO: up for change
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
  // .add('MediaDetailsCard', () => (
  //   <SDOMediaDetailsCard sdoData={data} currentSchema={} sdoEngineInfo={sdoEngineInfo} schemaCallback={schemaCallback} />
  // ))
  .add('Card', () => (
    <SDOCard sdoData={data} schemaData={schemaData1}/>
  ))
  .add('Tile', () => (
    <SDOTile checkAll={checkAll} numberOfFields={numberOfFields} columns={columns} />
  ))