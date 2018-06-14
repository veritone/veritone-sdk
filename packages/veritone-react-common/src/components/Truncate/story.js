import React from 'react';
import { storiesOf } from '@storybook/react';

import Truncate from './';

storiesOf('Truncate', module).add('Base', () => {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In mi lectus, tincidunt at arcu eget, sodales pellentesque urna. Mauris commodo diam nisi, vitae porttitor urna euismod sagittis. Phasellus vitae felis sit amet quam mollis lobortis. Sed at enim molestie, lacinia felis id, pulvinar tortor. Maecenas a tincidunt urna. Vivamus nec sodales tortor. Morbi diam dui, dapibus quis ante ut, sollicitudin euismod nunc. Aliquam a volutpat purus. Pellentesque aliquet blandit porta. Morbi in elit pharetra, condimentum leo vel, rhoncus mi. Aenean accumsan tortor eget quam aliquet, ut aliquet ipsum finibus. Praesent dictum auctor libero a iaculis.`;
  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Truncate clamp={1}>{text}</Truncate>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <Truncate clamp={2}>{text}</Truncate>
      </div>
      <div>
        <Truncate clamp={3}>{text}</Truncate>
      </div>
    </div>
  );
});
