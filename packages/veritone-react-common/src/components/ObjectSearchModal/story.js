import React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectSearchModal } from './';
import { ObjectSearchForm } from './';

import { boolean, object } from '@storybook/addon-knobs';

storiesOf('ObjectSearchModal', module).add('withOpenDialogAndDefaultValue', () => {
  const logFilter = value => console.log('filter value', value);
  const fetchAutocomplete = new Promise(() => [{header: 'Fake Header', items: [{ label: 'Fake Label 1', description: 'Fake Description 1'}]}]);
  const cancel = () => console.log("cancel pressed");
  return (
    <ObjectSearchModal
      open={ boolean("Open", true) }
      modalState={ object( "Search condition state", { queryResults: [] } ) }
      fetchAutocomplete={ fetchAutocomplete }
      cancel={ cancel }
      applyFilter={ logFilter }
    />
  );
}).add( 'withoutDialog', () => {
  return (
    <ObjectSearchForm
      modalState={ object( "Search condition state", { queryResults: [] } ) }
    />
  );
});
