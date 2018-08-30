import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AffiliateItem from './';

storiesOf('Affiliate Item', module).add('With Daily schedule', () => (
  <AffiliateItem
    affiliate={{
      id: 'stationId',
      name: 'Affiliate Station with a very long name',
      schedule: {
        scheduleType: 'Recurring',
        start: '2018-04-14T19:48:25.147Z',
        end: '2018-04-17T19:48:25.147Z',
        repeatEvery: {
          number: '1',
          period: 'week'
        },
        weekly: {
          Wednesday: [
            {
              start: '16:33',
              end: '17:21'
            }
          ],
          Thursday: [
            {
              start: '12:33',
              end: '03:21'
            },
            {
              start: '01:00',
              end: '01:00'
            }
          ],
          selectedDays: {
            Wednesday: true,
            Thursday: true
          }
        }
      }
    }}
    onEdit={action('onAffiliateChange')}
  />
));
