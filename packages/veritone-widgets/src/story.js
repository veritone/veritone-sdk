import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { AppBar } from 'veritone-react-common';

storiesOf('VeritoneApp', module)
  .add('Base', () => (
    <AppBar title="test" />
    )
  );
