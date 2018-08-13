import React from 'react';
import { storiesOf } from '@storybook/react';
import StatusPill from './';

const status = ['active', 'inactive', 'paused', 'processing'];

const Pills = () => {
  return (
    <div>
      {status.map(s => (
        <div key={s} style={{ padding: '15px' }}>
          <StatusPill status={s} />
        </div>
      ))}
    </div>
  );
};

storiesOf('Status Pill', module).add('Base', () => <Pills />);
