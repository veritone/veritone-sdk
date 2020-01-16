import React from 'react';
import { storiesOf } from '@storybook/react';
import { StructuredDataModal } from './';
import Paper from '@material-ui/core/Paper';

storiesOf('StructuredDataModal', module).add('withOpenDialogAndDefaultValue', () => {
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
