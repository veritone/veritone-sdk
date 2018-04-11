import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import RefreshButton from './';

const handler = action('refreshed');
storiesOf('RefreshButton', module).add('Base', () => {
  return <RefreshButton onRefresh={handler} />;
});
