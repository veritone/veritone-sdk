import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import Breadcrumbs from './';

storiesOf('DataPicker', module)
  .add('Breadcrumbs: Full path list', () => {
    const pathList = [
      { id: 'first', name: 'Parent' },
      { id: 'second', name: 'Child' },
      { id: 'third', name: 'GrandChild' },
    ]
    return (
      <Breadcrumbs
        pathList={pathList}
        onCrumbClick={action('onCrumbClick')}
        isStream={boolean('isStream', false)}
        maxItems={3}
      />
    );
  })
  .add('Breadcrumbs: Hidden path list', () => {
    const pathList = [
      { id: 'first', name: 'Parent' },
      { id: 'second', name: 'Child' },
      { id: 'third', name: 'GrandChild' },
      { id: 'fourth', name: 'Super GrandChild' },
      { id: 'fifth', name: 'Ultra GrandChild' }
    ]
    return (
      <Breadcrumbs
        pathList={pathList}
        onCrumbClick={action('onCrumbClick')}
        isStream={boolean('isStream', false)}
      />
    );
  })
