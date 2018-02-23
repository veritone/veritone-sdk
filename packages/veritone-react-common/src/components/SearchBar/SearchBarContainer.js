import React from 'react';
import { arrayOf, func, object, string } from 'prop-types';
import { SearchBar } from '.';
import Menu, { MenuItem } from 'material-ui/Menu';

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
    menuAnchorEl: null,
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
    } else if(event.code === 'KeyG' && event.shiftKey && this.state.highlightedPills.length > 1) {
      event.preventDefault();
      this.toggleGrouping();
    }
  }

  toggleGrouping = () => {
    if(this.state.highlightedPills.length <= 0) {
      return;
    }
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
      const paramsToAdd = [
        {
          parameter: {
            value: ')',
            conditionType: 'group'
          },
          index: last + 1
        },
        {
          parameter: {
            value: '(',
            conditionType: 'group'
          },
          index: first
        },
      ];
      const newSearchParameters = this.props.insertMultipleSearchParameters(paramsToAdd);
      console.log("Added parenthesis", newSearchParameters);
      let [ simplifiedParameters, extraneousGroups ] = this.simplifySearchParameters(newSearchParameters);
      extraneousGroups.map( x => this.props.removeSearchParameter(x.id) );
    }
  }

  addPill = modalId => {
    this.setState({
      openModal: { modalId: modalId },
      insertDirection: null
    });
  };

  addJoiningOperator = (operator, index) => {
    this.props.addOrModifySearchParameter({
      value: operator || 'and',
      conditionType: 'join'
    }, index);
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

  simplifySearchParameters(searchParameters) {
    let reduced = searchParameters.reduce( (accu, searchParameter ) => {
      let simplified = accu[0];
      let removed = accu[1];

      // remove groups that only contain one element
      if (simplified[simplified.length - 2] && simplified[simplified.length - 2].value === '(' && simplified[simplified.length - 1] && simplified[simplified.length - 1].value !== '(' && simplified[simplified.length - 1].value !== ')' && searchParameter.value === ')') {
        removed.push(simplified[simplified.length - 2]);
        removed.push(searchParameter);
        simplified.splice(simplified.length - 2, 1);
      } else if (simplified[simplified.length - 1] && simplified[simplified.length - 1].value === '(' && searchParameter.value === ')') {
        // remove groups with no elements
        removed.push(simplified[simplified.length - 1]);
        removed.push(searchParameter);
        simplified.pop();
      } else {
        simplified.push(searchParameter);
      }
      return accu;
    }, [[], []]);

    let [ simplifiedParameters, extraneousGroups ] = reduced;
    while(simplifiedParameters[0].value === '(' && simplifiedParameters[simplifiedParameters.length - 1].value === ')') {
      extraneousGroups.push(simplifiedParameters[0]);
      extraneousGroups.push(simplifiedParameters[simplifiedParameters.length - 1]);

      simplifiedParameters.pop();
      simplifiedParameters.shift();
    }

    return [ simplifiedParameters, extraneousGroups ];
  }

  removePill = (searchParameterId, searchParameters) => {
    let index = searchParameters.findIndex(x => x.id === searchParameterId);
    let previousParameter = searchParameters[index - 1];
    let newSearchParameters = null;

    // if the pill to be removed is the start of a group, we need to remove the next joining parameter and not the previous one
    if( ( previousParameter && previousParameter.value === '(' ) || ( index === 0 && this.numberOfPills(searchParameters) > 1 ) ) {
      this.props.removeSearchParameter( searchParameters[index+1].id );
      this.props.removeSearchParameter( searchParameterId );
      newSearchParameters = searchParameters.filter( x => x.id !== searchParameterId && x.id !== searchParameters[index+1].id);
    } else if ( this.numberOfPills(searchParameters) > 1) {
      // if the pill to be removed is in the middle of a group, remove the last joining parameter
      let lastJoiningParameter = searchParameters.slice(0, index).reverse().find( x => x.conditionType === 'join');
      this.props.removeSearchParameter(lastJoiningParameter.id);
      this.props.removeSearchParameter(searchParameterId);
      newSearchParameters = searchParameters.filter( x => x.id !== searchParameterId && x.id !== lastJoiningParameter.id);
    } else {
      // remove a single pill
      this.props.removeSearchParameter( searchParameterId );
      newSearchParameters = searchParameters.filter( x => x.id !== searchParameterId);
    }

    console.log("After remove", searchParameters);

    let [ simplifiedParameters, extraneousGroups ] = this.simplifySearchParameters(newSearchParameters);
    extraneousGroups.map( x => this.props.removeSearchParameter(x.id) );

    if (this.props.onSearch) {
      this.props.onSearch( simplifiedParameters );
    }
    this.setState({highlightedPills: []});
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

  numberOfPills = (searchParameters) => searchParameters.reduce( (accu, searchParameter) => {
    if (searchParameter.conditionType !== 'join' && searchParameter.conditionType !== 'group' ) {
      return accu + 1;
    } else {
      return accu;
    }
  }, 0);

  getApplyFilter = (engineId, searchParameters, searchParameterId, insertDirection) => {
    return parameter => {
      if (parameter) {
        const lastJoiningOperator = this.getLastJoiningOperator(searchParameters);

        if(insertDirection) {
          const selectedParamIndex = this.props.searchParameters.findIndex(x => x.id === this.state.selectedSearchParameter.id);
          const insertAt = insertDirection === 'left' ? selectedParamIndex : selectedParamIndex + 1;
          const searchTermParam = {
            value: parameter,
            conditionType: engineId
          };
          const operatorParam = {
            value: 'and',
            conditionType: 'join'
          };
          const newParams = insertDirection === 'left' ? [searchTermParam, operatorParam] : [operatorParam, searchTermParam];
          this.props.addOrModifySearchParameter(newParams, insertAt);
          this.setState({
            openModal: { modalId: null },
            selectedPill: null
          }, () => {
            if(this.props.onSearch) {
              this.props.onSearch();
            }
          });
        } else {
          // if there's no selected pill, we're adding a new search parameter so add a joining operator if there are more than one pill
          if(!searchParameterId && this.numberOfPills(searchParameters) > 0) {
            this.addJoiningOperator(lastJoiningOperator);
          }
          this.props.addOrModifySearchParameter({
            value: parameter,
            conditionType: engineId,
            id: searchParameterId
          });
        }
      } else {
        // if there is no value in the modal, remove the search parameter and the joining operator after it
        this.removePill(searchParameterId, searchParameters);

      }
      this.setState({
        openModal: { modalId: null },
        selectedPill: null,
        insertDirection: null
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

  handleMenuOpen = (target, searchParameter) => {
    const menuOptions = (this.state.highlightedPills.length > 1 && this.state.highlightedPills.includes(searchParameter.id))
      ? [
          {
            label: 'Group Selection',
            onClick: this.menuGroupSelection
          },
          {
            label: 'Delete',
            onClick: this.menuRemoveHighlightedPills 
          }
        ]
      : [
          {
            label: 'Edit',
            onClick: this.menuEditPill
          },
          {
            label: 'Delete',
            onClick: this.menuRemovePill
          },
          {
            label: 'Insert Search Term to Left',
            onClick: () => {this.menuInsertDirection('left')}
          },
          {
            label: 'Insert Search Term to Right',
            onClick: () => {this.menuInsertDirection('right')}
          }
        ];

    const menuPosition = {
      top: target.offsetTop + target.offsetHeight,
      left: target.offsetLeft - target.parentElement.scrollLeft
    };

    this.setState({
      menuAnchorEl: target,
      selectedSearchParameter: searchParameter,
      menuOptions,
      menuPosition
    });
  }

  handleMenuClose = () => {
    this.setState({
      menuAnchorEl: null,
      selectedSearchParameter: null
    });
  }

  menuInsertDirection = (insertDirection) => {
    this.setState({
      menuAnchorEl: null,
      openModal: { modalId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182' },
      insertDirection 
    });
  }

  menuRemovePill = () => {
    this.removePill(this.state.selectedSearchParameter.id, this.props.searchParameters);
    this.setState({
      menuAnchorEl: null,
      selectedSearchParameter: null
    });
  }

  menuRemoveHighlightedPills = () => {
    console.log('delete all highlighted pills from menu');
    //TODO remove multiple
    this.removePill(this.state.selectedSearchParameter.id, this.props.searchParameters);
    this.setState({
      menuAnchorEl: null,
      selectedSearchParameter: null
    });
  }

  menuEditPill = () => {
    this.openPill(this.state.selectedSearchParameter);
    this.setState({
      menuAnchorEl: null,
      selectedSearchParameter: null
    });
  }

  menuGroupSelection = () => {
    this.toggleGrouping();
    this.setState({
      menuAnchorEl: null,
      selectedSearchParameter: null
    })
  }

  cancelModal = () => {
    this.setState({
      openModal: { modalId: null },
      selectedPill: null,
      insertDirection: null
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
          modifyPill={ this.props.addOrModifySearchParameter }
          openMenu={this.handleMenuOpen}
        />
        <Menu
          open={Boolean(this.state.menuAnchorEl)}
          onClose={this.handleMenuClose}
          anchorReference={'anchorPosition'}
          anchorPosition={this.state.menuPosition}
          disableRestoreFocus
          // anchorEl={this.state.menuAnchorEl}
        >
          {
            this.state.menuOptions && this.state.menuOptions.map(menuOption => (
              <MenuItem onClick={menuOption.onClick}>
                {menuOption.label}
              </MenuItem>
            ))
          }
        </Menu>
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
              this.state.selectedPill,
              this.state.insertDirection
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
  insertMultipleSearchParameters: state => 
    console.log('insert multiple search parameters', state),
  removeSearchParameter: id =>
    console.log('Remove the search parameter with the id', id)
};
