import React from 'react';
import { storiesOf } from '@storybook/react';

import ExpandableSearchField from './';

const onSearch = value => console.log('Search for', value);

storiesOf('ExpandableSearchField', module).add('Base', () => {
  return (
    <div
      style={{ width: '200px', display: 'flex', justifyContent: 'flex-end' }}
    >
      <ExpandableSearchField onSearch={onSearch} />
    </div>
  );
});
