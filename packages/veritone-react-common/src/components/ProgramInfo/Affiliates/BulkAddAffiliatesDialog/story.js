import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import BulkAddAffiliatesDialog from './';

const generateAffiliates = function(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    result.push({
      id: String(i),
      name: 'Affiliate Station ' + i
    });
  }
  return result;
};

storiesOf('Bulk Add Affiliates Dialog', module).add('Base', () => (
  <BulkAddAffiliatesDialog
    affiliates={generateAffiliates(51)}
    onAdd={action('onAdd')}
    onClose={action('onClose')}
  />
));
