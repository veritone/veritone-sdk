import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import Breadcrumbs from './';

storiesOf('DataPicker', module)
  .add('Breadcrumbs: loading pathlist', () => {
    const pathList = [
      { id: 'first', name: 'Parent' },
      { id: 'second', name: 'Child' },
      { id: 'third', name: 'GrandChild' },
      { id: 'fourth', name: 'Super GrandChild' },
    ]
    return (
      <Breadcrumbs
        pathList={pathList}
        onCrumbClick={action('onCrumbClick')}
        isStream={boolean('isStream', false)}
        isEnableSuiteCase={false}
        defaultRootTitle="Org collections"
        isEnableBackground={false}
        loading
      />
    );
  })
  .add('Breadcrumbs: Full path list', () => {
    const pathList = [
      { id: 'first', name: 'Parent' },
      { id: 'second', name: 'Child' },
      { id: 'third', name: 'GrandChild' },
      { id: 'fourth', name: 'Super GrandChild' },
    ]
    return (
      <Breadcrumbs
        pathList={pathList}
        onCrumbClick={action('onCrumbClick')}
        isStream={boolean('isStream', false)}
      />
    );
  })
  .add('Breadcrumbs: Custom pathlist', () => {
    const pathList = [
      { id: 'first', name: 'Parent' },
      { id: 'second', name: 'Child', isDisabled: true },
      { id: 'third', name: 'GrandChild' },
      { id: 'fourth', name: 'Super GrandChild' },
    ]
    return (
      <Breadcrumbs
        pathList={pathList}
        onCrumbClick={action('onCrumbClick')}
        isStream={boolean('isStream', false)}
        isEnableSuiteCase={false}
        defaultRootTitle="Org collections"
        isEnableBackground={false}
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
