import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Sidebar from './';

const Container = (
  { children } // eslint-disable-line
) => (
  <div
    style={{ width: 245, borderRight: '1px solid #E0E0E0', height: '100vh' }}
  >
    {children}
  </div>
);

storiesOf('DiscoverySideBar', module)
  .add('Two tabs', () => {
    const clearAllFilters = boolean('clearAllFilters button', false);

    return (
      <Container>
        <Sidebar
          tabs={['Browse', 'Filters']}
          clearAllFilters={clearAllFilters}
          onClearFilter={action('clear filter')}
          onClearAllFilters={action('clear all filters')}
        />
      </Container>
    );
  })
  .add('One tab', () => {
    const clearAllFilters = boolean('clearAllFilters button', false);

    return (
      <Container>
        <Sidebar
          tabs={['Filters']}
          clearAllFilters={clearAllFilters}
          onClearFilter={action('clear filter')}
          onClearAllFilters={action('clear all filters')}
        />
      </Container>
    );
  });
