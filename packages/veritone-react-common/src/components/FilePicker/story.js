import React from 'react';
import { storiesOf } from '@storybook/react';

import FilePicker from './';

storiesOf('FilePicker', module)
    .add('Base', () => (
        <FilePicker />
    ));