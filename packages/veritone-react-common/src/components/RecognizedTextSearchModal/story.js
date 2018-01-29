import React from 'react';
import { storiesOf } from '@storybook/react';
import { RecognizedTextSearchModal } from './';
import { RecognizedTextSearchForm } from './';

import { boolean, object } from '@storybook/addon-knobs';

storiesOf('RecognizedTextSearchModal', module).add('withOpenDialogAndDefaultValue', () => {
  const logFilter = value => console.log('filter value', value);
  const cancel = () => console.log("cancel pressed");
  return (
    <RecognizedTextSearchModal
      open={boolean("Open", true)}
      modalState={ object( "Search condition state", { "value": ('Hakuna Matata') } ) }
      cancel={ cancel }
      applyFilter={logFilter}
    />
  );
}).add( 'withoutDialog', () => {
  return (
    <RecognizedTextSearchForm
      defaultValue={"Hakuna Matata"}
    />
  );
});
