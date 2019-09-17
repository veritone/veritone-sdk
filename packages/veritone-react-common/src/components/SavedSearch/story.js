import React from 'react';
import { storiesOf } from '@storybook/react';

import SavedSearch from './';

storiesOf('SavedSearch', module)
  .add('base', () => {
    return (
      <div style={{ width: "650px", height: "600px" }}>
        <SavedSearch />
      </div>
    );
  });
