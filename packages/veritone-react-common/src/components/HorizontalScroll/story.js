import React from 'react';
import { storiesOf } from '@storybook/react';

import HorizontalScroll from './';

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

storiesOf('HorizontalScroll', module).add('Base', () => {
  return (
    <div style={{ width: '200px', display: 'flex' }}>
      <HorizontalScroll
        leftScrollButton={<LeftScrollButton />}
        rightScrollButton={<RightScrollButton />}
      >
        <HorizontalContent />
      </HorizontalScroll>
    </div>
  );
});
