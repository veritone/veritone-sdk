import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AffiliateStationsDialog from './';

const generateAffiliates = function(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    result.push({
      id: String(i),
      name: 'Affiliate Station ' + i,
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
