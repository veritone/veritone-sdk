import React from 'react';
import { storiesOf } from '@storybook/react';

import TemplateListPage from './TemplateListPage';

export const templates = [
  {
    id: '1',
    name: 'Notification',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    isTemplate: true,
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '2',
    name: 'Nielsen Data Per Order',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    isTemplate: true,
    lastModified: '2019-01-25T01:18:09.254Z'
  },
  {
    id: '3',
    name: 'Veritone Transcription Benchmark Results',
    imageUrl: 'https://static.veritone.com/veritone-ui/default-nullstate.svg',
    isTemplate: true,
    lastModified: '2019-01-25T01:18:09.254Z'
  }
]

storiesOf('FormBuilder/TemplateList', module)
  .add('Show templates', () => (
    <TemplateListPage
      templates={templates}
      page={0}
      rowsPerPage={5}
    />
  ))
