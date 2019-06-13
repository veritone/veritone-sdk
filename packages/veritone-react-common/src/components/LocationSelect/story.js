import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import LocationSelect from './';

const selectedLocationId = 'full';
const listLocation = [
    {
        name: 'Top Banner',
        id: 'top'
    },{
        name: 'Full Frame',
        id: 'full'
    },{
        name: 'Bottom Third',
        id: 'bottom'
    }
]
const onSelectLocation = (value) => {
    console.log(value);
}


storiesOf('LocationSelect', module)
    .add('Simple test', () => <LocationSelect selectedLocationId={selectedLocationId} listLocation={listLocation} onSelectLocation={onSelectLocation}/>);

