import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SDOTile from './'

var checkAll = false;
var columns = {
  createdAt: 'Sat Dec 14 04:35:55 +0000 2013',
  name: 'TwitterDev',
  timeZone: 'Pacific Time (US & Canada)',
  text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
  profileImage: 'https://image.flaticon.com/icons/svg/25/25305.svg',
  attributes: ['really long attribute name', 'description', 'description 2']
};
var numberOfFields = 8;

storiesOf('SDOTile', module)
  .add('Base', () => (
    <SDOTile checkAll={checkAll} numberOfFields={numberOfFields} columns={columns} />
  ))