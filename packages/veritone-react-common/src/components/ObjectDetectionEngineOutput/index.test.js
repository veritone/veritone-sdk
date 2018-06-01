import React from 'react';
import { shallow, mount } from 'enzyme';

import ObjectDetectionEngineOutput from 'components/ObjectDetectionEngineOutput';
import EngineOutputHeader from 'components/EngineOutputHeader';
import ObjectGroup from 'components/ObjectDetectionEngineOutput/ObjectGroup';

describe('ObjectDetectionEngineOutput', () => {
  const data = [
    {
      startTimeMs: 0,
      stopTimeMs: 2000,
      sourceEngineId: '2dc5166f-c0ad-4d84-8a85-515c42b5d357',
      series: [
        {
          startTimeMs: 0,
          stopTimeMs: 2000,
          object: {
            label: 'data',
            confidence: 0.942457377910614
          }
        }
      ]
    },
    {
      startTimeMs: 2000,
      stopTimeMs: 3000,
      sourceEngineId: '2dc5166f-c0ad-4d84-8a85-515c42b5d357',
      series: [
        {
          startTimeMs: 2000,
          stopTimeMs: 3000,
          object: {
            label: 'computer',
            confidence: 0.942457377910614
          }
        }
      ]
    }
  ];

  it('should render the EngineOutputHeader', () => {
    const wrapper = mount(<ObjectDetectionEngineOutput data={data} />);

    expect(wrapper.contains(EngineOutputHeader)).toEqual(true);
  });

  it('should render each ObjectGroup passed in the data array', () => {
    const wrapper = shallow(<ObjectDetectionEngineOutput data={data} />);

    expect(wrapper.find(ObjectGroup).length).toEqual(2);
    expect(
      wrapper.containsAllMatchingElements([
        /* eslint-disable react/jsx-key */
        <ObjectGroup objectGroup={data[0]} />,
        <ObjectGroup objectGroup={data[1]} />
      ])
    ).toBeTruthy();
  });

  it('should call props.onObjectOccurrenceClick when an object pill is clicked', () => {
    const handler = jest.fn();
    const wrapper = shallow(
      <ObjectDetectionEngineOutput
        data={data}
        onObjectOccurrenceClick={handler}
      />
    );

    wrapper
      .find(ObjectGroup)
      .get(0)
      .props.onObjectClick(0, 2000);
    expect(handler).toHaveBeenCalledWith(0, 2000);
  });
});
