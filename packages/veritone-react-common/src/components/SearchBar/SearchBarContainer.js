import React from 'react';
import { arrayOf, func, object, string, oneOf, shape, any } from 'prop-types';
import cx from 'classnames';
import { get, uniq, isEmpty, isEqual, sortBy, includes } from 'lodash';
import "rxjs/add/operator/take";
import "rxjs/add/operator/takeWhile";
import { fromEvent } from 'rxjs/observable/fromEvent';
import { withTheme, withStyles } from '@material-ui/core/styles'

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Popover from '@material-ui/core/Popover';
import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import { SearchBar } from '.';
import Icon from './Icon';
import { guid } from './component';
import AdvancedPanel from '../AdvancedPanel';
import EngineCategoryButton from './EngineCategoryButton';

import styles from './styles';

class SearchBarContainer extends React.Component {
  static propTypes = {
    auth: string,
    color: string,
    api: string,
    libraries: arrayOf(object),
    searchParameters: arrayOf(object),
    addOrModifySearchParameter: func,
    removeSearchParameter: func,
    enabledEngineCategories: arrayOf(object),
    defaultJoinOperator: oneOf(['and', 'or']),
    classes: shape({ any }),
  };

  state = {
    openModal: { modalId: null },
    selectedPill: null,
    menuAnchorEl: null,
    highlightedPills: [],
    openAdvancedPanel: false,
    advancedEnableIds: [],
    advancedOptions: {},
    disableAdvancedSearch: true
  };

  _id = guid();

  componentDidMount() {
    document.addEventListener('keydown', this.handleGroupingKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleGroupingKeyPress);
  }

  componentDidUpdate(prevProps, prevState) {
    // modal closed, modal now open. register a window.resize event to make the modal responsive
    if ((!prevState.openModal || !prevState.openModal.modalId) && this.state.openModal && this.state.openModal.modalId) {
      this.windowResizeListener = fromEvent(window, 'resize').map(x => x.currentTarget.outerWidth).debounceTime(150).distinctUntilChanged().subscribe(x => {
        if (this.searchBar) {
          this.setState({ clientWidth: this.searchBar.getBoundingClientRect().width })
        }
      });
    } else if (prevState.openModal && prevState.openModal.modalId && (!this.state.openModal || !this.state.openModal.modalId)) {
      // modal open, now modal closing
      if (this.windowResizeListener && this.windowResizeListener.unsubscribe) {
        this.windowResizeListener.unsubscribe();
      }
    }
  }

  handleOpenAdvanced = () => {
    this.setState({
      openAdvancedPanel: true
    })
  }

  handleCloseAdvanced = () => {
    this.setState({
      openAdvancedPanel: false
    })
  }

  handleApplyAdvancedOptions = (parameter) => {
    const { modalId } = this.state.openModal;
    this.setState(state => ({
      ...state,
      advancedEnableIds: uniq([...state.advancedEnableIds, modalId]),
      advancedOptions: {
        ...state.advancedOptions,
        [modalId]: parameter
      }
    }));
    this.handleCloseAdvanced();
  }

  handleResetAdvanced = () => {
    const { modalId } = this.state.openModal;
    this.setState(state => ({
      ...state,
      advancedEnableIds: state.advancedEnableIds.filter(item => item !== modalId),
      advancedOptions: {
        ...state.advancedOptions,
        [modalId]: undefined
      }
    }));
    this.handleCloseAdvanced();
  }

  get getAdvancedOptions() {
    const { modalId } = this.state.openModal;
    const { advancedOptions } = this.state;
    return get(advancedOptions, modalId, {});
  }

  get getBadgeLength() {
    const { advancedOptions } = this.state;
    const { modalId } = this.state.openModal;
    const boundingPoly = get(advancedOptions, [modalId, 'boundingPoly']);
    const range = get(advancedOptions, [modalId, 'range']);
    if (!isEmpty(boundingPoly) && (!isEmpty(range) && !isEqual(sortBy(range), sortBy([0, 100])))) {
      return 2;
    }
    if ((isEmpty(boundingPoly) && (!isEmpty(range) && !isEqual(sortBy(range), sortBy([0, 100]))))) {
      return 1
    }
    if (!isEmpty(boundingPoly) && (isEmpty(range) || isEqual(sortBy(range), sortBy([0, 100])))) {
      return 1
    }
    return null;
  }

  handleGroupingKeyPress = (event) => {
    // let the user use esc to deselect all highlighted pills
    if (event.code === 'Escape' && this.state.highlightedPills.length > 0 && !this.state.selectedPill && !this.state.openModal.modalId) {
      event.preventDefault();
      this.setState({ highlightedPills: [] });
    } else if (event.code === 'KeyG' && event.shiftKey && this.state.highlightedPills.length > 1) {
      event.preventDefault();
      this.toggleGrouping();
    }
  }

  toggleGrouping = () => {
    if (this.state.highlightedPills.length <= 0) {
      return;
    }
    let first = this.props.searchParameters.findIndex(x => x.id === this.state.highlightedPills[0]);
    let last = this.props.searchParameters.findIndex(x => x.id === this.state.highlightedPills[this.state.highlightedPills.length - 1]);

    const before = this.props.searchParameters[first - 1];
    const after = this.props.searchParameters[last + 1];
    if (before && before.conditionType === 'group' && before.value === '('
      && after && after.conditionType === 'group' && after.value === ')') {
      // already an existing group
      this.props.removeSearchParameter([before.id, after.id]);
      const newSearchParameters = this.props.searchParameters.filter(x => x.id !== before.id && x.id !== after.id);
      let [simplifiedParameters, extraneousGroups] = this.simplifySearchParameters(newSearchParameters);
      this.props.removeSearchParameter(extraneousGroups);
      if (this.props.onSearch) {
        this.props.onSearch(simplifiedParameters);
      }
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
      let [simplifiedParameters, extraneousGroups] = this.simplifySearchParameters(newSearchParameters);
      this.props.removeSearchParameter(extraneousGroups);
      if (this.props.onSearch) {
        this.props.onSearch(simplifiedParameters);
      }
    }

    this.setState({ highlightedPills: [] });
  }

  getToggleGroupLabel = () => {
    let first = this.props.searchParameters.findIndex(x => x.id === this.state.highlightedPills[0]);
    let last = this.props.searchParameters.findIndex(x => x.id === this.state.highlightedPills[this.state.highlightedPills.length - 1]);
    const before = this.props.searchParameters[first - 1];
    const after = this.props.searchParameters[last + 1];
    if (before && before.conditionType === 'group' && before.value === '('
      && after && after.conditionType === 'group' && after.value === ')') {
      return 'Ungroup Selection';
    } else {
      return 'Group Selection';
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
      value: operator || this.props.defaultJoinOperator,
      conditionType: 'join'
    }, index);
  };

  togglePill = (searchParameterId, searchParameters) => {
    if (this.state.highlightedPills.length > 0) {
      // if the pill is already highlighted, unhighlight it
      let alreadyHighlightedIndex = this.state.highlightedPills.indexOf(searchParameterId);
      if (alreadyHighlightedIndex !== -1) {
        if (alreadyHighlightedIndex === 0 || alreadyHighlightedIndex === (this.state.highlightedPills.length - 1)) {
          let highlightedPills = this.state.highlightedPills.filter(x => x !== searchParameterId);
          this.setState({ highlightedPills: highlightedPills });
        }
        return;
      }

      // if there are pills already highlighted, we can only highlight their neighbors
      let pills = searchParameters.filter(x => x.conditionType !== 'join' && x.conditionType !== 'group');
      // x.conditionType !== 'group' (add this back if you want them to be able to group neighbors who are already in groups)
      let pillToHighlightIndex = pills.findIndex(x => x.id === searchParameterId);
      let firstHighlightedPillIndex = pills.findIndex(x => x.id === this.state.highlightedPills[0]);
      let lastHighlightedPillIndex = pills.findIndex(x => x.id === this.state.highlightedPills[this.state.highlightedPills.length - 1]);
      if (pillToHighlightIndex === firstHighlightedPillIndex - 1) {
        let highlightedPills = [...this.state.highlightedPills];
        highlightedPills.unshift(searchParameterId);
        this.setState({ highlightedPills: highlightedPills });
      } else if (pillToHighlightIndex === lastHighlightedPillIndex + 1) {
        let highlightedPills = [...this.state.highlightedPills];
        highlightedPills.push(searchParameterId);
        this.setState({ highlightedPills: highlightedPills });
      } else {
        // BOOP! you tried to group a non adjacent pill
        // console.warn('You tried to highlight a non-adjacent pill');
      }
    } else {
      // if there are no pills highlighted yet, we can highlight any of the pills
      const clickTargetShouldNotClearHighlightedPills = e => {
        let clickedOnHighlightedPill = e.path.find(y => y.attributes && y.attributes.getNamedItem('data-searchparameterid') && this.state.highlightedPills.indexOf(y.attributes.getNamedItem('data-searchparameterid').value) !== -1) || false;
        let clickedOnDeleteFromMenu = e.path.find(y => y.attributes && y.attributes.getNamedItem('data-preservehighlight') && y.attributes.getNamedItem('data-preservehighlight').value === 'true');
        return ((e.shiftKey === true) || clickedOnHighlightedPill || clickedOnDeleteFromMenu);
      }
      // register an event listener so when the user clicks on something that's not a highlighted pill, we'll unselect everything as long as he's not stil holding down shift
      this.unselectMouseClick = fromEvent(document, 'mousedown').takeWhile(clickTargetShouldNotClearHighlightedPills).subscribe(null, null, x => {
        this.setState({ highlightedPills: [] });
      });
      let highlightedPills = [searchParameterId];
      this.setState({ highlightedPills: highlightedPills });
    }
  }

  simplifySearchParameters(searchParameters) {
    let reduced = searchParameters.reduce((accu, searchParameter) => {
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

    let [simplifiedParameters, extraneousGroups] = reduced;
    while (simplifiedParameters.length > 2 && simplifiedParameters[0].value === '(' && simplifiedParameters[simplifiedParameters.length - 1].value === ')') {
      extraneousGroups.push(simplifiedParameters[0]);
      extraneousGroups.push(simplifiedParameters[simplifiedParameters.length - 1]);

      simplifiedParameters.pop();
      simplifiedParameters.shift();
    }


    return [simplifiedParameters, extraneousGroups];
  }

  removePill = (searchParameterId, searchParameters) => {
    const updatedSearchParameters = this.simpleRemovePill(searchParameterId, searchParameters);
    if (this.props.onSearch) {
      this.props.onSearch(updatedSearchParameters);
    }
    this.setState({ highlightedPills: [] });
    return updatedSearchParameters;
  };

  simpleRemovePill = (searchParameterId, searchParameters) => {
    const paramsContentTypes = searchParameters.map(param => param.conditionType);
    const {
      advancedEnableIds,
      advancedOptions
    } = this.state;
    advancedEnableIds.forEach(id => {
      const newAdvancedEnableIds = advancedEnableIds.filter(item => item !== id)
      if (!includes(paramsContentTypes, id)) {
        this.setState(state => ({
          ...state,
          advancedEnableIds: newAdvancedEnableIds,
          advancedOptions: {
            ...advancedOptions,
            [id]: undefined
          }
        }))
      }
    })
    let index = searchParameters.findIndex(x => x.id === searchParameterId);
    let previousParameter = searchParameters[index - 1];
    let newSearchParameters = null;

    let pillsToRemove = [];
    // if the pill to be removed is the start of a group, we need to remove the next joining parameter and not the previous one
    if ((previousParameter && previousParameter.value === '(') || (index === 0 && this.numberOfPills(searchParameters) > 1)) {
      pillsToRemove.push(searchParameterId);
      pillsToRemove.push(searchParameters[index + 1].id);
      newSearchParameters = searchParameters.filter(x => x.id !== searchParameterId && x.id !== searchParameters[index + 1].id);
    } else if (this.numberOfPills(searchParameters) > 1) {
      // if the pill to be removed is in the middle of a group, remove the last joining parameter
      let lastJoiningParameter = searchParameters.slice(0, index).reverse().find(x => x.conditionType === 'join');
      pillsToRemove.push(searchParameterId);
      pillsToRemove.push(lastJoiningParameter.id);
      newSearchParameters = searchParameters.filter(x => x.id !== searchParameterId && x.id !== lastJoiningParameter.id);
    } else {
      // remove a single pill
      pillsToRemove.push(searchParameterId);
      newSearchParameters = searchParameters.filter(x => x.id !== searchParameterId);
    }
    let [simplifiedParameters, extraneousGroups] = this.simplifySearchParameters(newSearchParameters);
    this.props.removeSearchParameter(pillsToRemove.concat(extraneousGroups.map(x => x.id)));
    return simplifiedParameters;
  };

  getRemovePill = searchParameters => {
    return searchParameterId => {
      this.removePill(searchParameterId, searchParameters);
    };
  };

  getLastJoiningOperator = (searchParameters) => {
    for (let i = searchParameters.length - 1; i >= 0; i--) {
      if (searchParameters[i].conditionType === 'join') {
        return searchParameters[i].value;
      }
    }
    return null;
  }

  numberOfPills = (searchParameters) => searchParameters.reduce((accu, searchParameter) => {
    if (searchParameter.conditionType !== 'join' && searchParameter.conditionType !== 'group') {
      return accu + 1;
    } else {
      return accu;
    }
  }, 0);

  addNewSearchParameter = (parameter, engineId) => {
    // if there's no selected pill, we're adding a new search parameter so add a joining operator if there are more than one pill
    if (this.numberOfPills(this.props.searchParameters) > 0) {
      const lastJoiningOperator = this.getLastJoiningOperator(this.props.searchParameters);
      this.addJoiningOperator(lastJoiningOperator);
    }

    this.props.addOrModifySearchParameter({
      value: {
        ...parameter,
        advancedOptions: this.getAdvancedOptions
      },
      conditionType: engineId
    });
  }

  replaceSearchParameter = (parameterValue, engineId, searchParameterId) => {
    this.props.addOrModifySearchParameter({
      value: {
        ...parameterValue,
        advancedOptions: this.getAdvancedOptions
      },
      conditionType: engineId,
      id: searchParameterId
    });
  }

  openPill = pillState => {
    this.setState({
      openModal: {
        modalId: pillState.conditionType,
        modalState: pillState.value
      },
      selectedPill: pillState.id,
      advancedOptions: {
        [pillState.conditionType]: get(pillState, "value.advancedOptions", {})
      }
    });
  };

  handleMenuOpen = (target, searchParameter) => {
    let menuOptions;
    if (searchParameter.conditionType === 'join') {
      menuOptions = [
        {
          label: 'AND',
          onClick: () => { this.menuChangeOperator(searchParameter, 'and') }
        },
        {
          label: 'OR',
          onClick: () => { this.menuChangeOperator(searchParameter, 'or') }
        },
        {
          divider: true
        },
        {
          label: 'Insert Search Term to Left',
          onClick: () => { this.menuInsertDirection('left') }
        },
        {
          label: 'Insert Search Term to Right',
          onClick: () => { this.menuInsertDirection('right') }
        }
      ];
    } else {
      const showGroupOptions = this.state.highlightedPills.length > 1 && this.state.highlightedPills.includes(searchParameter.id);
      if (showGroupOptions) {
        menuOptions = [
          {
            label: this.getToggleGroupLabel(),
            onClick: this.menuGroupSelection,
            preserveHighlight: 'true'
          },
          {
            label: 'Delete',
            onClick: this.menuRemoveHighlightedPills,
            preserveHighlight: 'true'
          }
        ];
      } else {
        menuOptions = [
          {
            label: 'Edit',
            onClick: this.menuEditPill
          },
          {
            label: 'Delete',
            onClick: this.menuRemovePill
          },
          {
            divider: true
          },
          {
            label: 'Insert Search Term to Left',
            onClick: () => { this.menuInsertDirection('left') }
          },
          {
            label: 'Insert Search Term to Right',
            onClick: () => { this.menuInsertDirection('right') }
          }
        ];
      }
    }

    this.setState({
      menuAnchorEl: target,
      selectedPill: searchParameter.id,
      menuOptions
    });
  }

  openMenuExtraActions = (evt) => {
    let customMenuActions = (this.props.menuActions && this.props.menuActions.map(x => ({
      label: x.label,
      onClick: () => {
        x.onClick(this.props.getCSP());
        this.handleMenuClose();
      }
    }))) || {};

    // don't show custom menu actions if there are no search parameters
    if (!this.props.searchParameters || this.props.searchParameters.length === 0) {
      customMenuActions = {};
    }
    // if there are search parameters and savedSearch is not disabled, add them as extra options
    if (this.props.disableSavedSearch) {
      customMenuActions = [
        ...customMenuActions,
      ]
    } else {
      if (this.props.searchParameters && this.props.isEditor && this.props.searchParameters.length > 0) {
        customMenuActions = [
          { label: 'Load Search Profile', onClick: (e) => { this.props.showLoadSavedSearch(e); this.handleMenuClose() } },
          { label: 'Save Search Profile', onClick: (e) => { this.props.showSavedSearch(e); this.handleMenuClose() } },
          ...customMenuActions,
        ]
      } else {
        customMenuActions = [
          { label: 'Load Search Profile', onClick: (e) => { this.props.showLoadSavedSearch(e); this.handleMenuClose() } },
          ...customMenuActions,
        ]
      }
    }

    if (customMenuActions && customMenuActions.length > 0) {
      customMenuActions = [
        ...customMenuActions,
        { divider: true },
      ]
    }

    const menuActions = [
      ...customMenuActions,
      { label: 'Reset Search Bar', onClick: this.resetSearchParameters }
    ]

    this.setState({
      menuAnchorEl: evt.nativeEvent.path.find(x => x.type === 'button'),
      selectedPill: null,
      menuOptions: menuActions
    });
  }

  handleMenuClose = () => {
    this.setState({
      menuAnchorEl: null,
      selectedPill: null,
      menuOptions: null
    });
  }

  menuChangeOperator = (searchParameter, newOperatorValue) => {
    const newParameter = {
      ...searchParameter,
      value: newOperatorValue
    };
    this.props.addOrModifySearchParameter(newParameter);
    this.setState({
      menuAnchorEl: null,
      selectedPill: null
    }, () => {
      if (this.props.onSearch) {
        this.props.onSearch();
      }
    });

  }

  menuInsertDirection = (insertDirection) => {
    this.setState({
      menuAnchorEl: null,
      openModal: { modalId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182' }, //TODO dont use hardcoded id
      insertDirection
    }, () => {
      if (this.props.onSearch) {
        this.props.onSearch();
      }
    });
  }

  menuRemovePill = () => {
    this.removePill(this.state.selectedPill, this.props.searchParameters);
    this.setState({
      menuAnchorEl: null,
      selectedPill: null
    });
  }

  menuRemoveHighlightedPills = () => {
    let simplifiedParameters = this.props.searchParameters;
    this.state.highlightedPills && this.state.highlightedPills.forEach((highlightedPill) => {
      simplifiedParameters = this.simpleRemovePill(highlightedPill, simplifiedParameters);
    });
    this.setState({
      menuAnchorEl: null,
      selectedPill: null
    }, () => {
      if (this.props.onSearch) {
        this.props.onSearch();
      }
    });
  }

  menuEditPill = () => {
    const selectedPill = this.props.searchParameters.find(x => x.id === this.state.selectedPill);
    this.openPill(selectedPill);
    this.setState({
      menuAnchorEl: null
    });
  }

  menuGroupSelection = () => {
    this.toggleGrouping();
    this.setState({
      menuAnchorEl: null,
      selectedPill: null
    })
  }

  cancelModal = () => {
    this.setState({
      openModal: { modalId: null },
      selectedPill: null,
      insertDirection: null,
      advancedOptions: {},
      disableAdvancedSearch: true
    });
  };

  addOrEditModal = () => {
    if (this.state.selectedPill) {
      //insert new pill next to selected pill
      if (this.state.insertDirection) {
        const selectedPillIndex = this.props.searchParameters.findIndex(x => x.id === this.state.selectedPill)
        const insertAt = this.state.insertDirection === 'left' ? selectedPillIndex : selectedPillIndex + 1;
        const newSearchParameterValue = this.openModal.returnValue();
        if (!newSearchParameterValue) {
          return;
        }
        const searchTermParam = {
          value: newSearchParameterValue,
          conditionType: this.state.openModal.modalId
        };
        const operatorParam = {
          value: 'and',
          conditionType: 'join'
        };
        const selectedParamConditionType = this.props.searchParameters[selectedPillIndex].conditionType;
        const newParams = ((selectedParamConditionType === 'join' && this.state.insertDirection === 'left') || (selectedParamConditionType !== 'join' && this.state.insertDirection === 'right'))
          ? [operatorParam, searchTermParam]
          : [searchTermParam, operatorParam];
        this.props.addOrModifySearchParameter(newParams, insertAt);
        this.setState({
          openModal: { modalId: null, key: guid() },
          selectedPill: null,
          insertDirection: null,
          disableAdvancedSearch: true
        }, () => {
          if (this.props.onSearch) {
            this.props.onSearch();
          }
        });
      } else {
        const newSearchParameterValue = this.openModal.returnValue();
        if (!newSearchParameterValue) {
          return;
        }
        this.replaceSearchParameter(newSearchParameterValue, this.state.openModal.modalId, this.state.selectedPill);
        this.setState({
          openModal: { modalId: null, key: guid() },
          selectedPill: null,
          insertDirection: null,
          disableAdvancedSearch: true
        }, () => {
          if (this.props.onSearch) {
            this.props.onSearch();
          }
        });
      }
    } else {
      const newSearchParameterValue = this.openModal.returnValue();
      if (!newSearchParameterValue) {
        return;
      }
      this.addNewSearchParameter(newSearchParameterValue, this.state.openModal.modalId);
      let lastModal = this.state.openModal.modalId;
      this.setState({
        openModal: { modalId: '' + lastModal, key: guid() },
        disableAdvancedSearch: true
      }, () => {
        if (this.props.onSearch) {
          this.props.onSearch();
        }
      });
    }
  }

  resetSearchParameters = () => {
    this.setState({
      openModal: { modalId: null },
      selectedPill: null,
      menuAnchorEl: null,
      highlightedPills: [],
      disableAdvancedSearch: true
    });
    this.props.resetSearchParameters();
    if (this.props.onSearch) {
      this.props.onSearch([]);
    }
  }

  onEnter = (event) => {
    if (event.key === 'Enter' && event.repeat === false) {
      this.addOrEditModal();
    }
  }

  onChangeSearchInput = (result) => {
    this.setState({ disableAdvancedSearch: !(result) });
  }

  addPillEngineButton = engineCategory => () => {
    const { modalId } = this.state.openModal;
    if (modalId) {
      this.setState({
        openModal: { modalId: engineCategory.id },
        key: guid(),
        disableAdvancedSearch: true
      })
    } else {
      this.props.addPill()
    }
  }

  get disableAdvancedSearch() {
    if (this.state.selectedPill) {
      return false;
    }
    return this.state.disableAdvancedSearch;
  }

  render() {
    const openModal = this.props.enabledEngineCategories.find(
      x => x.id === this.state.openModal.modalId
    );
    const Modal = openModal && openModal.modal ? openModal.modal : null;
    const libraryIds = this.props.libraries && this.props.libraries.map(library => library.id);
    const selectedPill = this.props.searchParameters.find(x => x.id === this.state.selectedPill);
    const { isAdvancedSearchEnabled, classes } = this.props;
    const horizontalAnchorPosition = this.state.menuAnchorEl && this.state.menuAnchorEl.type === 'button' ? { horizontal: 'right' } : { horizontal: 'left' };
    const supportedCategoriesClass = cx(classes['supportedCategories']);

    return (
      <div ref={(input) => { this.searchBar = input; }} style={{ width: '100%', overflowY: 'hidden', borderRadius: '8px' }} data-veritone-component={`search_bar_${this._id}`}>
        <SearchBar
          onSearch={this.props.onSearch}
          color={this.props.color}
          enabledEngineCategories={this.props.enabledEngineCategories}
          searchParameters={this.props.searchParameters}
          addJoiningOperator={this.props.addJoiningOperator}
          highlightedPills={this.state.highlightedPills}
          togglePill={this.togglePill}
          libraries={this.props.libraries}
          addPill={this.addPill}
          selectedPill={selectedPill}
          removePill={this.getRemovePill(this.props.searchParameters)}
          openPill={this.openPill}
          modifyPill={this.props.addOrModifySearchParameter}
          openMenu={this.handleMenuOpen}
          openMenuExtraActions={this.openMenuExtraActions}
          resetSearchParameters={this.resetSearchParameters}
          disabledSavedSearch={this.props.disabledSavedSearch}
        />
        <Menu
          open={Boolean(this.state.menuAnchorEl)}
          onClose={this.handleMenuClose}
          anchorEl={this.state.menuAnchorEl}
          anchorOrigin={{ vertical: 'bottom', ...horizontalAnchorPosition }}
          transformOrigin={horizontalAnchorPosition}
          getContentAnchorEl={null} //required to be able to set anchorOrigin and anchorEl
        >
          {
            this.state.menuOptions && this.state.menuOptions.map(menuOption =>
              menuOption.divider ? <Divider key={'menu_divider'} /> :
                (
                  <MenuItem key={menuOption.label} data-veritone-element={`${menuOption.label.toLowerCase().split(' ').join('_')}`} onClick={menuOption.onClick} data-preservehighlight={menuOption.preserveHighlight}>
                    {menuOption.label}
                  </MenuItem>
                )
            )
          }
        </Menu>
        {Modal ? (
          <Popover
            id="simple-menu"
            anchorEl={this.searchBar}
            anchorOrigin={{ vertical: "bottom" }}
            marginThreshold={0}
            elevation={2}
            open
            onClose={this.cancelModal}
            onKeyPress={this.onEnter}
          >
            <Card
              className={cx(classes['engineCategoryModal'])}
              style={{ width: this.state.clientWidth || this.searchBar.getBoundingClientRect().width }}
              elevation={0}>
              <CardHeader
                avatar={
                  <Icon iconClass={openModal.iconClass} color={'grey '} size={'2em'} />
                }
                classes={{ action: cx(classes['modalAction']) }}
                action={
                  <div className={supportedCategoriesClass}>
                    {this.props.enabledEngineCategories &&
                      this.props.enabledEngineCategories.map(engineCategory => (
                        <EngineCategoryButton
                          key={engineCategory.id}
                          engineCategory={engineCategory}
                          backgroundColor={engineCategory.id === this.state.openModal.modalId ? this.props.color : undefined}
                          color={engineCategory.id === this.state.openModal.modalId ? '#ffffff' : undefined}
                          addPill={this.addPillEngineButton(engineCategory)}
                        />
                      ))}
                  </div>
                }
                title={(
                  <span data-veritone-element={`search-category-label-${openModal.dataTag}`} >{openModal.title}</span>
                )}
                subheader={openModal.subtitle}
                style={{ marginTop: 0, marginRight: 0 }}
              />
              <CardContent style={{ margin: "0.5em", paddingTop: "0", paddingBottom: "0" }}>
                {Modal ? (
                  <Modal
                    // the guid generation in the key is on purpose.
                    // basically, when a new modal of the exact same type is added, we use setState with the same modalId to
                    // force a rerender, which generates a new guid, thereby resetting the modal
                    // (this is preferrable to making every engine category modal implement a reset function)
                    // if we want to allow for rerenders while preserving the modal component, uncomment out guid() and
                    // explicity set openModal.key
                    key={this.state.openModal.key}
                    open
                    ref={(input) => { this.openModal = input; }}
                    //setGetModalValue={ (input) => { this.openModal = input; console.log("Accessor function", input) } }
                    api={this.props.api}
                    auth={this.props.auth}
                    libraries={libraryIds}
                    modalState={this.state.openModal.modalState}
                    cancel={this.cancelModal}
                    applyFilter={this.addOrEditModal}
                    presetSDOSchema={this.state.openModal.modalId === 'sdo-search-id' ? this.props.presetSDOSchema : undefined}
                    presetSDOAttribute={this.state.openModal.modalId === 'sdo-search-id' ? this.props.presetSDOAttribute : undefined}
                    sourceFilters={this.state.openModal.modalId === 'sdo-search-id' ? this.props.sourceFilters : undefined}
                    onChangeSearchInput={this.onChangeSearchInput}
                  />
                ) : null}
              </CardContent>
              <CardActions classes={{ root: cx(classes['modalFooterActions']) }} style={{ padding: "1em" }}>
                {isAdvancedSearchEnabled && (openModal.dataTag === 'object' || openModal.dataTag === 'logo') ? (
                  <div className={cx(classes["advancedButton"])}>
                    <Button disabled={this.disableAdvancedSearch} onClick={this.handleOpenAdvanced}>ADVANCED</Button>
                    {this.getBadgeLength && !this.disableAdvancedSearch ? <div className={cx(classes["customBadge"])}>
                      {this.getBadgeLength}
                    </div> : null}
                  </div>
                ) : ""}
                <Button onClick={this.cancelModal} color="primary" className={cx(classes['cancelButton'])}>
                  Close
                </Button>
                <Button
                  onClick={this.addOrEditModal}
                  color="primary"
                  className="transcriptSubmit"
                >
                  {this.state.selectedPill && !this.state.insertDirection ?
                    ((selectedPill.conditionType === openModal.id && this.state.openModal.modalState !== undefined) ? 'Save' : 'Replace')
                    :
                    'Add'
                  }
                </Button>
              </CardActions>
            </Card>
            {isAdvancedSearchEnabled && <AdvancedPanel
              open={this.state.openAdvancedPanel}
              handleClose={this.handleCloseAdvanced}
              handleReset={this.handleResetAdvanced}
              advancedOptions={this.getAdvancedOptions}
              onAddAdvancedSearchParams={this.handleApplyAdvancedOptions}
              searchByTag={openModal.dataTag}
            />}
          </Popover>
        ) : null}

      </div>
    );
  }
}

export default withStyles(styles)(SearchBarContainer);

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
