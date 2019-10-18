import React from 'react';
import { storiesOf } from '@storybook/react';

import FormListPage from './FormListPage';

const templates = [
  {
    id: '1',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg'
  },
  {
    id: '2',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg'
  },
  {
    id: '3',
    name:  'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg'
  }
]

storiesOf('FormBuilder/FormListPage', module)
  .add('Show forms and templates', () => (
    <FormListPage
      templates={templates}
    />
  ))