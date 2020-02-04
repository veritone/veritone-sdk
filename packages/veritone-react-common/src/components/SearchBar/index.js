/* eslint-disable operator-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import cx from 'classnames';
import {
  string,
  bool,
  arrayOf,
  shape,
  func,
  object,
  node,
  any,
} from 'prop-types';

import Chip from '@material-ui/core/Chip';

import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import Typography from '@material-ui/core/Typography';
import { withTheme } from '@material-ui/core/styles';

import { interval } from 'rxjs/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import { fromEvent } from 'rxjs/observable/fromEvent';
import SearchPill from './SearchPill';

import styles from './styles.scss';

const containerClasses = cx(styles.searchBar);

const searchInputContainerClass = cx(styles.searchInput);

const GhostInput = ({ showGhost, onFocus }) => (
  <span
    onClick={onFocus}
    maxLength="0"
    className={cx(styles.afterCursor)}
    type="textbox"
    size="1"
  >
    {showGhost ? (
      <Typography color="textSecondary" variant="subtitle1">
        Search Veritone
      </Typography>
    ) : null}
  </span>
);

GhostInput.propTypes = {
  showGhost: bool,
  onFocus: func,
};

const JoiningOperator = ({ operator, onClick }) => (
  <Chip
    label={operator}
    onClick={onClick}
    classes={{ label: cx(styles.joinOperatorChip) }}
    style={{
      background: 'transparent',
      color: '#2196F3',
      paddingLeft: 0,
      paddingRight: 0,
    }}
  />
);

JoiningOperator.propTypes = {
  operator: node,
  onClick: func,
};

const SearchParameters = withTheme(
  ({
    theme,
    searchParameters,
    level,
    togglePill,
    highlightedPills,
    selectedPill,
    enabledEngineCategories,
    openPill,
    removePill,
    addPill,
    libraries,
    openMenu,
  }) => {
    const output = [];

    // need to do a pass over the search parameters to build a tree so we can render groups cleanly
    // creates a structure where {id: number}
    // id being the id of the pill at the start of the group
    // and number being the number of elements in the group
    const groups = {};
    let startOfGroup = null;
    let treeLevel = 0;
    for (let i = 0; i < searchParameters.length; i += 1) {
      if (searchParameters[i].value === '(') {
        if (treeLevel === 0) {
          startOfGroup = searchParameters[i].id;
        }
        treeLevel += 1;
      } else if (searchParameters[i].value === ')') {
        treeLevel -= 1;
        if (treeLevel === 0) {
          groups[startOfGroup] = {
            endOfGroup: i,
            afterGroup:
              searchParameters[i + 1] && searchParameters[i + 1].conditionType,
          };
          startOfGroup = null;
        }
      }
    }

    for (let i = 0; i < searchParameters.length; i += 1) {
      const searchParameter = searchParameters[i];
      if (searchParameter.conditionType === 'join') {
        const onClick = e => {
          openMenu(e.currentTarget, searchParameter);
        };
        output.push(
          <JoiningOperator
            key={searchParameter.id}
            operator={searchParameter.value}
            onClick={onClick}
          />
        );
      } else if (searchParameter.conditionType === 'group') {
        if (groups[searchParameter.id]) {
          let nestedGroupStyling = '';
          if (
            searchParameters[i - 1] &&
            searchParameters[i - 1].conditionType !== 'group'
          ) {
            nestedGroupStyling += `${cx(styles.searchGroupNestedLeft)} `;
          }
          if (
            groups[searchParameter.id].afterGroup &&
            groups[searchParameter.id].afterGroup !== 'group'
          ) {
            nestedGroupStyling += cx(styles.searchGroupNestedRight);
          }
          const stylingClass =
            level === 0 ? cx(styles.searchGroup) : nestedGroupStyling;

          output.push(
            <span
              style={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'nowrap',
                borderColor: theme.palette.primary.main,
              }}
              className={stylingClass}
              key={`search_container_${searchParameter.id}`}
            >
              <SearchParameters
                key={`search_parameters_grouping_${searchParameter.id}_${level}`}
                searchParameters={searchParameters.slice(
                  i + 1,
                  groups[searchParameter.id].endOfGroup
                )}
                level={level + 1}
                enabledEngineCategories={enabledEngineCategories}
                highlightedPills={highlightedPills}
                selectedPill={selectedPill}
                togglePill={togglePill}
                addPill={addPill}
                openPill={openPill}
                removePill={removePill}
                libraries={libraries}
                openMenu={openMenu}
              />
            </span>
          );
          i = groups[searchParameter.id].endOfGroup;
        }
      } else if (searchParameter.conditionType !== 'join') {
        const searchParameterEngine = enabledEngineCategories.find(
          engineCategory => engineCategory.id === searchParameter.conditionType
        );

        const { abbreviation, exclude } = searchParameterEngine
          ? searchParameterEngine.getLabel(searchParameter.value)
          : { abbreviation: undefined, thumbnail: undefined };
        const remove = () => removePill(searchParameter.id);

        const onClick = e => {
          if (e.shiftKey) {
            togglePill(searchParameter.id, searchParameters);
          } else {
            openMenu(e.currentTarget, searchParameter);
          }
        };
        output.push(
          <SearchPill
            key={searchParameter.id}
            id={searchParameter.id}
            engineIconClass={searchParameterEngine.iconClass}
            onClick={onClick}
            exclude={exclude}
            highlighted={highlightedPills.indexOf(searchParameter.id) !== -1}
            selected={
              selectedPill ? searchParameter.id === selectedPill.id : false
            }
            label={abbreviation}
            remove={remove}
          />
        );
      }
    }
    return output;
  }
);

class SearchBar extends React.Component {
  state = {
    showScrollBar: false,
  };

  addPill = () => {
    const categoryToAdd = this.props.enabledEngineCategories[0].id;
    this.props.addPill(categoryToAdd);
  };

  componentDidUpdate(prevProps) {
    if (
      this.hashSearchParameters(prevProps.searchParameters) !==
      this.hashSearchParameters(this.props.searchParameters)
    ) {
      this.updateScrollState();
    }
  }

  updateScrollState() {
    const showScrollBar = this.scrollContainer
      ? this.scrollContainer.scrollWidth > this.scrollContainer.clientWidth &&
        this.props.searchParameters.length > 0
      : false;
    this.setState({ showScrollBar });
  }

  scrollLeft = step => {
    if (this.scrollContainer) {
      const amount = step && step > 5 ? 5 : step;
      this.scrollContainer.scrollLeft =
        this.scrollContainer.scrollLeft - amount * 10;
      this.updateScrollState();
    }
  };

  scrollRight = step => {
    if (this.scrollContainer) {
      const amount = step && step > 5 ? 5 : step;
      this.scrollContainer.scrollLeft =
        this.scrollContainer.scrollLeft + amount * 10;
      this.updateScrollState();
    }
  };

  mouseDown = direction => e => {
    if (direction === 'left') {
      this.scrollLeft(10);
    } else {
      this.scrollRight(10);
    }

    if (!this.scrollListener) {
      this.scrollListener = interval(50)
        .takeUntil(fromEvent(e.target, 'mouseup'))
        .subscribe(
          x => {
            if (direction === 'left') {
              this.scrollLeft(x);
            } else {
              this.scrollRight(x);
            }
          },
          null,
          () => {
            this.scrollListener = null;
          }
        );
    } else {
      this.scrollListener.unsubscribe();
      this.scrollListener = null;
    }
  };

  hashSearchParameters = searchParameters => {
    const hash = searchParameters.reduce((x, y) => x + y.id, '');
    return hash;
  };

  render() {
    return (
      <div className={containerClasses}>
        {this.state.showScrollBar ? (
          <span onMouseDown={this.mouseDown('left')}>
            <IconButton classes={{ root: cx(styles.resetButton) }}>
              <KeyboardArrowLeft />
            </IconButton>
          </span>
        ) : null}
        <div
          className={searchInputContainerClass}
          ref={input => {
            this.scrollContainer = input;
          }}
        >
          {
            <SearchParameters
              key={'top_level_search_parameters'}
              searchParameters={this.props.searchParameters}
              level={0}
              enabledEngineCategories={this.props.enabledEngineCategories}
              highlightedPills={this.props.highlightedPills}
              togglePill={this.props.togglePill}
              addPill={this.props.addPill}
              openPill={this.props.openPill}
              removePill={this.props.removePill}
              libraries={this.props.libraries}
              selectedPill={this.props.selectedPill}
              color={this.props.color}
              openMenu={this.props.openMenu}
            />
          }
          {
            <GhostInput
              key="input_cursor"
              onFocus={this.addPill}
              showGhost={
                !this.props.searchParameters ||
                this.props.searchParameters.length === 0
              }
            />
          }
        </div>
        {this.state.showScrollBar ? (
          <span onMouseDown={this.mouseDown('right')}>
            <IconButton classes={{ root: cx(styles.resetButton) }}>
              <KeyboardArrowRight />
            </IconButton>
          </span>
        ) : null}
        {
          <IconButton
            onClick={this.props.openMenuExtraActions}
            data-veritone-element={'more_actions'}
            classes={{ root: cx(styles.resetButton) }}
          >
            <MoreVert />
          </IconButton>
        }
      </div>
    );
  }
}

const condition = {
  id: string.isRequired,
  value: object.isRequired,
  conditionType: string.isRequired,
};

const supportedEngineCategoryType = {
  id: string.isRequired,
  name: string.isRequired,
  tooltip: string.isRequired,
  iconClass: string.isRequired,
  enablePill: bool,
  showPill: bool,
  addPilll: func,
};

SearchBar.propTypes = {
  color: string.isRequired,
  libraries: arrayOf(object),
  searchParameters: arrayOf(shape(condition)),
  enabledEngineCategories: arrayOf(shape(supportedEngineCategoryType)),
  onSearch: func,
  addPill: func,
  openPill: func,
  removePill: func,
  openMenuExtraActions: func,
  openMenu: func,
  selectedPill: any,
  highlightedPills: any,
  togglePill: func,
};

SearchBar.defaultProps = {
  color: '#eeeeee',
  enabledEngineCategories: [],
  searchParameters: [],
  addPill: id => console.log('Open search pill modal', id),
};

export { SearchBar, supportedEngineCategoryType };
