import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FilePicker from './';

const pickerOptions = {
    accept: ['.png', 'png'],
    height: 400,
    width: 600
}

storiesOf('FilePicker', module)
    .add('Base', () => (
        <FilePicker isOpen={true} 
                    onUploadFiles={action('upload files')}
                    onCloseModal={action('close modal')}/>
    ))
    .add('With Options', () => (
        <FilePicker isOpen={true} 
                    options={pickerOptions}
                    onUploadFiles={action('upload files')}
                    onCloseModal={action('close modal')}/>
    ));