import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import RaisedTextField from './';

storiesOf('RaisedTextField', module).add('with text', () => (
  <RaisedTextField>Hello Button</RaisedTextField>
));
