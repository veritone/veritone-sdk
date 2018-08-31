import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AffiliateStationsDialog from './';

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

storiesOf('Affiliate Stations Dialog', module).add('Base', () => (
  <AffiliateStationsDialog
    affiliates={generateAffiliates(51)}
    onAdd={action('onAdd')}
    onClose={action('onClose')}
  />
));
