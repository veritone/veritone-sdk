import React from 'react';
import { storiesOf } from '@storybook/react';

import SelectSchemas from './SelectSchemas';
import SelectAttributes from './SelectAttributes';

storiesOf('InfiniteSelect', module)
  .add('Select Schemas', () => (
    <div style={{ width: '700px' }}>
      <SelectSchemas
        api="https://api.aws-dev.veritone.com/"
        auth="904f5f0e-1f41-4bec-bf13-6d7d0067902a"
      />
    </div>
  ))
  .add('Select Schemas (rehydrated)', () => (
    <div style={{ width: '700px' }}>
      <SelectSchemas
        api="https://api.aws-dev.veritone.com/"
        auth="904f5f0e-1f41-4bec-bf13-6d7d0067902a"
        selected={{
          id: '60212e66-8bf8-4c0f-853a-7d988a01fd89',
          name: 'DMA Population',
          organization: 'Media Demo Organization',
          majorVersion: 1,
        }}
      />
    </div>
  ))
  .add('Select Attributes', () => (
    <div style={{ width: '700px' }}>
      <SelectAttributes
        api="https://api.aws-dev.veritone.com/"
        auth="904f5f0e-1f41-4bec-bf13-6d7d0067902a"
      />
    </div>
  ));
