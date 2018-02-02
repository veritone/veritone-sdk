import React from 'react';
import { arrayOf, func, object, string } from 'prop-types';
import { SearchBar } from '.';

export default class SearchBarContainer extends React.Component {
  static propTypes = {
    color: string,
    api: string,
    libraries: arrayOf(string),
    searchParameters: arrayOf(object),
    addOrModifySearchParameter: func,
    removeSearchParameter: func,
    enabledEngineCategories: arrayOf(object)
  };

  componentDidMount() {
    console.log("Did we pass an api?", this.props)
    if(this.props.api) {
      console.log("Call get auth", this.getAuth);
      this.getAuth();
    }
  }

  getAuth() {
    if (this.props.api) {
      return fetch(`${this.props.api}v1/admin/current-user`, {
        credentials: 'include'
      })
      .then(
        response => {
          if (response.status === 200) {
            return response.json();
          } else {
            return false;
          }
        }
      )
      .then(y => y && this.setState({authToken: y.token}));
    }
  }

  state = {
    openModal: { modalId: null },
    selectedPill: null
  };

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

  removePill = (searchParameterId, searchParameters) => {
    let index = searchParameters.findIndex(x => x.id === searchParameterId);
    let nextJoiningParameterId =
      searchParameters[index + 1] && searchParameters[index + 1].id;
    this.props.removeSearchParameter(searchParameterId);

    if (nextJoiningParameterId) {
      this.props.removeSearchParameter(nextJoiningParameterId);
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

        this.props.addOrModifySearchParameter({
          value: parameter,
          conditionType: engineId,
          id: searchParameterId
        });

        // if there's no selected pill, we're adding a new search parameter so add a joining operator
        if (!searchParameterId) {
          this.addJoiningOperator(lastJoiningOperator);
        }
      } else {
        // if there is no value in the modal, remove the search parameter and the joining operator after it
        this.removePill(searchParameterId, searchParameters);
      }
      this.setState({
        openModal: { modalId: null },
        selectedPill: null
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
    return (
      <div style={{ width: '100%', marginLeft: '0em', marginRight: '0em', overflowY: 'hidden', padding: 0 }}>
        <SearchBar
          onSearch={this.props.onSearch}
          color={this.props.color}
          enabledEngineCategories={this.props.enabledEngineCategories}
          searchParameters={this.props.searchParameters}
          addJoiningOperator={this.props.addJoiningOperator}
          addPill={this.addPill}
          removePill={this.getRemovePill(this.props.searchParameters)}
          openPill={this.openPill}
          modifyPill={ this.props.addOrModifySearchParameter }
        />
        {Modal ? (
          <Modal
            open
            api={this.props.api}
            auth={this.state.authToken}
            libraries={this.props.libraries}
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
