import React from 'react';
import cx from 'classnames';
import { string, bool, arrayOf, shape, func, object, any } from 'prop-types';

import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import Typography from '@material-ui/core/Typography';
import { withTheme, makeStyles, withStyles } from '@material-ui/core/styles';

import { interval } from 'rxjs/observable/interval';
import { fromEvent } from 'rxjs/observable/fromEvent';

import "rxjs/add/operator/take";
import "rxjs/add/operator/takeUntil";

import SearchPill from './SearchPill';

import styles from './styles';

const useStyles = makeStyles(styles);

const GhostInput = ({ showGhost, onFocus }) => {
  const classes = useStyles();

  return (
    <span onClick={onFocus} maxLength="0" className={cx(classes['afterCursor'])} type="textbox" size="1">
      {showGhost ? <Typography color="textSecondary" variant="subtitle1">Search Veritone</Typography> : null}
    </span>
  )
}

GhostInput.propTypes = {
  showGhost: bool,
  onFocus: func,
}

const JoiningOperator = ({ operator, onClick }) => {
  const classes = useStyles();

  return (
    <Chip
      label={operator}
      onClick={onClick}
      classes={{ label: cx(classes['joinOperatorChip']) }}
      style={{ background: 'transparent', color: '#2196F3', paddingLeft: 0, paddingRight: 0 }}
    />
  );
}

JoiningOperator.propTypes = {
  operator: any,
  onClick: func,
}

const SearchParameters = withTheme(({ theme, searchParameters, level, togglePill, highlightedPills, selectedPill, enabledEngineCategories, openPill, removePill, addPill, libraries, openMenu }) => {
  const classes = useStyles();
  let output = [];

  // need to do a pass over the search parameters to build a tree so we can render groups cleanly
  // creates a structure where {id: number}
  // id being the id of the pill at the start of the group
  // and number being the number of elements in the group
  const groups = {};
  let startOfGroup = null;
  let treeLevel = 0;
  for (let i = 0; i < searchParameters.length; i++) {
    if (searchParameters[i].value === '(') {
      if (treeLevel === 0) {
        startOfGroup = searchParameters[i].id;
      }
      treeLevel++;
    } else if (searchParameters[i].value === ')') {
      treeLevel--;
      if (treeLevel === 0) {
        groups[startOfGroup] = { endOfGroup: i, afterGroup: searchParameters[i + 1] && searchParameters[i + 1].conditionType };
        startOfGroup = null;
      }
    }
  }

  for (let i = 0; i < searchParameters.length; i++) {
    let searchParameter = searchParameters[i];
    if (searchParameter.conditionType === 'join') {
      const onClick = (e) => {
        openMenu(e.currentTarget, searchParameter);
      };
      output.push(
        <JoiningOperator
          key={searchParameter.id}
          operator={searchParameter.value}
          onClick={onClick}
        />
      )
    } else if (searchParameter.conditionType === 'group') {
      if (groups[searchParameter.id]) {
        let nestedGroupStyling = '';
        if (searchParameters[i - 1] && searchParameters[i - 1].conditionType !== 'group') {
          nestedGroupStyling += cx(classes['searchGroupNestedLeft']) + " ";
        }
        if (groups[searchParameter.id].afterGroup && groups[searchParameter.id].afterGroup !== 'group') {
          nestedGroupStyling += cx(classes['searchGroupNestedRight']);
        }
        const stylingClass = level === 0 ? cx(classes['searchGroup']) : nestedGroupStyling;

        output.push(
          <span style={{ alignItems: "center", display: "flex", flexWrap: "nowrap", borderColor: theme.palette.primary.main }} className={stylingClass} key={`search_container_${searchParameter.id}`}>
            <SearchParameters
              key={`search_parameters_grouping_${searchParameter.id}_${level}`}
              searchParameters={searchParameters.slice(i + 1, groups[searchParameter.id].endOfGroup)}
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
        )
        i = groups[searchParameter.id].endOfGroup;
      }
    } else if (searchParameter.conditionType !== 'join') {
      const searchParameterEngine = enabledEngineCategories.find(engineCategory => engineCategory.id === searchParameter.conditionType);

      const { abbreviation, exclude } = searchParameterEngine ? searchParameterEngine.getLabel(searchParameter.value) : { abbreviation: undefined, thumbnail: undefined };
      const remove = () => removePill(searchParameter.id);

      const onClick = (e) => {
        if (e.shiftKey) {
          togglePill(searchParameter.id, searchParameters);
        } else {
          openMenu(e.currentTarget, searchParameter);
        }
      }
      output.push(
        <SearchPill
          key={searchParameter.id}
          id={searchParameter.id}
          engineIconClass={searchParameterEngine.iconClass}
          onClick={onClick}
          exclude={exclude}
          highlighted={highlightedPills.indexOf(searchParameter.id) !== -1}
          selected={selectedPill ? searchParameter.id === selectedPill.id : false}
          label={abbreviation}
          remove={remove}
        />
      );
    }
  }
  return output;
});

class SearchBarComponents extends React.Component {

  state = {
    showScrollBar: false
  }

  addPill = () => {
    let categoryToAdd = this.props.enabledEngineCategories[0].id;
    this.props.addPill(categoryToAdd);
  }

  componentDidUpdate(prevProps) {
    if (this.hashSearchParameters(prevProps.searchParameters) !== this.hashSearchParameters(this.props.searchParameters)) {
      this.updateScrollState();
    }
  }

  updateScrollState() {
    const showScrollBar = this.scrollContainer ? this.scrollContainer.scrollWidth > this.scrollContainer.clientWidth && this.props.searchParameters.length > 0 : false;
    this.setState({ showScrollBar: showScrollBar });
  }

  scrollLeft = (step) => {
    if (this.scrollContainer) {
      let amount = step && step > 5 ? 5 : step
      this.scrollContainer.scrollLeft = this.scrollContainer.scrollLeft - (amount * 10);
      this.updateScrollState();
    }
  }

  scrollRight = (step) => {
    if (this.scrollContainer) {
      let amount = step && step > 5 ? 5 : step
      this.scrollContainer.scrollLeft = this.scrollContainer.scrollLeft + (amount * 10);
      this.updateScrollState();
    }
  }

  mouseDown = (direction) => {
    return (e) => {
      if (direction === 'left') {
        this.scrollLeft(10);
      } else {
        this.scrollRight(10);
      }

      if (!this.scrollListener) {
        this.scrollListener = interval(50).takeUntil(fromEvent(e.target, 'mouseup')).subscribe(x => {
          if (direction === 'left') {
            this.scrollLeft(x);
          } else {
            this.scrollRight(x);
          }
        }, null, () => this.scrollListener = null);
      } else {
        this.scrollListener.unsubscribe();
        this.scrollListener = null;
      }
    }
  }

  hashSearchParameters = (searchParameters) => {
    const hash = searchParameters.reduce((x, y) => (x + y.id), "");
    return hash;
  }

  render() {
    const { classes } = this.props;
    const containerClasses = cx(classes['searchBar']);
    const searchInputContainerClass = cx(classes['searchInput']);

    return (
      <div className={containerClasses}>
        {this.state.showScrollBar ? (
          <span onMouseDown={this.mouseDown('left')}>
            <IconButton classes={{ root: cx(classes['resetButton']) }}>
              <KeyboardArrowLeft />
            </IconButton>
          </span>
        ) : null}
        <div className={searchInputContainerClass} ref={(input) => { this.scrollContainer = input; }}>
          {<SearchParameters
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
          />}
          {<GhostInput key="input_cursor" onFocus={this.addPill} showGhost={!this.props.searchParameters || this.props.searchParameters.length === 0} />}
        </div>
        {this.state.showScrollBar ? (
          <span onMouseDown={this.mouseDown('right')}>
            <IconButton classes={{ root: cx(classes['resetButton']) }}>
              <KeyboardArrowRight />
            </IconButton>
          </span>
        ) : null
        }
        {
          <IconButton onClick={this.props.openMenuExtraActions} data-veritone-element={"more_actions"} classes={{ root: cx(classes['resetButton']) }}>
            <MoreVert />
          </IconButton>
        }
      </div>
    )
  }
}

const supportedEngineCategoryType = {
  id: string.isRequired,
  name: string.isRequired,
  tooltip: string.isRequired,
  iconClass: string.isRequired,
  enablePill: bool,
  showPill: bool,
  addPilll: func
};

const condition = {
  id: string.isRequired,
  value: object.isRequired,
  conditionType: string.isRequired
};

SearchBarComponents.propTypes = {
  color: string.isRequired,
  libraries: arrayOf(object),
  searchParameters: arrayOf(shape(condition)),
  enabledEngineCategories: arrayOf(shape(supportedEngineCategoryType)),
  onSearch: func,
  addPill: func,
  openPill: func,
  removePill: func,
  classes: shape({ any }),
  openMenu: func,
  openMenuExtraActions: func,
  SearchParameters: shape({ any }),
  highlightedPills: any,
  togglePill: func,
  selectedPill: any,
};

SearchBarComponents.defaultProps = {
  color: '#eeeeee',
  enabledEngineCategories: [],
  searchParameters: [],
  addPill: id => console.log('Open search pill modal', id)
};

const SearchBar = withStyles(styles)(SearchBarComponents);

export { SearchBar, supportedEngineCategoryType };
