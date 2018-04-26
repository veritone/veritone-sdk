import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styles from './story.styles.scss';
import StructuredDataEngineOutput from './';

action('on-engine-selected');

storiesOf('StructuredDataEngineOutput', module).add('Base', () => {
  let engines = [
    {
      id: 'engineOfInterest',
      name: 'SD Engine Of Interest'
    }
  ];
  let mockEngineOutput = getMockData();
  let mockSchemaById = getMockSchemaById();

  return (
    <StructuredDataEngineOutput
      className={styles.outputViewRoot}
      data={mockEngineOutput}
      schemaById={mockSchemaById}
      engines={engines}
      selectedEngineId={'engineOfInterest'}
      onEngineChange={action('on-engine-selected')}
    />
  );
});

function getMockData() {
  return [
    {
      sourceEngineId: 'engineOfInterest',
      sourceEngineName: 'SD Engine Of Interest',
      taskId: 'taskId_of_the_engineOfInterest',
      series: [
        {
          startTimeMs: 0,
          stopTimeMs: 300000,
          structuredData: {
            '8a8bbd66-d160-480e-b3fb-7a935ac4e8dd': [
              {
                geoLocation: '34.05, -118.24',
                temperature: 69.71,
                pressure: 1015,
                humidity: 56,
                temperatureMin: 62.6,
                temperatureMax: 77,
                visibility: 16093,
                windSpeed: 3.36,
                windDegree: 0,
                datetimeStart: '2018-02-21T21:30:00.000Z',
                datetimeEnd: '2018-02-21T22:30:00.000Z',
                locationName: 'Los Angeles'
              }
            ],
            'c46e4675-73a0-44ce-adca-b6ebab897c21': [
              {
                id: 1234567,
                about: 'about fb feed',
                website: 'veritone.com',
                fan_count: 987654321
              }
            ]
          }
        }
      ]
    }
  ];
}

function getMockSchemaById() {
  return {
    '8a8bbd66-d160-480e-b3fb-7a935ac4e8dd': {
      id: '8a8bbd66-d160-480e-b3fb-7a935ac4e8dd',
      status: 'published',
      dataRegistry: {
        name: 'Weather'
      },
      definition: {
        $id: 'http://example.com/example.json',
        type: 'object',
        $schema: 'http://json-schema.org/draft-07/schema#',
        properties: {
          humidity: {
            $id: '/properties/humidity',
            type: 'integer'
          },
          pressure: {
            $id: '/properties/pressure',
            type: 'integer'
          },
          windSpeed: {
            $id: '/properties/windSpeed',
            type: 'number'
          },
          visibility: {
            $id: '/properties/visibility',
            type: 'integer'
          },
          windDegree: {
            $id: '/properties/windDegree',
            type: 'number'
          },
          datetimeEnd: {
            $id: '/properties/datetimeEnd',
            type: 'dateTime'
          },
          geoLocation: {
            $id: '/properties/geoLocation',
            type: 'geoPoint'
          },
          temperature: {
            $id: '/properties/temperature',
            type: 'number'
          },
          locationName: {
            $id: '/properties/locationName',
            type: 'string',
            title: 'City Name'
          },
          datetimeStart: {
            $id: '/properties/datetimeStart',
            type: 'dateTime'
          },
          temperatureMax: {
            $id: '/properties/temperatureMax',
            type: 'number'
          },
          temperatureMin: {
            $id: '/properties/temperatureMin',
            type: 'number'
          }
        },
        definitions: {}
      },
      majorVersion: 1,
      minorVersion: 0,
      validActions: ['view', 'edit', 'deactivate', 'delete']
    },
    'c46e4675-73a0-44ce-adca-b6ebab897c21': {
      id: 'c46e4675-73a0-44ce-adca-b6ebab897c21',
      status: 'published',
      dataRegistry: {
        name: 'Facebook Feed'
      },
      definition: {
        $id: 'http://example.com/example.json',
        type: 'object',
        $schema: 'http://json-schema.org/draft-07/schema#',
        properties: {
          about: {
            $id: '/properties/about',
            type: 'string'
          },
          fan_count: {
            $id: '/properties/fan_count',
            type: 'integer'
          },
          id: {
            $id: '/properties/id',
            type: 'string'
          },
          website: {
            $id: '/properties/website',
            type: 'string'
          }
        },
        definitions: {}
      },
      majorVersion: 1,
      minorVersion: 1
    }
  };
}
