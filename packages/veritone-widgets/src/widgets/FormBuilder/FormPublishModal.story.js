import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import FormPublishModal from './FormPublishModal';

function FormPublishModalWithLocations(props) {
  const [selectedLocations, setSelectedLocations] = React.useState({});

  return (
    <FormPublishModal
      {...props}
      selectedLocations={selectedLocations}
      onChange={setSelectedLocations}
    />
  )
}

storiesOf('FormBuilder/FormPublishModal', module)
  .add('with no location', () => (
    <FormPublishModal
      open
      fetchLocations={action('fetch location')}
      locationLoading={boolean('locationLoading', false)}
      loactionLoaded={boolean('locationLoaded', false)}
    />
  ))
  .add('with locations', () => (
    <FormPublishModalWithLocations
      open
      fetchLocations={action('fetch location')}
      locationLoading={boolean('locationLoading', false)}
      loactionLoaded={boolean('locationLoaded', false)}
      locations={
        [
          {
            id: '1',
            name: 'Ingestion Jobs',
          },
          {
            id: '2',
            name: 'CMS folders',
          },
          {
            id: '3',
            name: 'CMS sources',
          },
          {
            id: '4',
            name: 'Mention details',
          },
        ]
      }
    />
  ))
