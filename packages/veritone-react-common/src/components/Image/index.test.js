import React from 'react';
import { mount } from 'enzyme';

import Image from './';

describe('Image', () => {
  const TEST_IMG =
    'https://pp.userapi.com/c624631/v624631866/38602/miSZV1RlzEY.jpg';

  it('Image should be rendered in a div tag.', () => {
    const wrapper = mount(<Image src={TEST_IMG} />);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.props().src).toBe(TEST_IMG);
    expect(wrapper.children().props().style.backgroundImage).toBe(
      `url(${TEST_IMG})`
    );
  });

  it('Image Height/Width should have default values if undefined.', () => {
    const wrapper = mount(<Image src={TEST_IMG} />);
    expect(wrapper.children().props().style.height).toBeDefined();
    expect(wrapper.children().props().style.width).toBeDefined();
  });

  it('Image Height/Width can be set to custom sizes.', () => {
    const HEIGHT = '123px',
      WIDTH = '321px';
    const wrapper = mount(
      <Image src={TEST_IMG} height={HEIGHT} width={WIDTH} />
    );
    expect(wrapper.children().props().style.height).toBe(HEIGHT);
    expect(wrapper.children().props().style.width).toBe(WIDTH);
  });

  it('Image Border can be enabled', () => {
    const wrapper = mount(<Image src={TEST_IMG} border />);
    expect(wrapper.children().props().style.border).toBe('1px solid #E4E4E4');
  });
});
