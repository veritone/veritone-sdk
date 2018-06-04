import React from 'react';
import { mount } from 'enzyme';
import GeoEngineOutput from './';

const sampleData = [
  {
    startTimeMs: 0,
    stopTimeMs: 5000,
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 2500,
        gps: [
          {
            latitude: 1000,
            longitude: 1200
          }
        ]
      },
      {
        startTimeMs: 2501,
        stopTimeMs: 5000,
        gps: [
          {
            latitude: 1050,
            longitude: 1250
          }
        ]
      }
    ]
  },
  {
    startTimeMs: 5001,
    stopTimeMs: 12000,
    series: [
      {
        startTimeMs: 5001,
        stopTimeMs: 7500,
        gps: [
          {
            latitude: 1100,
            longitude: 1100
          }
        ]
      },
      {
        startTimeMs: 7501,
        stopTimeMs: 12000,
        gps: [
          {
            latitude: 1500,
            longitude: 1500
          }
        ]
      }
    ]
  }
];

describe('Geo Engine Output', () => {
  const geoEngineOutput = mount(
    <GeoEngineOutput
      data={sampleData}
      engines={[{ id: '1', name: 'Engine-X' }, { id: '2', name: 'Engine-Y' }]}
      selectedEngineId="1"
      startTimeStamp="2018-01-31T20:03:45.000Z"
    />
  );

  it('Missing EngineOutputHeader', () => {
    expect(geoEngineOutput.find('EngineOutputHeader')).toHaveLength(1);
  });

  it('Missing Map View', () => {
    expect(geoEngineOutput.find('GeoMapView')).toHaveLength(1);
  });

  it('Missing Time View', () => {
    const timeView = geoEngineOutput.setState({ currentView: 'timeView' });
    expect(timeView.find('GeoTimeView')).toHaveLength(1);
  });

  it('Invalid Entries', () => {
    const timeView = geoEngineOutput.setState({ currentView: 'timeView' });
    const entries = timeView.find('GeoTimeEntry');
    expect(entries).toHaveLength(4);

    const gpsEntries = timeView.find('.gps');
    expect(gpsEntries.at(0).text()).toMatch(/Lat:\s1000Long:\s1200/);
    expect(gpsEntries.at(1).text()).toMatch(/Lat:\s1050Long:\s1250/);
    expect(gpsEntries.at(2).text()).toMatch(/Lat:\s1100Long:\s1100/);
    expect(gpsEntries.at(3).text()).toMatch(/Lat:\s1500Long:\s1500/);

    const textButtons = timeView.find('TextButton');
    expect(textButtons.at(0).text()).toEqual('12:03:45 PM - 12:03:47 PM');
    expect(textButtons.at(1).text()).toEqual('12:03:47 PM - 12:03:50 PM');
    expect(textButtons.at(2).text()).toEqual('12:03:50 PM - 12:03:52 PM');
    expect(textButtons.at(3).text()).toEqual('12:03:52 PM - 12:03:57 PM');
  });
});
