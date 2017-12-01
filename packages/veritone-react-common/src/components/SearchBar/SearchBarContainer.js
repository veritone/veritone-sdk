import React from 'react';
import { arrayOf, shape, func, object } from 'prop-types';
import { SearchBar } from '.';

export default class SearchBarContainer extends React.Component {
  static propTypes = {
    searchParameters: arrayOf(object),
    addOrModifySearchParameter: func,
    removeSearchParameter: func,
    //enabledEngineCategories: arrayOf(shape(supportedEngineCategoryType)),
  };

  state = {
    openModal: { modalId: null },
    selectedPill: null
  };

  addPill = (modalId) => {
    this.setState( {
      openModal: { modalId: modalId }
    });
  }

  applyFilter = (engineId) => {
    return (parameter) => {
      console.log("new filter value", parameter);
      if( !!parameter.value) {
        this.props.addOrModifySearchParameter({...parameter, engineId: engineId, id: this.state.selectedPill });
      } else {
        this.props.removeSearchParameter( this.state.selectedPill );
      }
      this.setState( {
        openModal: { modalId: null },
        selectedPill: null
      });
    }
  }

  openPill = (pillState) => {
    this.setState( {
      openModal: { modalId: pillState.engineId, modalState: {value: pillState.value} },
      selectedPill: pillState.id
    } )
  }

  cancelModal = () => {
    this.setState( {
      openModal: { modalId: null},
      selectedPill: null,
    })
  }

  render() {
    const openModal = this.props.enabledEngineCategories.find( x => x.id === this.state.openModal.modalId);
    const Modal = openModal && openModal.modal ? openModal.modal : null;
    return (
      <div style= { { width: "100%", marginRight: "1em", padding: 0 } }>
        <SearchBar color={ this.props.color } enabledEngineCategories={ this.props.enabledEngineCategories } searchParameters={ this.props.searchParameters } addPill={ this.addPill } removePill={ this.props.removeSearchParameter } openPill={this.openPill}/>
        {
          Modal ? <Modal open={ true } modalState={ this.state.openModal.modalState } cancel={ this.cancelModal } applyFilter={ this.applyFilter(this.state.openModal.modalId) } /> : null
        }
      </div>
    );
  }
}

SearchBarContainer.defaultProps = {
  searchParameters: [],
  enabledEngineCategories: [],
  addOrModifySearchParameter: ( state ) => console.log("Add or modify the search parameter", state),
  removeSearchParameter: ( id ) => console.log("Remove the search parameter with the id", id)
}
