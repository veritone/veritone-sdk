import React from 'react';
import { storiesOf } from '@storybook/react';

import MediaDetails from './';

storiesOf('MediaDetails', module)
  .add('Initialized', () => (
    <MediaDetails mediaId={1234567}
                  onClose={() => {console.log('Media Details story onClose clicked.')}}>
    </MediaDetails>
  ));
