import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import Sidebar from './';

const Container = (
  { children } // eslint-disable-line
) => <div style={{ width: 245, borderRight: '1px solid #E0E0E0' }}>{children}</div>;

storiesOf('DiscoverySideBar', module)
  .add('Two tabs', () => {
    const clearAllFilters = boolean('clearAllFilters button', true);

    return (
      <Container>
        <Sidebar
          tabs={['Browse', 'Filters']}
          clearAllFilters={clearAllFilters}
        />
      </Container>
    );
  })
  .add('One tab', () => {
    const clearAllFilters = boolean('clearAllFilters button', true);

    return (
      <Container>
        <Sidebar tabs={['Filters']} clearAllFilters={clearAllFilters} />
      </Container>
    );
  });
