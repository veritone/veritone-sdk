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
          id: '35986',
          isActive: true,
          name: 'test time',
          jobs: {
            records: [
              {
                id: '00b6b071-86b9-43f7-826b-9dd75aeb6e93',
                createdDateTime: '2018-04-10T18:36:26.000Z'
              },
              {
                id: '3902249e-edd1-4296-9ba1-3a30b14eb2ac',
                createdDateTime: '2018-04-10T05:04:23.000Z'
              },
              {
                id: 'c019cb93-2fbe-4a38-8640-a567aeefd574',
                createdDateTime: '2018-04-10T04:53:35.000Z'
              }
            ]
          },
          jobTemplates: {
            records: [
              {
                taskTemplates: {
                  records: [
                    {
                      engineId: 'thumbnail-generator',
                      id: '600d313f-fc9b-4374-b8d7-e452a3c050af',
                      engine: {
                        name: 'Thumbnail generation',
                        category: {
                          name: 'Thumbnail',
                          id: 'f951fbf9-aa69-47a2-87c8-12dfb51a1f18',
                          type: {
                            name: 'Cognition'
                          },
                          iconClass: 'icon-transcription'
                        },
                        validStateActions: ['disable']
                      }
                    },
                    {
                      engineId: 'd1bc57fe-675d-435d-9f4d-2f074485ec55',
                      id: '33c454e5-308f-4752-ba01-5c283520b91f',
                      engine: {
                        name: 'Kurento Adapter',
                        category: {
                          name: 'Push',
                          id: '0b10da6b-3485-496c-a2cb-aabf59a6352d',
                          type: {
                            name: 'Ingestion'
                          },
                          iconClass: null
                        },
                        validStateActions: ['disable']
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          id: '35982',
          isActive: true,
          name: 'give me my weather data pleasezzzz',
          jobs: {
            records: [
              {
                id: '8fb9d671-b3a3-491a-8c54-1ce1a240f6ae',
                createdDateTime: '2018-04-10T04:48:17.000Z'
              },
              {
                id: '4944ba03-9a27-40e5-b340-e2a6f2e63369',
                createdDateTime: '2018-04-10T01:58:39.000Z'
              },
              {
                id: 'e749c250-28f1-48d9-9499-4912ade80be4',
                createdDateTime: '2018-04-10T00:53:27.000Z'
              }
            ]
          },
          jobTemplates: {
            records: [
              {
                taskTemplates: {
                  records: [
                    {
                      engineId: 'transcode-ffmpeg',
                      id: '7d2f45bf-3606-4ec7-aaf8-c643db28cea2',
                      engine: {
                        name: 'Cerebral',
                        category: {
                          name: 'Transcode',
                          id: '581dbb32-ea5b-4458-bd15-8094942345e3',
                          type: {
                            name: 'Cognition'
                          },
                          iconClass: 'icon-engine-transcode'
                        },
                        validStateActions: ['disable']
                      }
                    },
                    {
                      engineId: '4d0b2407-f2af-4f19-bdfc-83f74981790a',
                      id: 'c65685fd-a0d6-481a-9596-9e4ce581747e',
                      engine: {
                        name: 'Open Weather Adapter',
                        category: {
                          name: 'Pull',
                          id: '4b150c85-82d0-4a18-b7fb-63e4a58dfcce',
                          type: {
                            name: 'Ingestion'
                          },
                          iconClass: null
                        },
                        validStateActions: ['disable']
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
};

function handleSelectJob(row, dataKey, dataKeyValue) {
  console.log('row, dataKey, dataKeyValue:', row, dataKey, dataKeyValue)
}

storiesOf('IngestionJobs', module)
  .add('Tile View', () => (
    <IngestionJobTileView
      jobs={jobInfo.data.scheduledJobs.records}
      onSelectJob={handleSelectJob}
    />
  ))
  .add('NullState', () => <IngestionJobNullstate />);
