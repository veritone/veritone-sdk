import React from 'react';
import { storiesOf } from '@storybook/react';

import Searchbox from './';

storiesOf('FolderTree', module).add('Search box simple', () => {
  
  /* eslint-disable react/jsx-no-bind */
  return (
    <div style={{
      width: 500,
      height: 500
    }}>
      <Searchbox />
    </div>
  );
});
