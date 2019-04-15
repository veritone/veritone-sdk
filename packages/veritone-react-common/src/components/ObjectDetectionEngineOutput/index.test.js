import React from 'react';
import { mount } from 'enzyme';

import ObjectDetectionEngineOutput from 'components/ObjectDetectionEngineOutput';
import EngineOutputHeader from 'components/EngineOutputHeader';

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
        },
        {
          startTimeMs: 2000,
          stopTimeMs: 3000,
          object: {
            label: 'next_data',
            confidence: 0.892457377910614
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

  it('should render each virtual list', () => {
    const wrapper = mount(<ObjectDetectionEngineOutput data={data} />);

    expect(wrapper.find('List').length).toEqual(1);
  });

  it('should call props.onObjectClick when an object pill is clicked', () => {
    const handler = jest.fn();
    const wrapper = mount(
      <ObjectDetectionEngineOutput data={data} onObjectClick={handler} />
    );

    wrapper
      .find('.objectPill')
      .first()
      .simulate('click');
    expect(handler).toHaveBeenCalledWith(0, 2000);
  });
});
