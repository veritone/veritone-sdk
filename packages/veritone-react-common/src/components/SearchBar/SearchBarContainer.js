import React from 'react';
import { arrayOf, func, object, string } from 'prop-types';
import { SearchBar } from '.';

export default class SearchBarContainer extends React.Component {
  static propTypes = {
    auth: string,
    color: string,
    api: string,
    libraries: arrayOf(object),
    searchParameters: arrayOf(object),
    addOrModifySearchParameter: func,
    removeSearchParameter: func,
    enabledEngineCategories: arrayOf(object)
  };

  state = {
    openModal: { modalId: null },
    selectedPill: null,
    highlightedPills: []
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleGroupingKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleGroupingKeyPress);
  }

  handleGroupingKeyPress = (event) => {
    // let the user use esc to deselect all highlighted pills
    if(event.code === 'Escape' && this.state.highlightedPills.length > 0 && !this.state.selectedPill && !this.state.openModal.modalId) {
      event.preventDefault();
      this.setState( { highlightedPills: [] });
    } else if(event.code === 'KeyG' && event.shiftKey && this.state.highlightedPills.length > 0) {
      event.preventDefault();
      let first = this.props.searchParameters.findIndex( x => x.id === this.state.highlightedPills[0]);
      console.log("First highlightedPill index", first);
      let last = this.props.searchParameters.findIndex( x => x.id === this.state.highlightedPills[this.state.highlightedPills.length - 1]);
      console.log("Last highlightedPill index", last);

      const before = this.props.searchParameters[first - 1];
      const after = this.props.searchParameters[last + 1];
      if( before && before.conditionType === 'group' && before.value === '(' 
      && after && after.conditionType === 'group' && after.value === ')') {
        // already an existing group
        console.log("Existing group, should probably remove it");
        this.props.removeSearchParameter( before.id );
        this.props.removeSearchParameter( after.id );
      } else {
        this.props.addOrModifySearchParameter({
          value: ')',
          conditionType: 'group'
        }, last + 1 );

        this.props.addOrModifySearchParameter({
          value: '(',
          conditionType: 'group'
        }, first );

        console.log("Added parenthesis");
      }
    }
  }

  addPill = modalId => {
    this.setState({
      openModal: { modalId: modalId }
    });
  };

  addJoiningOperator = operator => {
    this.props.addOrModifySearchParameter({
      value: operator || 'and',
      conditionType: 'join'
    });
  };

  togglePill = (searchParameterId, searchParameters) => {
    if (this.state.highlightedPills.length > 0) {
      // if the pill is already highlighted, unhighlight it
      let alreadyHighlightedIndex = this.state.highlightedPills.indexOf(searchParameterId);
      if( alreadyHighlightedIndex !== -1 ) {
        if( alreadyHighlightedIndex === 0 || alreadyHighlightedIndex === (this.state.highlightedPills.length - 1) ) {
          let highlightedPills = this.state.highlightedPills.filter( x => x !== searchParameterId);
          this.setState( { highlightedPills: highlightedPills });
        }
        return;
      }

      // if there are pills already highlighted, we can only highlight their neighbors
      let pills = searchParameters.filter( x => x.conditionType !== 'join' && x.conditionType !== 'group');
      // x.conditionType !== 'group' (add this back if you want them to be able to group neighbors who are already in groups)
      //console.log("Just the pills", pills);
      let pillToHighlightIndex = pills.findIndex( x => x.id === searchParameterId);
      //console.log("Pill to highlight index", pillToHighlightIndex);
      let firstHighlightedPillIndex = pills.findIndex( x => x.id === this.state.highlightedPills[0]);
      //console.log("First highlightedPill index", firstHighlightedPillIndex);
      let lastHighlightedPillIndex = pills.findIndex( x => x.id === this.state.highlightedPills[this.state.highlightedPills.length - 1]);
      console.log("Last highlighted pill index", lastHighlightedPillIndex);
      if (pillToHighlightIndex === firstHighlightedPillIndex - 1) {
        let highlightedPills = [...this.state.highlightedPills];
        highlightedPills.unshift(searchParameterId);
        this.setState( { highlightedPills: highlightedPills });
      }  else if (pillToHighlightIndex === lastHighlightedPillIndex + 1) {
        let highlightedPills = [...this.state.highlightedPills];
        highlightedPills.push(searchParameterId);
        this.setState( { highlightedPills: highlightedPills });
      } else {
        // BOOP! you tried to group a non adjacent pill
        console.warn('You tried to highlight a non-adjacent pill');
      }
    } else {
      // if there are no pills highlighted yet, we can highlight any of the pills
      let highlightedPills = [ searchParameterId ];
      this.setState( { highlightedPills: highlightedPills });
    }
  }

  removePill = (searchParameterId, searchParameters) => {
    let index = searchParameters.findIndex(x => x.id === searchParameterId);
    
    let lastJoiningParameter = searchParameters.slice(0, index).reverse().find( x => x.conditionType === 'join');
    //searchParameters[index + 1] && searchParameters[index + 1].id;
      //this.props.removeSearchParameter(searchParameterId);

    if (lastJoiningParameter) {
      this.props.removeSearchParameter(lastJoiningParameter.id);
      this.props.removeSearchParameter(searchParameterId);
      if (this.props.onSearch) {
        this.props.onSearch( searchParameters.filter( x => x.id !== searchParameterId && x.id !== lastJoiningParameter.id));
      }
    } else {
      this.props.removeSearchParameter(searchParameterId);
      if (this.props.onSearch) {
        this.props.onSearch( searchParameters.filter( x => x.id !== searchParameterId) );      
      }
    }
  };

  getRemovePill = searchParameters => {
    return searchParameterId => {
      this.removePill(searchParameterId, searchParameters);
    };
  };

  getLastJoiningOperator = (searchParameters) => {
    for(let i = searchParameters.length - 1; i >= 0; i--) {
      if(searchParameters[i].conditionType === 'join') {
        console.log("Last joining operator", searchParameters[i]);
        return searchParameters[i].value;
      }
    }
    return null;
  }

  getApplyFilter = (engineId, searchParameters, searchParameterId) => {
    return parameter => {
      if (parameter) {
        const lastJoiningOperator = this.getLastJoiningOperator(searchParameters);

        let numberOfPills = searchParameters.filter( x => x.conditionType !== 'join' && x.conditionType !== 'group');
        // if there's no selected pill, we're adding a new search parameter so add a joining operator if there are more than one pill
        if(!searchParameterId && numberOfPills.length > 0) {
          this.addJoiningOperator(lastJoiningOperator);
        }

        this.props.addOrModifySearchParameter({
          value: parameter,
          conditionType: engineId,
          id: searchParameterId
        });

      } else {
        // if there is no value in the modal, remove the search parameter and the joining operator after it
        this.removePill(searchParameterId, searchParameters);

      }
      this.setState({
        openModal: { modalId: null },
        selectedPill: null
      }, () => {
        if(this.props.onSearch) {
          this.props.onSearch();
        }
      });
    };
  };

  openPill = pillState => {
    console.log('Open pill with ', pillState);
    this.setState({
      openModal: {
        modalId: pillState.conditionType,
        modalState: pillState.value
      },
      selectedPill: pillState.id
    });
  };

  cancelModal = () => {
    this.setState({
      openModal: { modalId: null },
      selectedPill: null
    });
  };

  render() {
    const openModal = this.props.enabledEngineCategories.find(
      x => x.id === this.state.openModal.modalId
    );

    const Modal = openModal && openModal.modal ? openModal.modal : null;
    const libraryIds = this.props.libraries && this.props.libraries.map(library => library.id);

    return (
      <div style={{ width: '100%', marginLeft: '0em', marginRight: '0em', overflowY: 'hidden', padding: 0 }}>
        <SearchBar
          onSearch={this.props.onSearch}
          color={this.props.color}
          enabledEngineCategories={this.props.enabledEngineCategories}
          searchParameters={this.props.searchParameters}
          addJoiningOperator={this.props.addJoiningOperator}
          highlightedPills={this.state.highlightedPills}
          togglePill={ this.togglePill }
          libraries={ this.props.libraries }
          addPill={this.addPill}
          removePill={this.getRemovePill(this.props.searchParameters)}
          openPill={this.openPill}
          modifyPill={ this.props.addOrModifySearchParameter }
        />
        {Modal ? (
          <Modal
            open
            api={this.props.api}
            auth={this.props.auth}
            libraries={libraryIds}
            modalState={this.state.openModal.modalState}
            cancel={this.cancelModal}
            applyFilter={this.getApplyFilter(
              this.state.openModal.modalId,
              this.props.searchParameters,
              this.state.selectedPill
            )}
          />
        ) : null}
      </div>
    );
  }
}

SearchBarContainer.defaultProps = {
  searchParameters: [],
  enabledEngineCategories: [],
  addOrModifySearchParameter: state =>
    console.log('Add or modify the search parameter', state),
  removeSearchParameter: id =>
    console.log('Remove the search parameter with the id', id)
};
