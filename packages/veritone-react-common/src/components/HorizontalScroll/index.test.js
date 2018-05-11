import React from 'react';
import { shallow } from 'enzyme';

import HorizontalScroll from './';

describe('Horizontal Scroll', function() {
  const HorizontalContent = () => {
    return (
      <div
        style={{
          width: '500px',
          height: '45px',
          background: 'linear-gradient(to right, blue, green)'
        }}
      >
        content goes here
      </div>
    );
  };

  const LeftScrollButton = () => <div>{'<'}</div>;

  const RightScrollButton = () => <div>{'>'}</div>;

  it('exists', function() {
    const wrapper = shallow(
      <HorizontalScroll
        leftScrollButton={<LeftScrollButton />}
        rightScrollButton={<RightScrollButton />}
      >
        <HorizontalContent />
      </HorizontalScroll>
    );
    expect(wrapper.length).toBeTruthy();
  });

  it('renders the scroll content', function() {
    const wrapper = shallow(
      <HorizontalScroll
        leftScrollButton={<LeftScrollButton />}
        rightScrollButton={<RightScrollButton />}
      >
        <HorizontalContent />
      </HorizontalScroll>
    );
    expect(wrapper.find(HorizontalContent)).toBeTruthy();
  });
});
