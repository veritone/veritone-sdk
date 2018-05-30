import React from 'react';
import { mount } from 'enzyme';

import PillButton from 'components/share-components/buttons/PillButton';
import ObjectGroup from './index';

describe('ObjectGroup', () => {
  const objectGroup = {
    startTimeMs: 0,
    stopTimeMs: 2000,
    sourceEngineId: '2dc5166f-c0ad-4d84-8a85-515c42b5d357',
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 1000,
        object: {
          label: 'computer',
          confidence: 0.942457377910614
        }
      },
      {
        stopTimeMs: 1000,
        startTimeMs: 0,
        object: {
          label: 'very long name 32 char abbreviated',
          confidence: 0.8848179578781128
        }
      },
      {
        stopTimeMs: 2000,
        startTimeMs: 1000,
        object: {
          label: 'data',
          confidence: 0.942457377910614
        }
      }
    ]
  };

  it('should render an array of object pills', () => {
    const wrapper = mount(<ObjectGroup objectGroup={objectGroup} />);

    expect(
      wrapper.containsAllMatchingElements([
        /* eslint-disable react/jsx-key */
        <PillButton label="data" />,
        <PillButton label="computer" />,
        <PillButton label="very long name 32 char abbreviated" />
      ])
    ).toBeTruthy();
  });

  it(
    'should highlight all object pills where currentMediaPlayerTime is ' +
      'between start and stop',
    () => {
      const wrapper = mount(
        <ObjectGroup objectGroup={objectGroup} currentMediaPlayerTime={500} />
      );

      expect(wrapper.find(PillButton).find('.highlighted').length).toEqual(2);
    }
  );

  it('should call onObjectClick when an object is clicked', () => {
    const handler = jest.fn();
    const wrapper = mount(
      <ObjectGroup
        objectGroup={objectGroup}
        currentMediaPlayerTime={500}
        onObjectClick={handler}
      />
    );

    wrapper
      .find(PillButton)
      .first()
      .simulate('click');
    expect(handler).toHaveBeenCalledWith(0, 1000);
  });
});
