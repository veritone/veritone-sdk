import React from 'react';
import { storiesOf } from '@storybook/react';
import { FaceSearchModal } from './';
import { FaceSearchForm } from './';

import { boolean, object } from '@storybook/addon-knobs';

storiesOf('FaceSearchModal', module).add('withOpenDialogAndDefaultValue', () => {
  const logFilter = value => console.log('filter value', value);
  const cancel = () => console.log("cancel pressed");
  return (
    <FaceSearchModal
      open={ boolean("Open", true) }
      modalState={ object( "Search condition state", { queryResults: [] } ) }
      cancel={ cancel }
      applyFilter={ logFilter }
    />
  );
}).add( 'withoutDialog', () => {
  return (
    <FaceSearchForm
      modalState={ object( "Search condition state", { queryResults: [] } ) }
    />
  );
});
