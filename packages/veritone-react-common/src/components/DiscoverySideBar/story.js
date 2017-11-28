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

const exampleSectionTree = {
  children: [
    {
      label: 'Section 1',
      children: [
        {
          label: 'SubSection 1',
          children: [
            {
              label: 'Sub-SubSection 1',
              children: [{ formComponentId: 'select-station-form' }]
            }
          ]
        }
      ]
    },
    {
      label: 'Section 2',
      children: []
    },
    {
      label: 'Section 3',
      children: [
        {
          label: 'SubSection 1',
          children: [{ formComponentId: 'select-station-form' }]
        },
        {
          label: 'SubSection 2',
          children: [{ formComponentId: 'select-station-form' }]
        }
      ]
    }
  ]
};

const exampleSelectedFilters = [
  {
    label: 'filter category one',
    number: 5,
    id: '1'
  },
  {
    label: 'filter category 2',
    number: 10,
    id: '2'
  }
];

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
          filtersSections={exampleSectionTree}
          formComponents={{
            'select-station-form': <div>select a station</div>
          }}
          selectedFilters={exampleSelectedFilters}
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
          filtersSections={exampleSectionTree}
          formComponents={{
            'select-station-form': <div>select a station</div>
          }}
          selectedFilters={exampleSelectedFilters}
        />
      </Container>
    );
  });
