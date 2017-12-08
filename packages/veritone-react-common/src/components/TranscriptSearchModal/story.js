import React from 'react';
import { storiesOf } from '@storybook/react';
import { TranscriptSearchModal } from './';
import { TranscriptSearchForm } from './';

import { boolean, object } from '@storybook/addon-knobs';

storiesOf('TranscriptSearchModal', module).add('withOpenDialogAndDefaultValue', () => {
  const logFilter = value => console.log('filter value', value);
  const cancel = () => console.log("cancel pressed");
  return (
    <TranscriptSearchModal
      open={boolean("Open", true)}
      modalState={ object( "Search condition state", { "value": ('Lakers') } ) }
      cancel={ cancel }
      applyFilter={logFilter}
    />
  );
}).add( 'withoutDialog', () => {
  return (
    <TranscriptSearchForm
      defaultValue={"lakers"}
    />
  );
});
