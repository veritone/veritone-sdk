import React from 'react';
import { storiesOf } from '@storybook/react';

import SDOTable from 'components/SDOTable';

const sdoData = [
  {
    humidity: 54,
    pressure: 1019,
    windSpeed: 4.7,
    visibility: 16093,
    windDegree: 40,
    datetimeEnd: '2018-02-21T23:00:00.000Z',
    geoLocation: '34.05, -118.24',
    temperature: 55.71,
    locationName: 'Los Angeles',
    datetimeStart: '2018-02-21T22:00:00.000Z',
    temperatureMax: 59,
    temperatureMin: 51.8
  },
  {
    humidity: 100,
    pressure: 1000,
    windSpeed: 4.7,
    visibility: 16093,
    windDegree: 40,
    datetimeEnd: '2018-02-21T23:00:00.000Z',
    geoLocation: '34.05, -118.24',
    temperature: 55.71,
    locationName: 'Los Angeles',
    datetimeStart: '2018-02-21T22:00:00.000Z',
    temperatureMax: 59,
    temperatureMin: 51.8
  }
];

const schemaData = {
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
};

const nestedSdoData = [
  {
    demographics: {
      male: {
        age65: 189290,
        total: 367646,
        age18_24: 0,
        age25_34: 15464,
        age35_49: 32655,
        age50_54: 46684,
        age55_64: 83553
      },
      total: 767342,
      female: {
        age65: 196927,
        total: 399696,
        age18_24: 13434,
        age25_34: 19284,
        age35_49: 42347,
        age50_54: 50906,
        age55_64: 76798
      }
    },
    isAverage: true,
    fileName: 'AVG Calculation',
    networkCode: 'CNN',
    programName: 'UNKNOWN',
    datetimeStart: '2018-02-01T22:00:26.000Z',
    datetimeEnd: '2018-02-01T22:02:28.000Z',
    viewershipType: 'LV7',
    uniqueCode: 'SDO 1'
  },
  {
    demographics: {
      male: {
        age65: 1,
        total: 2,
        age18_24: 3,
        age25_34: 4,
        age35_49: 5,
        age50_54: 6,
        age55_64: 7
      },
      total: 200,
      female: {
        age65: 9,
        total: 10,
        age18_24: 11,
        age25_34: 12,
        age35_49: 13,
        age50_54: 14,
        age55_64: 15
      }
    },
    isAverage: true,
    fileName: 'AVG Calculation',
    networkCode: 'CNN',
    programName: 'UNKNOWN',
    datetimeStart: '2018-02-01T22:00:26.000Z',
    datetimeEnd: '2018-02-01T22:02:28.000Z',
    viewershipType: 'LV7',
    uniqueCode: 'SDO 2'
  }
];

const twoLevelDeepSchemaData = {
  id: { $id: '/properties/id', type: 'string' },
  line: { $id: '/properties/line', type: 'string' },
  dataId: { $id: '/properties/dataId', type: 'string' },
  fileName: { $id: '/properties/fileName', type: 'string' },
  uniqueCode: { $id: '/properties/uniqueCode', type: 'string' },
  datetimeEnd: { $id: '/properties/datetimeEnd', type: 'string' },
  networkCode: {
    $id: '/properties/decorators/properties/networkCode',
    type: 'string'
  },
  programName: { $id: '/properties/programName', type: 'string' },
  demographics: {
    $id: '/properties/demographics',
    type: 'object',
    properties: {
      male: {
        $id: '/properties/demographics/properties/male',
        type: 'object',
        properties: {
          age65: {
            $id: '/properties/demographics/properties/male/properties/age65',
            type: 'integer'
          },
          total: {
            $id: '/properties/demographics/properties/male/properties/total',
            type: 'integer'
          },
          age18_24: {
            $id: '/properties/demographics/properties/male/properties/age18_24',
            type: 'integer'
          },
          age25_34: {
            $id: '/properties/demographics/properties/male/properties/age25_34',
            type: 'integer'
          },
          age35_49: {
            $id: '/properties/demographics/properties/male/properties/age35_44',
            type: 'integer'
          },
          age50_54: {
            $id: '/properties/demographics/properties/male/properties/age50_54',
            type: 'integer'
          },
          age55_64: {
            $id: '/properties/demographics/properties/male/properties/age55_64',
            type: 'integer'
          }
        }
      },
      total: {
        $id: '/properties/demographics/properties/total',
        type: 'integer'
      },
      female: {
        $id: '/properties/demographics/properties/female',
        type: 'object',
        properties: {
          age65: {
            $id: '/properties/demographics/properties/female/properties/age65',
            type: 'integer'
          },
          total: {
            $id: '/properties/demographics/properties/female/properties/total',
            type: 'integer'
          },
          age18_24: {
            $id:
              '/properties/demographics/properties/female/properties/age18_24',
            type: 'integer'
          },
          age25_34: {
            $id:
              '/properties/demographics/properties/female/properties/age25_34',
            type: 'integer'
          },
          age35_49: {
            $id:
              '/properties/demographics/properties/female/properties/age35_49',
            type: 'integer'
          },
          age50_54: {
            $id:
              '/properties/demographics/properties/female/properties/age50_54',
            type: 'integer'
          },
          age55_64: {
            $id:
              '/properties/demographics/properties/female/properties/age55_64',
            type: 'integer'
          }
        }
      }
    }
  },
  datetimeStart: { $id: '/properties/datetimeStart', type: 'string' },
  dataRegistryId: { $id: '/properties/dataRegistryId', type: 'string' },
  viewershipType: { $id: '/properties/viewershipType', type: 'string' }
};

storiesOf('SDO', module).add('SDO Table', () => (
  <SDOTable data={sdoData} schema={schemaData} />
));

storiesOf('SDO', module).add('SDO Table multilevel schema', () => (
  <SDOTable data={nestedSdoData} schema={twoLevelDeepSchemaData} />
));
