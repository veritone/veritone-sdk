import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import VeritoneApp from '../../shared/VeritoneApp';
import TableWidget from './';
import { startCase, upperCase, map, omit, flow, truncate } from 'lodash';

const data = [
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text:
      'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name',
    Attribute2: 'description',
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c',
    actions: ['View', 'Edit', 'Delete']
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text:
      'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name',
    Attribute2: 'description',
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c',
    actions: ['View', 'Edit', 'Delete']
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text:
      'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name',
    Attribute2: 'description',
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c',
    actions: ['View', 'Edit', 'Delete']
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text:
      'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name',
    Attribute2: 'description',
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c',
    actions: ['View', 'Edit', 'Delete']
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text:
      'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name',
    Attribute2: 'description',
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c',
    actions: ['View', 'Edit', 'Delete']
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text:
      'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name',
    Attribute2: 'description',
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c',
    actions: ['View', 'Edit', 'Delete']
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text:
      'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name',
    Attribute2: 'description',
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c',
    actions: ['View', 'Edit', 'Delete']
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text:
      'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name',
    Attribute2: 'description',
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c',
    actions: ['View', 'Edit', 'Delete']
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text:
      'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name',
    Attribute2: 'description',
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c',
    actions: ['View', 'Edit', 'Delete']
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text:
      'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name',
    Attribute2: 'description',
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c',
    actions: ['View', 'Edit', 'Delete']
  }
];

const columns = map(omit(data[0], ['a', 'b', 'c']), (val, key) => {
  const colDefs = {
    dataKey: key,
    header: startCase(key),
    transform: flow([upperCase, truncate]),
    align: 'center',
    width: Math.min((Math.min(key.length, 4) + 1) * 10, 100)
  };

  if (key === 'actions') {
    colDefs.menu = true;
    colDefs.onSelectItem = action => {
      console.log('action:', action);
    };
  }
  return colDefs;
});

class Story extends React.Component {
  componentDidMount() {
    this._sdoTableWidget = new TableWidget({
      elId: 'table-widget',
      title: 'TableWidget Widget',
      paginate: true,
      initialItemsPerPage: 5,
      data,
      columns
    });
  }

  componentWillUnmount() {
    this._sdoTableWidget.destroy();
  }

  render() {
    return (
      <div>
        <span id="table-widget" />
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('Table', module).add('Base', () => {
  const sessionToken = text('Api Session Token', '');

  return <Story sessionToken={sessionToken} store={app._store} />;
});
