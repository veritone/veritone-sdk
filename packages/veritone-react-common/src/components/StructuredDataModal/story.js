import React from 'react';
import { storiesOf } from '@storybook/react';
import { StructuredDataModal } from './';

import { boolean, object } from '@storybook/addon-knobs';
import Paper from 'material-ui/Paper';

storiesOf('StructuredDataModal', module).add('withOpenDialogAndDefaultValue', () => {
  const logFilter = value => console.log('filter value', value);
  const cancel = () => console.log("cancel pressed");
  return (
    <Paper style={ { width: "750px", height: "300px" } }>
      <StructuredDataModal />
      { /*
      <StructuredDataModal
        open={boolean("Open", true)}
        modalState={ object( "Search condition state", { "value": ('Lakers') } ) }
        cancel={ cancel }
        applyFilter={logFilter}
      /> */ }
    </Paper>
  );
});
