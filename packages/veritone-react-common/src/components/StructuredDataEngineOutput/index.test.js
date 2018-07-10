import React from 'react';
import { mount } from 'enzyme';
import StructuredDataEngineOutput from './';

const SCHEMA_BY_ID = {
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

const ENGINES = [
  { id: 'time-correlated-weather', name: 'Weather' },
  { id: 'time-correlated-fb-feed', name: 'Facebook feeds' }
];

describe('StructuredDataEngineOutput', () => {
  it('should show structured data array results', () => {
    const structuredData = [
      {
        sourceEngineId: ENGINES[0].id,
        sourceEngineName: ENGINES[0].name,
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
              ]
            }
          }
        ]
      }
    ];

    const onEngineChange = jest.fn();
    const onExpandClick = jest.fn();

    const wrapper = mount(
      <StructuredDataEngineOutput
        data={structuredData}
        schemasById={SCHEMA_BY_ID}
        engines={ENGINES}
        selectedEngineId={ENGINES[0].id}
        onEngineChange={onEngineChange}
        onExpandClick={onExpandClick}
      />
    );

    expect(wrapper.find('.headerTitle').text()).toEqual('Structured Data');
    expect(wrapper.find('.schemaMenu').exists()).toEqual(true);
    const engineSelector = wrapper
      .find('.headerActions')
      .find('.engineSelect')
      .first();
    expect(engineSelector.find('input').prop('value')).toEqual(ENGINES[0].id);
    expect(wrapper.find('[aria-label="Expanded View"]').exists()).toEqual(true);
    expect(wrapper.find('table')).toHaveLength(1);
    expect(
      wrapper
        .find('table')
        .find('tbody')
        .find('tr')
    ).toHaveLength(1);
  });

  it('should show structured data object result', () => {
    const structuredDataAsArray = [
      {
        sourceEngineId: ENGINES[1].id,
        sourceEngineName: ENGINES[1].name,
        series: [
          {
            startTimeMs: 0,
            stopTimeMs: 300000,
            structuredData: {
              'c46e4675-73a0-44ce-adca-b6ebab897c21': {
                id: 1234567,
                about: 'about fb feed',
                website: 'veritone.com',
                fan_count: 987654321
              }
            }
          }
        ]
      }
    ];

    const onEngineChange = jest.fn();
    const onExpandClick = jest.fn();

    const wrapper = mount(
      <StructuredDataEngineOutput
        data={structuredDataAsArray}
        schemasById={SCHEMA_BY_ID}
        engines={ENGINES}
        selectedEngineId={ENGINES[1].id}
        onEngineChange={onEngineChange}
        onExpandClick={onExpandClick}
      />
    );

    expect(wrapper.find('.headerTitle').text()).toEqual('Structured Data');
    expect(wrapper.find('.schemaMenu').exists()).toEqual(true);
    const engineSelector = wrapper
      .find('.headerActions')
      .find('.engineSelect')
      .first();
    expect(engineSelector.find('input').prop('value')).toEqual(ENGINES[1].id);
    expect(wrapper.find('[aria-label="Expanded View"]').exists()).toEqual(true);
    expect(wrapper.find('table')).toHaveLength(1);
    expect(
      wrapper
        .find('table')
        .find('tbody')
        .find('tr')
    ).toHaveLength(1);
  });

  it('should hide engine selection when no engines passed', () => {
    const structuredDataAsObject = [
      {
        series: [
          {
            startTimeMs: 0,
            stopTimeMs: 300000,
            structuredData: {
              'c46e4675-73a0-44ce-adca-b6ebab897c21': {
                id: 1234567,
                about: 'about fb feed',
                website: 'veritone.com',
                fan_count: 987654321
              }
            }
          }
        ]
      }
    ];

    const wrapper = mount(
      <StructuredDataEngineOutput
        data={structuredDataAsObject}
        schemasById={SCHEMA_BY_ID}
      />
    );

    expect(wrapper.find('.headerTitle').text()).toEqual('Structured Data');
    expect(wrapper.find('.schemaMenu').exists()).toEqual(true);
    expect(wrapper.find('.engineSelect').exists()).toEqual(false);
    expect(wrapper.find('[ariaLabel="Expanded View"]').exists()).toEqual(false);
    expect(wrapper.find('table')).toHaveLength(1);
    expect(
      wrapper
        .find('table')
        .find('tbody')
        .find('tr')
    ).toHaveLength(1);
  });

  it('should show header and no data table when no data passed in', () => {
    const wrapper = mount(
      <StructuredDataEngineOutput data={[]} schemasById={{}} />
    );

    expect(wrapper.find('.headerTitle').text()).toEqual('Structured Data');
    expect(wrapper.find('.schemaMenu').exists()).toEqual(false);
    expect(wrapper.find('.engineSelect').exists()).toEqual(false);
    expect(wrapper.find('[ariaLabel="Expanded View"]').exists()).toEqual(false);
    expect(wrapper.find('table')).toHaveLength(0);
    expect(
      wrapper
        .find('table')
        .find('tbody')
        .find('tr')
    ).toHaveLength(0);
  });
});
