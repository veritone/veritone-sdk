import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import EditAffiliateDialog from './';


storiesOf('Edit Affiliate Dialog', module).add('Base', () => (
  <EditAffiliateDialog
    affiliate={{
      id: 'stationId',
      name: 'Affiliate Station 1',
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
    onSave={action('onSave')}
    onClose={action('onClose')}
  />
));
