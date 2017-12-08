import React from 'react';
import { storiesOf } from '@storybook/react';

import update from 'immutability-helper';

import {
  TranscriptSearchModal,
  TranscriptDisplay,
  TranscriptConditionGenerator
} from 'components/TranscriptSearchModal';
import SearchBarContainer from './SearchBarContainer';
import { SearchBar } from '.';

const transcript = {
  id: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
  name: 'Transcript',
  iconClass: 'icon-engine-transcription',
  tooltip: 'Search by Keyword',
  enablePill: true,
  showPill: true
};

const appBarColor = '#4caf50';

const enabledEngineCategories = [transcript];

const engineCategoryMapping = {
  '67cd4dd0-2f75-445d-a6f0-2f297d6cd182': {
    modal: TranscriptSearchModal,
    getLabel: TranscriptDisplay,
    generateCondition: TranscriptConditionGenerator
  }
};

const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}-${s4()}-${s4()}`;
};

export default class SampleSearchBar extends React.Component {
  state = {
    searchParameters: []
  };

  addOrModifySearchParameter = parameter => {
    const index = this.state.searchParameters.findIndex(
      searchParameter => searchParameter.id === parameter.id
    );
    if (index !== -1) {
      const newSearchParameters = update(this.state.searchParameters, {
        $splice: [[index, 1, parameter]]
      });
      console.log('Modifying search parameter at index', index);
      console.log('New search parameters', newSearchParameters);
      this.setState(prevState => ({
        searchParameters: newSearchParameters
      }));
    } else {
      console.log('Adding a new search parameter', parameter);
      const newSearchParameter = { ...parameter, id: guid() };
      this.setState(prevState => ({
        searchParameters: [...prevState.searchParameters, newSearchParameter]
      }));
    }
  };

  removeSearchParameter = id => {
    this.setState(prevState => ({
      searchParameters: prevState.searchParameters.filter(x => x.id !== id)
    }));
    console.log('Removing search parameter', id);
  };

  searchQueryGenerator = () => {
    const baseQuery = {
      index: ['mine', 'global'],
      query: {
        operator: 'and',
        conditions: []
      },
      limit: 20,
      offset: 0
    };

    const searchEngineCategoriesQuery = {
      operator: 'and',
      conditions: []
    };

    let searchCall = { ...baseQuery };
    let searchCategoryFilters = { ...searchEngineCategoriesQuery };

    this.state.searchParameters.map(searchParameter => {
      searchCategoryFilters.conditions.push(
        engineCategoryMapping[searchParameter.engineId].generateCondition(
          searchParameter
        )
      );
    });
    searchCall.query.conditions.push(searchCategoryFilters);

    console.log('V3 Query', searchCall);
  };

  extendEngineCategories = engineCategories => {
    const engineCategoriesWithFunctions = engineCategories.map(
      engineCategory => {
        if (engineCategory.id in engineCategoryMapping) {
          return {
            ...engineCategory,
            ...engineCategoryMapping[engineCategory.id]
          };
        }
      }
    );
    return engineCategoriesWithFunctions;
  };

  render() {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          background: appBarColor,
          padding: '0px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div style={{ margin: '0 1em 0 1em', padding: 0 }}>
          <h3>Logo</h3>
        </div>
        <SearchBarContainer
          color={appBarColor}
          enabledEngineCategories={this.extendEngineCategories(
            enabledEngineCategories
          )}
          searchParameters={this.state.searchParameters}
          addOrModifySearchParameter={this.addOrModifySearchParameter}
          removeSearchParameter={this.removeSearchParameter}
        />
        <button onClick={this.searchQueryGenerator}>Search</button>
      </div>
    );
  }
}

storiesOf('SearchBar', module)
  .add('Base', () => {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          margin: '5px',
          background: appBarColor,
          padding: '0px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div style={{ margin: '0 1em 0 1em', padding: 0 }}>
          <h3>Logo</h3>
        </div>
        <SearchBar
          color={appBarColor}
          enabledEngineCategories={enabledEngineCategories}
        />
      </div>
    );
  })
  .add('WithTranscriptPill', () => {
    return <SampleSearchBar />;
  });
