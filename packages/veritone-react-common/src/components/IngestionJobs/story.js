import React from 'react';
import { storiesOf } from '@storybook/react';

import IngestionJobTileView from './IngestionJobTileView';
import IngestionJobNullstate from './Nullstate';


// TODO: new data needed
const jobInfo = {
  data: {
    scheduledJobs: {
      records: [
        {
          id: "35874",
          name: "test job",
          isActive: true,
          adapter: 'Twitter',
          engines: ['Engine A', 'Engine B', 'Engine C'],
          ingestionType: 'Data set',
          modifiedDateTime: '2015-12-01T18:17:20.675Z',
          jobTemplates: {
            records: [
              {
                id: "jobtemplateguid",
                
              }
            ]
          }
        }
      ]
    }
  }
}


storiesOf('IngestionJobs', module)
  .add('Tile View', () => (
    <IngestionJobTileView jobs={jobInfo.data.scheduledJobs.records} />
  ))
  .add('NullState', () => (
    <IngestionJobNullstate />
  ))