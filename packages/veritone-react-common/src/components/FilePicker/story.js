import React from 'react';
import { storiesOf } from '@storybook/react';

import FilePicker from './';

const pickerOptions = {
    accept: 'image/*',
    height: 400,
    width: 600
}

storiesOf('FilePicker', module)
    .add('Base', () => (
        <FilePicker isOpen={true} options={pickerOptions} accept={["image/*"]}/>
    ));