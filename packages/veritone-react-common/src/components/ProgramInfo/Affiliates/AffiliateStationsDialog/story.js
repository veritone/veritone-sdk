import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { loadNextAffiliates } from "../test-helpers";

import AffiliateStationsDialog from './';

storiesOf('Affiliate Stations Dialog', module).add('Base', () => (
  <AffiliateStationsDialog
    loadNextAffiliates={loadNextAffiliates}
    onAdd={action('onAdd')}
    onClose={action('onClose')}
  />
));
