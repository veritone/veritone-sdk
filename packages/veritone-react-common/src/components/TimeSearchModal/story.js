import React from 'react';
import { storiesOf } from '@storybook/react';
import { TimeSearchModal } from './';
import { TimeSearchForm } from './';

import { boolean, object } from '@storybook/addon-knobs';

storiesOf('TimeSearchModal', module).add('withOpenDialogAndDefaultValue', () => {
  const logFilter = value => console.log('filter value', value);
  const cancel = () => console.log("cancel pressed");
  return (
    <TimeSearchModal
      open={boolean("Open", true)}
      cancel={ cancel }
      applyFilter={logFilter}
    />
  );
}).add( 'withoutDialog', () => {
  return (
    <TimeSearchForm
    />
  );
});
