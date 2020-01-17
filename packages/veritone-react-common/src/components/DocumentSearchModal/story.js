import React from 'react';
import { storiesOf } from '@storybook/react';
import { DocumentSearchModal } from './';
import { TranscriptSearchForm } from './';

import { boolean, object } from '@storybook/addon-knobs';

storiesOf('DocumentSearchModal', module).add('withOpenDialogAndDefaultValue', () => {
  const logFilter = value => console.log('filter value', value);
  const cancel = () => console.log("cancel pressed");
  return (
    <DocumentSearchModal
      open={boolean("Open", true)}
      modalState={object("Search condition state", { "value": ('Lakers') })}
      cancel={cancel}
      applyFilter={logFilter}
    />
  );
}).add('withoutDialog', () => {
  return (
    <TranscriptSearchForm
      defaultValue={"lakers"}
    />
  );
});
