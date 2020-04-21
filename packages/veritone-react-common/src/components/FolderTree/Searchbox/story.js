import React from 'react';
import { storiesOf } from '@storybook/react';

import Searchbox from './';

storiesOf('FolderTree', module).add('Search box simple', () => {
  const onSearch = (data) => {
    console.log(data);
  }

  const onClearSearch = () => {
    console.log('clear search data');
  }
  /* eslint-disable react/jsx-no-bind */
  return (
    <div style={{
      width: 500,
      height: 500
    }}>
      <Searchbox
        onClearSearch={onClearSearch}
        onSearch={onSearch}
        placeholder="Search placeholder" 
      />
    </div>
  );
});
