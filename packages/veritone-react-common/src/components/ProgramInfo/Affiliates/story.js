import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Affiliates from './';

const generateAffiliates = function(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    result.push({
      id: String(i),
      name: 'Affiliate Station ' + i,
      schedule: {
        scheduleType: 'Recurring',
        start: new Date('August 19, 2018 01:00:00').toString(),
        end: new Date('August 19, 2019 01:00:00').toString(),
        repeatEvery: {
          number: '1',
          period: 'day'
        },
        daily: [
          {
            start: '00:00',
            end: '01:00'
          }
        ],
        weekly: {
          selectedDays: ['Monday', 'Wednesday', 'Friday', 'Sunday']
        }
      }
    });
  }
  return result;
};

storiesOf('Affiliates', module)
  .add('Base', () => (
    <Affiliates
      affiliates={generateAffiliates(21)}
      selectedAffiliates={generateAffiliates(11)}
      onAffiliateChange={action('onAffiliateChange')}
      canBulkAddAffiliates
    />
  ))
  .add('No Initial Affiliates', () => (
    <Affiliates
      affiliates={generateAffiliates(21)}
      onAffiliateChange={action('onAffiliateChange')}
      canBulkAddAffiliates
    />
  ));
