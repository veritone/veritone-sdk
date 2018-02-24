import React from 'react';
import { arrayOf, func, object, string } from 'prop-types';
import { SearchBar } from '.';
import Popover from 'material-ui/Popover';
import Paper from 'material-ui/Paper';
import EngineCategoryButton from './EngineCategoryButton';

import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Icon from './Icon';

const supportedCategoriesClass = cx(styles['supportedCategories']);
import cx from 'classnames';
import styles from './styles.scss';

import { withTheme } from 'material-ui/styles'
import { guid } from './component';

class SearchBarContainer extends React.Component {
  static propTypes = {
    theme: object,
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
    } else if(event.code === 'KeyG' && event.shiftKey && this.state.highlightedPills.length > 1) {
      event.preventDefault();
      console.log( "Search parameters", this.props.searchParameters );

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
        let afterAdd1 = this.props.addOrModifySearchParameter({
          value: ')',
          conditionType: 'group'
        }, last + 1 );

        let afterAdd2 = this.props.addOrModifySearchParameter({
          value: '(',
          conditionType: 'group'
        }, first );

        console.log("Added parenthesis", afterAdd2);
        let [ simplifiedParameters, extraneousGroups ] = this.simplifySearchParameters(afterAdd2);
        extraneousGroups.map( x => this.props.removeSearchParameter(x.id) );
      }
    }
  }

  addPill = modalId => {
    this.setState({
      openModal: { modalId: modalId }
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
    while(simplifiedParameters.length > 2 && simplifiedParameters[0].value === '(' && simplifiedParameters[simplifiedParameters.length - 1].value === ')') {
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


  addNewSearchParameter = (parameter, engineId) => {
    // if there's no selected pill, we're adding a new search parameter so add a joining operator if there are more than one pill
    if(this.numberOfPills(this.props.searchParameters) > 0) {
      const lastJoiningOperator = this.getLastJoiningOperator(this.props.searchParameters);
      this.addJoiningOperator(lastJoiningOperator);
    }

    this.props.addOrModifySearchParameter({
      value: parameter,
      conditionType: engineId
    });
  }


  replaceSearchParameter = (parameterValue, engineId, searchParameterId) => {
    this.props.addOrModifySearchParameter({
      value: parameterValue,
      conditionType: engineId,
      id: searchParameterId
    });
  }

  getApplyFilter = (engineId, searchParameters, searchParameterId) => {
    return parameter => {
      if (parameter) {
        const lastJoiningOperator = this.getLastJoiningOperator(searchParameters);
        const insertAt = this.state.highlightedPills.length === 1 ? searchParameters.findIndex( x => x.id === this.state.highlightedPills[0]) : undefined;

        // adding a pill before another pill
        if(insertAt !== undefined) {
          this.props.addOrModifySearchParameter([{
            value: parameter,
            conditionType: engineId
          },
          {
            value: "and",
            conditionType: "join",
          }]
          , insertAt);

          this.setState({
            openModal: { modalId: null },
            selectedPill: null
          }, () => {
            if(this.props.onSearch) {
              this.props.onSearch();
            }
          });
        } else {
          /*
          // if there's no selected pill, we're adding a new search parameter so add a joining operator if there are more than one pill
          if(!searchParameterId && this.numberOfPills(searchParameters) > 0) {
            this.addJoiningOperator(lastJoiningOperator);
          }

          this.props.addOrModifySearchParameter({
            value: parameter,
            conditionType: engineId,
            id: searchParameterId
          });
          */
        }
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

  addOrEditModal = () => {
    if(this.state.selectedPill) {
      console.log('Replace the selected pill', this.openModal.returnValue());
      this.replaceSearchParameter(this.openModal.returnValue(), this.state.openModal.modalId, this.state.selectedPill);
    } else {
      console.log("Current modal", this.openModal);
      console.log('Add a pill', this.openModal.returnValue());
      this.addNewSearchParameter(this.openModal.returnValue(), this.state.openModal.modalId);
      let lastModal = this.state.openModal.modalId;
      this.setState({ openModal: { modalId: '' + lastModal } });
      console.log('State after add', this.state);
    }
  }

  render() {
    const openModal = this.props.enabledEngineCategories.find(
      x => x.id === this.state.openModal.modalId
    );
    const Modal = openModal && openModal.modal ? openModal.modal : null;
    const libraryIds = this.props.libraries && this.props.libraries.map(library => library.id);
    const selectedPill = this.props.searchParameters.find( x => x.id === this.state.selectedPill);

    return (
      <div ref={(input) => { this.searchBar = input; }} style={{ width: '100%', overflowY: 'hidden' }}>
        <div>
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

        { Modal ? (
        <Popover
          id="simple-menu"
          anchorEl={this.searchBar}
          anchorOrigin={ { vertical: "bottom" } }
          marginThreshold={0}
          elevation={2}
          open
          onClose={this.cancelModal}
        >
          <Card className={ cx(styles['engineCategoryModal']) } style={{ width: this.searchBar.clientWidth }} elevation={0}>
            <CardHeader
              avatar={
                <Icon iconClass={ openModal.iconClass } color={'grey '} size={'2em'} />
              }
              classes={ { action: cx(styles['modalAction']) } }
              action={
                <div className={supportedCategoriesClass}>
                {this.props.enabledEngineCategories &&
                  this.props.enabledEngineCategories.map(engineCategory => (
                    <EngineCategoryButton
                      key={engineCategory.id}
                      engineCategory={engineCategory}
                      color={this.props.color}
                      addPill={ this.state.openModal.modalId ? () => this.setState({ openModal: { modalId: engineCategory.id }}) : this.props.addPill }
                    />
                  ))}
                </div>
              }
              title={ openModal.title }
              subheader={ openModal.subtitle }
              style={ { marginTop: 0, marginRight: 0 } }
            />
            <CardContent style={{ margin: "0.5em" }}>
              { Modal ? (
                <Modal
                  // the guid generation in the key is on purpose.
                  // basically, when a new modal of the exact same type is added, we use setState with the same modalId to
                  // force a rerender, which generates a new guid, thereby resetting the modal
                  // (this is preferrable to making every engine category modal implement a reset function)
                  // if we want to allow for rerenders while preserving the modal component, uncomment out guid() and
                  // explicity set openModal.key
                  key={this.state.openModal.key || guid() }
                  open
                  ref={ (input) => { this.openModal = input; } }
                  //setGetModalValue={ (input) => { this.openModal = input; console.log("Accessor function", input) } }
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
              ) : null }
            </CardContent>
            <CardActions classes={ { root: cx(styles['modalFooterActions']) } } style={ { padding: "1em" }}>
              <Button onClick={ this.cancelModal } color="primary" className={ cx(styles['cancelButton']) }>
                Cancel
              </Button>
              <Button
                onClick={ this.addOrEditModal }
                color="primary"
                className="transcriptSubmit"
              >
                { console.log("Open modal state", this.state.openModal.modalState ) }
                { this.state.selectedPill ? ( (selectedPill.conditionType === openModal.id && this.state.openModal.modalState !== undefined) ? 'Save' : 'Replace') : 'Add' }
              </Button>
            </CardActions>
          </Card>
        </Popover>
        ) : null }
        </div>



        { /* Modal ? (
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
        ) : null */ }
      </div>
    );
  }
}

export default withTheme()(SearchBarContainer);

SearchBarContainer.defaultProps = {
  searchParameters: [],
  enabledEngineCategories: [],
  addOrModifySearchParameter: state =>
    console.log('Add or modify the search parameter', state),
  removeSearchParameter: id =>
    console.log('Remove the search parameter with the id', id)
};
