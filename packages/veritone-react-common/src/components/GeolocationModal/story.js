import React from 'react';
import { storiesOf } from '@storybook/react';
import { GeolocationModal } from './';

import { boolean, object } from '@storybook/addon-knobs';

storiesOf('GeolocationModal', module).add('withOpenDialogAndDefaultValue', () => {
  const logFilter = value => console.log('filter value', value);
  const cancel = () => console.log("cancel pressed");
  return (
    <GeolocationModal
      open={boolean("Open", true)}
      modalState={ object( "Search condition state") }
      cancel={ cancel }
      applyFilter={logFilter}
    />
  );
})
