import React from 'react';
import { storiesOf } from '@storybook/react';
import { object } from '@storybook/addon-knobs/react';
import { SampleSearchBar } from './component';

storiesOf('SearchBar', module)
  .add('Base', () => {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          margin: '5px',
          background: "blue",
          padding: '0px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div style={{ margin: '0 1em 0 1em', padding: 0 }}>
          <h3>Logo</h3>
        </div>
        <SearchBar
          color={"blue"}
          enabledEngineCategories={enabledEngineCategories}
        />
      </div>
    );
  })
  .add('WithTranscriptPill', () => {
    var searchCallback;
    var toCSPCallback;

    let setSearchHandler = returnedFunction => {
      searchCallback = returnedFunction;

      // bind to the outside world here
      document.getElementById("searchButton").onclick = searchCallback;
    };

    let setToCSPHandler = returnedFunction => {
      toCSPCallback = returnedFunction;

      // bind to the outside world here
      document.getElementById("generateCSPButton").onclick = () => {
        let csp = toCSPCallback();
        console.log(csp);
        console.log(JSON.stringify(csp));
      };
    };

    let csp = {"and":[{"state":{"search":"Lakers","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"},{"or":[{"state":{"search":"Kobe","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"},{"state":{"search":"Lebron","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"},{"state":{"search":"Shaq","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"}]}]};

    const onSearch = (csps) => console.log("User submitted a search", JSON.stringify(csps));

    return [
      <div
        style={{
          height: '45px',
          width: '100%',
          padding: '5px',
          background: "blue",
          padding: '5px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
      <SampleSearchBar
      api="https://api.aws-dev.veritone.com/v1/"
      color={"blue"}
      csp={ object("CSP", csp) }
      onSearch={ onSearch }
      setSearch={ searchCallback => setSearchHandler(searchCallback) }
      toCSP={ toCSPCallback => setToCSPHandler(toCSPCallback) }
      /></div>,
      <button id="searchButton">Search</button>,
      <button id="generateCSPButton">GenerateCSP</button>,

    ] ;
  });
