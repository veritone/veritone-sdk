import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import UploadButton from './';

storiesOf('UploadButton', module)
  .add('Basic', () => <UploadButton onClick={action('onUpload')} />)
