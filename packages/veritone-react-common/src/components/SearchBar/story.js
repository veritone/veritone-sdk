import React from 'react';
import { storiesOf } from '@storybook/react';
import { object } from '@storybook/addon-knobs/react';

import update from 'immutability-helper';

import {
  TranscriptSearchModal,
  TranscriptDisplay,
  TranscriptConditionGenerator
} from 'components/TranscriptSearchModal';
import {
  SentimentSearchModal,
  SentimentDisplay,
  SentimentConditionGenerator
} from 'components/SentimentSearchModal';
import {
  FingerprintSearchModal,
  FingerprintDisplay,
  FingerprintConditionGenerator
} from 'components/FingerprintSearchModal';
import {
  FaceSearchModal,
  FaceDisplay,
  FaceConditionGenerator
} from 'components/FaceSearchModal';
import {
  ObjectSearchModal,
  ObjectDisplay,
  ObjectConditionGenerator
} from 'components/ObjectSearchModal';
import {
  SoundSearchModal,
  SoundDisplay,
  SoundConditionGenerator
} from 'components/SoundSearchModal'
import {
  RecognizedTextSearchModal,
  RecognizedTextDisplay,
  RecognizedTextConditionGenerator
} from 'components/RecognizedTextSearchModal';
import {
  LogoSearchModal,
  LogoDisplay,
  LogoConditionGenerator
} from 'components/LogoSearchModal';
import {
  TagSearchModal,
  TagDisplay,
  TagConditionGenerator
} from 'components/TagSearchModal';
import {
  TimeSearchModal,
  TimeDisplay,
  TimeConditionGenerator
} from 'components/TimeSearchModal';

import SearchBarContainer from './SearchBarContainer';
import { SearchBar } from '.';


// a lot of this information should come from this endpoint
// https://enterprise.stage.veritone.com/api/engine/category?time=1517268957867
// hardcoded for now to help setup storybook.
const transcript = {
  id: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
  name: 'Transcript',
  iconClass: 'icon-engine-transcription',
  tooltip: 'Search by Keyword',
  enablePill: true,
  showPill: true
};
const sentiment = {
  id: 'f2554098-f14b-4d81-9be1-41d0f992a22f',
  name: 'Sentiment',
  iconClass: 'icon-sentiment',
  tooltip: 'Search by Sentiment',
  enablePill: true,
  showPill: true
};
const fingerprint = {
  id: '17d62b84-8b49-465b-a6be-fe3ea3bc8f05',
  name: 'Fingerprint',
  iconClass: 'icon-finger_print3',
  tooltip: 'Search by Fingerprint',
  enablePill: true,
  showPill: true
};
const face = {
  id: '6faad6b7-0837-45f9-b161-2f6bf31b7a07',
  name: 'Face',
  iconClass: 'icon-face',
  tooltip: 'Search by Face',
  enablePill: true,
  showPill: true
};
const obj = {
  id: '088a31be-9bd6-4628-a6f0-e4004e362ea0',
  name: 'Object',
  iconClass: 'icon-object_detection',
  tooltip: 'Search by Object',
  enablePill: true,
  showPill: true
};
const sound = {
  id: 'c6e07fe3-f15f-48a7-8914-951b852d54d0',
  name: 'Audio Detection',
  iconClass: 'icon-audio_det',
  tooltip: 'Search by Sound',
  enablePill: true,
  showPill: true
};
const recognizedText = {
  id: '3b4ac603-9bfa-49d3-96b3-25ca3b502325',
  name: 'Recognized Text',
  iconClass: 'icon-ocr',
  tooltip: 'Search by Recognized Text',
  enablePill: true,
  showPill: true
};
const logo = {
  id: '5a511c83-2cbd-4f2d-927e-cd03803a8a9c',
  name: 'Logo Recognition',
  iconClass: 'icon-logo-detection',
  tooltip: 'Search by Logo',
  enablePill: true,
  showPill: true
};
const tag = {
  id: 'tag-search-id',
  name: 'Tag Search',
  iconClass: 'icon-tag',
  tooltip: 'Search by Tag',
  enablePill: true,
  showPill: true
};
const time = {
  id: 'time-search-id',
  name: 'Time',
  iconClass: 'icon-calendar',
  tooltip: 'Search by Time',
  enablePill: true,
  showPill: true
};

const appBarColor = '#4caf50';
const enabledEngineCategories = [transcript, sentiment, fingerprint, face, obj, sound, recognizedText, logo, tag, time];

const engineCategoryMapping = {
  '67cd4dd0-2f75-445d-a6f0-2f297d6cd182': {
    modal: TranscriptSearchModal,
    getLabel: TranscriptDisplay,
    generateCondition: TranscriptConditionGenerator
  },
  'f2554098-f14b-4d81-9be1-41d0f992a22f': {
    modal: SentimentSearchModal,
    getLabel: SentimentDisplay,
    generateCondition: SentimentConditionGenerator
  },
  '6faad6b7-0837-45f9-b161-2f6bf31b7a07': {
    modal: FaceSearchModal,
    getLabel: FaceDisplay,
    generateCondition: FaceConditionGenerator
  },
  '088a31be-9bd6-4628-a6f0-e4004e362ea0': {
    modal: ObjectSearchModal,
    getLabel: ObjectDisplay,
    generateCondition: ObjectConditionGenerator
  },
  '17d62b84-8b49-465b-a6be-fe3ea3bc8f05': {
    modal: FingerprintSearchModal,
    getLabel: FingerprintDisplay,
    generateCondition: FingerprintConditionGenerator
  },
  'c6e07fe3-f15f-48a7-8914-951b852d54d0': {
    modal: SoundSearchModal,
    getLabel: SoundDisplay,
    generateCondition: SoundConditionGenerator
  },
  '3b4ac603-9bfa-49d3-96b3-25ca3b502325': {
    modal: RecognizedTextSearchModal,
    getLabel: RecognizedTextDisplay,
    generateCondition: RecognizedTextConditionGenerator
  },
  '5a511c83-2cbd-4f2d-927e-cd03803a8a9c': {
    modal: LogoSearchModal,
    getLabel: LogoDisplay,
    generateCondition: LogoConditionGenerator
  },
  'tag-search-id': {
    modal: TagSearchModal,
    getLabel: TagDisplay,
    generateCondition: TagConditionGenerator
  },
  'time-search-id': {
    modal: TimeSearchModal,
    getLabel: TimeDisplay,
    generateCondition: TimeConditionGenerator
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
    if(this.props.csp) {
      this.setState( { searchParameters: this.CSPToSearchParameters(this.props.csp) });
    }
  }

  componentWillReceiveProps(prev, next) {
    console.log(next);
  }

  state = {
    searchParameters: this.props.searchParameters || []
  };

  onSearch = () => {
    if (this.props.onSearch) {
      this.props.onSearch(this.convertSearchParametersToCSP(this.state.searchParameters));
    } else {
      return this.convertSearchParametersToCSP(this.state.searchParameters);
    }
  }

  CSPToSearchParameters = cognitiveSearchProfile => {
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
        if(newJoinOperator) {
          searchParameters.push( newJoinOperator );
        }
      } else {
        searchParameters.pop();
        joinOperator = getJoinOperator(conditions[i])
        const newJoinOperator = { id: guid(), conditionType: 'join', value: joinOperator };
        searchParameters.push( newJoinOperator );
        conditions = conditions[i][joinOperator];
        i = -1;
      }
    }
    return searchParameters;
  }

  CSPToSearchParameters = cognitiveSearchProfile => {
    const getJoinOperator = ( query ) => {
      const operators = Object.keys(query);
      return operators[0];
    }

    const searchParameters = [];
    let joinOperator = getJoinOperator(cognitiveSearchProfile);
    console.log("first join operator", joinOperator);
    let conditions = cognitiveSearchProfile[joinOperator];

    for(let i = 0; i < conditions.length; i++) {

      if('engineCategoryId' in conditions[i]) {
        const newSearchPill = { id: guid(), conditionType: conditions[i].engineCategoryId, value: conditions[i].state }
        searchParameters.push( newSearchPill );
        const newJoinOperator = { id: guid(), conditionType: 'join', value: joinOperator };
        if(newJoinOperator) {
          searchParameters.push( newJoinOperator );
        }
      } else {
        joinOperator = getJoinOperator(conditions[i])
        conditions = conditions[i][joinOperator];
        i = -1;
      }
    }
    return searchParameters;
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


    const csp = this.convertSearchParametersToCSP(this.state.searchParameters);
    const getJoinOperator = ( query ) => {
      const operators = Object.keys(query);
      return operators[0];
    }

    let joinOperator = getJoinOperator(csp);
    let conditions = csp[joinOperator];

    const newBooleanSubtree = {
      operator: joinOperator,
      conditions: []
    };
    baseQuery.query.conditions.push(newBooleanSubtree);
    let queryConditions = newBooleanSubtree.conditions;

    for(let i = 0; i < conditions.length; i++) {
      if('engineCategoryId' in conditions[i]) {
        // add an additional condition
        const newCondition = engineCategoryMapping[conditions[i].engineCategoryId].generateCondition(
          conditions[i].state
        )
        queryConditions.push( newCondition );
      } else {
        // different boolean operator, add a new subtree
        const newBooleanSubtree = {
          operator: getJoinOperator(conditions[i]),
          conditions: []
        };
        queryConditions.push(newBooleanSubtree);
        queryConditions = newBooleanSubtree.conditions;
        debugger;
        joinOperator = getJoinOperator(conditions[i]);
        conditions = conditions[i][joinOperator];
        i = -1;
      }
    }

    console.log(baseQuery);
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
      <SearchBarContainer
        color={this.props.color}
        enabledEngineCategories={this.extendEngineCategories(
          enabledEngineCategories
        )}
        onSearch={this.onSearch}
        api={this.props.api}
        libraries={this.props.libraries}
        searchParameters={this.state.searchParameters}
        addOrModifySearchParameter={this.addOrModifySearchParameter}
        removeSearchParameter={this.removeSearchParameter}
      />
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

    let csp = {"and":[{"state":{"search":"Lakers","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"},{"or":[{"state":{"search":"Kobe","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"},{"state":{"search":"Lebron","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"},{"state":{"search":"Shaq","language":"en"},"engineCategoryId":"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"}]}]};

    const onSearch = (csps) => console.log("User submitted a search", JSON.stringify(csps));

    return [
      <div
        style={{
          height: '45px',
          width: '100%',
          padding: '5px',
          background: appBarColor,
          padding: '5px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
      <SampleSearchBar
      api="https://api.aws-dev.veritone.com/v1/"
      color={appBarColor}
      csp={ object("CSP", csp) }
      onSearch={ onSearch }
      setSearch={ searchCallback => setSearchHandler(searchCallback) }
      toCSP={ toCSPCallback => setToCSPHandler(toCSPCallback) }
      /></div>,
      <button id="searchButton">Search</button>,
      <button id="generateCSPButton">GenerateCSP</button>,

    ] ;
  });
