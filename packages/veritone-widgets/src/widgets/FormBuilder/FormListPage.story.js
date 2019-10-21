import React from 'react';
import { storiesOf } from '@storybook/react';

import { forms } from './FormTable.story.js';
import { templates } from './TemplateListPage.story.js';
import FormListPage from './FormListPage';

storiesOf('FormBuilder/FormListPage', module)
  .add('Show forms and templates', () => (
    <FormListPage
      templates={templates}
      forms={forms}
    />
  ))