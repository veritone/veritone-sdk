import React from 'react';
import { storiesOf } from '@storybook/react';
import Paper from '@material-ui/core/Paper';
import { StructuredDataModal } from './index';

storiesOf('StructuredDataModal', module).add(
  'withOpenDialogAndDefaultValue',
  () => (
    <Paper style={{ width: '750px', height: '300px' }}>
      <StructuredDataModal />
      {/*
      <StructuredDataModal
        open={boolean("Open", true)}
        modalState={ object( "Search condition state", { "value": ('Lakers') } ) }
        cancel={ cancel }
        applyFilter={logFilter}
      /> */}
    </Paper>
  )
);
