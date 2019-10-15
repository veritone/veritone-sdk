import React from 'react';
import { storiesOf } from '@storybook/react';

import FormPublishModal from './FormPublishModal';

storiesOf('FormBuilder/FormPublishModal', module)
  .add('Show publish modal', () => {
    <FormPublishModal open />
  })
