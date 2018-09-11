import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { generateAffiliates } from "../test-helpers";

import BulkAddAffiliatesDialog from './';

storiesOf('Bulk Add Affiliates Dialog', module).add('Base', () => (
  <BulkAddAffiliatesDialog
    affiliates={generateAffiliates(51)}
    onAdd={action('onAdd')}
    onClose={action('onClose')}
  />
));
