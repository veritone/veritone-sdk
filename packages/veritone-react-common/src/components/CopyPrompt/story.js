import React from 'react';
import { storiesOf } from '@storybook/react';

import CopyPrompt from './';

storiesOf('CopyPrompt', module).add('base', () => {
  return (
    <CopyPrompt
      args={[
        'docker tag ',
        { t: `my-task `, color: 'green' },
        { t: `docker.veritone.com/`, color: 'blue' },
        { t: `7682/`, color: 'orange' },
        { t: `my-task`, color: 'green' },
        { t: ':custom-tag', color: 'grey' }
      ]}
    />
  );
});
