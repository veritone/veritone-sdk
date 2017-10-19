import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import TranscriptSearchModal from './';

storiesOf('TranscriptSearchModal', module).add('Base', () =>
{
  const transcript = {
    id: "guid-1",
    name: "Transcript",
    iconClass: "icon-engine-transcription",
    tooltip: "Search by Keyword",
    enablePill: true,
    showPill: true,
    addPill: () => console.log("show transcript modal")
  }

  const appBarColor = '#4caf50';

  return(
    <div style={{ height: '100%', width: '100%', margin: '5px', background: appBarColor, padding: '0px', display: 'flex', alignItems: 'center' }}>

      <TranscriptSearchModal open={ true }>

      </TranscriptSearchModal>
    </div>
  );
}
);
