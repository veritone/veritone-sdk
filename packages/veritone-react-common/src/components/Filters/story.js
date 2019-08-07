import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LooksOne from '@material-ui/icons/LooksOne';

import Filters from './';

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
      icon: <LooksOne />,
      type: 'checkbox',
      children: [
        { formComponentId: 'select-station-form' }
      ]
    },
    {
      label: 'Section 2',
      type: 'checkbox',
      valueArray: [ 'haha', 'hihi', 'hehe'],
      children: [
        { formComponentId: 'default-checkboxes-1' }
      ]
    },
    {
      label: 'Section 3',
      type: 'checkbox',
      valueArray: [1, 2, 3],
      children: [
        { formComponentId: 'default-checkboxes-2' }
      ]
    },
    {
      label: 'Section 4',
      type: 'checkbox',
      children: [
        { formComponentId: 'smiling-elephant' }
      ]
    },

    // when use default checkbox, in order to enable checkboxCount,
    // it is neccessary to specify with this format for formComponentId: 'default-checkboxes-<number>'
    {
      label: 'Section 5',
      type: 'checkbox',
      valueArray: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      children: [
        { formComponentId: 'default-checkboxes-3' }
      ]
    },
  ]
}


storiesOf('Filters', module)
  .add('Filters', () => {

    return (
      <Container>
        <Filters
          tabs={['Filters']}
          closeFilter={action('close filter dialog')}
          filtersSections={exampleSectionTree}
          formComponents={{
            'select-station-form': <div>select a station</div>,
            'smiling-elephant': <div>Beautiful circuit</div>,
          }}
          selectedFilters
          onClick={action('click apply filter')}
          // onClick={() => console.log(selectedFilters)}
          checkboxCount={{
            'select-station-form': 3,
            'smiling-elephant': 7,
            'default-checkboxes-3': 9
          }}
          onCheckboxChange={action('handle change checkboxes in selectedFilters')}
        />
      </Container>
    );
  });
