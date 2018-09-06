import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { slice } from 'lodash';

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

const AFFILIATES_LIST = generateAffiliates(222);

const loadNextAffiliates = function ({limit, offset, nameSearchText = ''}) {
  return Promise.resolve(
    slice(AFFILIATES_LIST
      .filter(affiliate => affiliate.name.toLowerCase().includes(nameSearchText.toLowerCase())), offset, offset + limit));
};

storiesOf('Affiliate Stations Dialog', module).add('Base', () => (
  <AffiliateStationsDialog
    loadNextAffiliates={loadNextAffiliates}
    onAdd={action('onAdd')}
    onClose={action('onClose')}
  />
));
