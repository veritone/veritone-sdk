import React from 'react';
import { storiesOf } from '@storybook/react';
import { object } from '@storybook/addon-knobs/react';

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
  componentDidMount() {
    if (this.props.setSearch) this.props.setSearch(this.searchQueryGenerator);
    if(this.props.toCSP) this.props.toCSP( () => this.convertSearchParametersToCSP(this.state.searchParameters));
  }

  state = {
    searchParameters: this.props.searchParameters && this.props.searchParameters.csp || []
  };

  convertSearchParametersToCSP = searchParameters => {
    const CSP = (parameter) => { return { state: parameter.value, engineCategoryId: parameter.conditionType } }

    const baseQuery = {}
    let lastJoin = searchParameters[1].value || 'AND';
    let lastNode = [];
    baseQuery[searchParameters[1].value] = lastNode;

    for(let i = 0; i < searchParameters.length - 1; i++) {
      const searchParameter = searchParameters[i];
      if(searchParameters[i].conditionType !== 'join' && searchParameters[i+1].value !== lastJoin) {
        const nextNode = {};
        nextNode[searchParameters[i+1].value] = [ CSP(searchParameters[i]) ];
        lastNode.push( nextNode );
        lastNode = nextNode[searchParameters[i+1].value];
        lastJoin = searchParameters[i+1].value;
      } else {
        if(searchParameters[i].conditionType !== 'join') {
          lastNode.push(CSP(searchParameter))
        }
      }
    }
    return baseQuery;
  }


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
      console.log('Existing search parameters', this.state.searchParameters);
      const newSearchParameter = { ...parameter, id: guid() };
      console.log('Adding a new search parameter', newSearchParameter);
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
        engineCategoryMapping[searchParameter.conditionType].generateCondition(
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

    const CSPToSearchParameters = cognitiveSearchProfile => {
      const getJoinOperator = ( query ) => {
        const operators = Object.keys(query);
        return operators[0];
      }

      const searchParameters = [];
      let joinOperator = getJoinOperator(cognitiveSearchProfile);
      let conditions = cognitiveSearchProfile[joinOperator];

      for(let i = 0; i < conditions.length; i++) {

        if('engineCategoryId' in conditions[i]) {
          const newSearchPill = { id: guid(), conditionType: conditions[i].engineCategoryId, value: conditions[i].state }
          searchParameters.push( newSearchPill );
          const newJoinOperator = { id: guid(), conditionType: 'join', value: joinOperator };
          searchParameters.push( newJoinOperator );
        } else {
          searchParameters.pop();
          joinOperator = getJoinOperator(conditions[i])
          const newJoinOperator = { id: guid(), conditionType: 'join', value: joinOperator };
          searchParameters.push( newJoinOperator );
          conditions = conditions[i][joinOperator];
          i = -1;
        }
      }

      // make sure there's always a joining parameter at the end
      if(searchParameters[searchParameters.length -1].conditionType !== 'join') {
        lastNode.push({ id: guid(), conditionType: 'join', value: joinOperator });
      }

      return searchParameters;
    }

    let csp = {"AND":[{"state":{"search":"Lakers","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"},{"state":{"search":"Celtics","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"},{"OR":[{"state":{"search":"Kobe","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"},{"state":{"search":"Shaq","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"}]}]};
    let searchParameters = CSPToSearchParameters(csp);

    console.log(JSON.stringify(searchParameters));

    return [<SampleSearchBar
      searchParameters={ object("CSP", {csp: searchParameters}) }
      setSearch={ searchCallback => setSearchHandler(searchCallback) }
      toCSP={ toCSPCallback => setToCSPHandler(toCSPCallback) }
      />,
      <button id="searchButton">Search</button>,
      <button id="generateCSPButton">GenerateCSP</button>,

    ] ;
  });
