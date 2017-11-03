import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import TranscriptSearchModal from './';

storiesOf('TranscriptSearchModal', module).add('Base', () =>
{
  return(
    <TranscriptSearchModal open={ true } applyFilter={ (value) => console.log("filter value", value) }>

    </TranscriptSearchModal>
  );
}
)
