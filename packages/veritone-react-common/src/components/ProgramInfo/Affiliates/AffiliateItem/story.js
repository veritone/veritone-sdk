import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AffiliateItem from './';

storiesOf('Affiliate Item', module).add('With Daily schedule', () => (
  <AffiliateItem
    affiliate={{
      id: 'stationId',
      name: 'Affiliate Station',
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
    }}
    onEdit={action('onAffiliateChange')}
  />
));
