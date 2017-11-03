import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import { SearchBar } from './';

const transcript = {
  id: "guid-1",
  name: "Transcript",
  iconClass: "icon-engine-transcription",
  tooltip: "Search by Keyword",
  enablePill: true,
  showPill: true,
}

const appBarColor = '#4caf50';

const lakersTranscriptSearch = {
  field_name: "transcript.transcript",
  filter_value: "Lakers",
  operator: "query_string"
}

const transcriptSearchPill = {
  key: "search-pill-1",
  engineId: "guid-1",
  searchAbbreviation: "Lakers",
  filters: lakersTranscriptSearch
}

const supportedEngineCategories = [transcript];

class SearchBarContainer extends React.Component {
  constructor(props) {
    super();
  }

  componentWillMount() {
    const dynamicEngineCategorySearchModal = {

    };

    // dynamically import searchCategory modals;
    supportedEngineCategories.map(
      (engineCategory) => {
        if(engineCategory.id === 'guid-1') {
          dynamicEngineCategorySearchModal[engineCategory.id] = { component: require('../TranscriptSearchModal').default };
        }
      }
    );

    console.log(supportedEngineCategories);

    // bind engineCategoryButtons to their search modals
    supportedEngineCategories[0].addPill = () => {
      console.log("Open Search Modal", supportedEngineCategories[0].id);
      this.setState( { openModal:  supportedEngineCategories[0].id } );
    };

    let searchEngineCategories = []
    const lakersTranscriptPill = { ... transcriptSearchPill };

    lakersTranscriptPill.remove = () => this.deletePill(lakersTranscriptPill.key) ;
    lakersTranscriptPill.openModal = () => this.setState( { openModal: lakersTranscriptPill.engineId, openPill: lakersTranscriptPill.key } );
    lakersTranscriptPill.applyFilter = (value) => {
      lakersTranscriptPill.filters = value;
      lakersTranscriptPill.searchAbbreviation = value.filter_value;
    };

    searchEngineCategories.push(lakersTranscriptPill);
    this.setState({
      query: { searchEngineCategories: searchEngineCategories },
      searchEngineCategoryModals: dynamicEngineCategorySearchModal
    });

    console.log(dynamicEngineCategorySearchModal);
  }

  // pure function that converts the AST in the searchBar to a V3 search query
  search(searchEngineCategory) {
    const baseQuery = {
      index: [ "mine", "global" ],
      query: {
        operator: "and",
        conditions: [

        ]
      },
      limit: 20,
      offset: 0
    }

    const searchEngineCategoriesQuery = {
      operator: "and",
      conditions: [

      ]
    }

    let searchCall = { ... baseQuery };
    let searchCategoryFilters = { ...searchEngineCategoriesQuery };
    searchEngineCategory.map( (searchEngineCategory) => {
      searchCategoryFilters.conditions.push(
        {
          operator: searchEngineCategory.filters.operator,
          field: searchEngineCategory.filters.field_name,
          value: searchEngineCategory.filters.filter_value
        }
      );
    });
    searchCall.query.conditions.push(searchCategoryFilters);

    console.log("Search", searchCall);
  }


  deletePill(searchPillKey) {
    let searchBarState = this.state.query.searchEngineCategories.filter( (x) => x.key !== searchPillKey );
    this.setState( { query: { searchEngineCategories: searchBarState } } );
  }

  closeModal(ref) {
    ref.setState( { openModal: undefined, openPill: undefined  });
  }

  // TO DO
  addSearchEngineCategory(value) {
    if(value.engineId === 'guid-1') {
      const newPillKey = UUID.generate();
      const newPill = {
        key: newPillKey,
        engineId: value.engineId,
        remove: () => this.deletePill(newPillKey),
        openModal: () => this.setState( { openModal: value.engineId, openPill: newPillKey } ),
        filters: value,
        searchAbbreviation: value.filter_value
      };

      const query = { ... this.state.query };
      query.searchEngineCategories.push(newPill);
      this.setState({ query: query, openModal: undefined, openPill: undefined });
    }
  }

  renderSearchEngineModal() {
    if(this.state.openModal) {
      let modalState = {};
      if(this.state.openPill) {
        modalState = this.state.query.searchEngineCategories.filter( (x) => x.key === this.state.openPill )[0].filters;
      }

      let searchModalProperties = {
        open: true,
        filters: modalState,
        applyFilter: (value) => this.addSearchEngineCategory(value),
        closeFilter: () => this.closeModal(this)
      }
      console.log(searchModalProperties.filter);

      return ( this.state.searchEngineCategoryModals[this.state.openModal].component( searchModalProperties ) );
    }
  }

  render() {
    return (
      <div style={{ height: '100%', width: '100%', margin: '5px', background: appBarColor, padding: '0px', display: 'flex', alignItems: 'center' }}>
        <div style={{ margin: '0 1em 0 1em', padding: 0 }}>
          <h3>Dora</h3>
        </div>
        <SearchBar onSearch={ () => this.search(this.state.query.searchEngineCategories) } color={appBarColor} supportedEngineCategories={ supportedEngineCategories } query={ this.state.query } />
        { this.renderSearchEngineModal() }
      </div>
    );
  }
}


storiesOf('SearchBar', module).add('Base', () =>
{
  return(
    <div style={{ height: '100%', width: '100%', margin: '5px', background: appBarColor, padding: '0px', display: 'flex', alignItems: 'center' }}>
      <div style={{ margin: '0 1em 0 1em', padding: 0 }}>
          <h3>Logo</h3>
      </div>
      <SearchBar color={appBarColor} supportedEngineCategories={ supportedEngineCategories }>

      </SearchBar>

    </div>
  );
}
).add('WithTranscriptPill', () => {
  return (
    <SearchBarContainer />
  )
});
