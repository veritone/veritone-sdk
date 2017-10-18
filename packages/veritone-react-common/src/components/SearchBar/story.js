import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import SearchBar from './';

storiesOf('SearchBar', module).add('Base', () =>
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
      <div style={{ margin: '0 1em 0 1em', padding: 0 }}>
          <h3>Logo</h3>
      </div>
      <SearchBar color={appBarColor} supportedEngineCategories={[transcript]}>

      </SearchBar>
    </div>
  );
}
);
