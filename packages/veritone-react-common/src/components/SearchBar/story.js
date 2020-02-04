import React from 'react';
import { storiesOf } from '@storybook/react';
import { object } from '@storybook/addon-knobs/react';
import { SampleSearchBar } from './component';
// import searchQueryGenerator from '../../../../veritone-csp-generator/index'

storiesOf('SearchBar', module).add('WithTranscriptPill', () => {
  let searchCallback;
  let toCSPCallback;

  const setSearchHandler = returnedFunction => {
    searchCallback = returnedFunction;

    // bind to the outside world here
    document.getElementById('searchButton').onclick = searchCallback;
  };

  const setToCSPHandler = returnedFunction => {
    toCSPCallback = returnedFunction;

    // bind to the outside world here
    document.getElementById('generateCSPButton').onclick = () => {
      const csp = toCSPCallback();
      console.log(csp);
      console.log(JSON.stringify(csp, null, 2));
    };
  };

  const csp = {
    and: [
      {
        state: { search: 'Lakers', language: 'en' },
        engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
      },
      {
        or: [
          {
            state: { search: 'Kobe', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
          },
          {
            state: { search: 'Lebron', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
          },
          {
            state: { search: 'Shaq', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
          },
        ],
      },
    ],
  };

  const onSearch = cspText => console.log('onSearch', JSON.stringify(cspText));

  return (
    <React.Fragment>
      <div
        style={{
          height: '45px',
          width: '900px',
          marginLeft: '50px',
          padding: '5px',
          background: '#2196f3',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <SampleSearchBar
          api="https://api.aws-dev.veritone.com/"
          color={'#2196f3'}
          csp={object('CSP', csp)}
          onSearch={onSearch}
          setSearch={searchCallbackText => setSearchHandler(searchCallbackText)}
          toCSP={toCSPCallbackText => setToCSPHandler(toCSPCallbackText)}
          menuActions={[
            {
              label: 'Process CSP',
              onClick: cspText => console.log('Process CSP', cspText),
            },
          ]}
        />
      </div>
      <button id="searchButton">Search</button>
      <button id="generateCSPButton">GenerateCSP</button>
    </React.Fragment>
  );
});
