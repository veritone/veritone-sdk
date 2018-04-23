import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import VeritoneApp from '../../shared/VeritoneApp';
import SDOTableWidget from './';

const data = [
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

const schema = {
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

class Story extends React.Component {
  componentDidMount() {
    this._sdoTableWidget = new SDOTableWidget({
      elId: 'sdo-table-widget',
      title: 'SDOTableWidget Widget',
      data,
      schema
    });
  }

  componentWillUnmount() {
    this._sdoTableWidget.destroy();
  }

  render() {
    return (
      <div>
        <span id="sdo-table-widget" />
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('SDO Table', module).add('Base', () => {
  const sessionToken = text('Api Session Token', '');

  return <Story sessionToken={sessionToken} store={app._store} />;
});
