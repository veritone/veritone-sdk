import React from 'react';
import { storiesOf } from '@storybook/react';

import inVeritoneApp from '../../shared/StoreProvider';

import { forms } from './FormTable.story.js';
import { templates } from './TemplateListPage.story.js';
import FormListPage from './FormListPage';

const ReduxFormListPage = inVeritoneApp(FormListPage);

storiesOf('FormBuilder/FormListPage', module)
  .add('Show forms and templates', () => (
    <ReduxFormListPage
      templates={templates}
      forms={forms}
    />
  ))
