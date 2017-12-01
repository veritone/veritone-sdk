import React from 'react';
import { storiesOf } from '@storybook/react';

import FileUploadProgressDialog from './';

storiesOf('FileUploadProgressDialog', module)
  .add('Base', () => (
    <FileUploadProgressDialog
      percentComplete={20}
      progressMessage="getting urls"
    />
  ));
