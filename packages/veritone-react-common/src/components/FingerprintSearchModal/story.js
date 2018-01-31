import React from 'react';
import { storiesOf } from '@storybook/react';
import { FingerprintSearchModal } from './';
import { FingerprintSearchForm } from './';

import { boolean, object } from '@storybook/addon-knobs';

storiesOf('FingerprintSearchModal', module).add('withOpenDialogAndDefaultValue', () => {
  const logFilter = value => console.log('filter value', value);
  const cancel = () => console.log("cancel pressed");
  return (
    <FingerprintSearchModal
      open={ boolean("Open", true) }
      modalState={ object( "Search condition state", { queryResults: [] } ) }
      cancel={ cancel }
      applyFilter={ logFilter }
    />
  );
}).add( 'withoutDialog', () => {
  return (
    <FingerprintSearchForm
      modalState={ object( "Search condition state", { queryResults: [] } ) }
    />
  );
});
