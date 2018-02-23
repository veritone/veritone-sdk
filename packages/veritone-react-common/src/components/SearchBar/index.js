import React from 'react';
import cx from 'classnames';
import { string, bool, arrayOf, shape, func, object } from 'prop-types';

import Tooltip from 'material-ui/Tooltip';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

import Icon from './Icon';
import SearchPill from './SearchPill';

import styles from './styles.scss';
import Select from 'material-ui/Select';

import { MenuItem } from 'material-ui/Menu';
import { withTheme } from 'material-ui/styles';

const EngineCategoryButton = ({ engineCategory, addPill, color }) => {
  const engineCategoryIconClasses = cx(styles['engineCategoryPill']);
  const tooltipClasses = cx(styles['searchPillTooltip']);

  const onAddPill = () => addPill(engineCategory.id);

  return (
    <Tooltip
      title={engineCategory.tooltip}
      placement="left"
      key={engineCategory.id}
      className={cx(tooltipClasses)}
    >
      <div className={cx(engineCategoryIconClasses)} onClick={onAddPill}>
        <Icon iconClass={engineCategory.iconClass} color={color} />
      </div>
    </Tooltip>
  );
};
EngineCategoryButton.propTypes = {
  engineCategory: shape(supportedEngineCategoryType),
  addPill: func,
  color: string
};

const containerClasses = cx(styles['searchBar']);

const searchInputContainerClass = cx(styles['searchInput']);

const supportedCategoriesClass = cx(styles['supportedCategories']);

const InputCursor = ({onKeyPress, onFocus}) => (
  <input onFocus={onFocus} onKeyPress={onKeyPress} maxLength="0" className={ cx(styles['afterCursor'])} type="textbox" size="1" />
)

const JoiningOperator = ( {operator, onClick} ) => {
  return (
    <Chip
      label={operator}
      onClick={onClick}
    />
  );
}

const SearchParameters = withTheme()(({theme, searchParameters, level, togglePill, highlightedPills, enabledEngineCategories, openPill, removePill, addPill, lastJoin, libraries, openMenu}) => {
  let output = [];

  // need to do a pass over the search parameters to build a tree so we can render groups cleanly
  const groups = {};
  let startOfGroup = null;
  let treeLevel = 0;
  for(let i = 0; i < searchParameters.length; i++) {
    if(searchParameters[i].value === '(') {
      if(treeLevel === 0) {
        startOfGroup = searchParameters[i].id;
      }
      treeLevel++;
    } else if (searchParameters[i].value === ')') {
      treeLevel--;
      if(treeLevel === 0) {
        groups[startOfGroup] = i;
        startOfGroup = null;
      }
    }
  }

  console.log("Groups", groups);
  for (let i = 0; i < searchParameters.length; i++ ) {
    let searchParameter = searchParameters[i];
    if (searchParameter.conditionType === 'join') {
      const onClick = (e) => {
        console.log('onClick operator');
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
      if(groups[searchParameter.id]) {
        const nestedGroupStyling = searchParameters[i-1] && searchParameters[i-1].conditionType !== 'group' ? cx(styles['searchGroupNestedLeft']) : cx(styles['searchGroupNestedRight']);
        const stylingClass = level === 0 ? cx(styles['searchGroup']) : nestedGroupStyling;

        output.push(
          <span style={{ borderColor: theme.palette.primary.main }} className={ stylingClass } key={`search_container_${searchParameter.id}`}>
          <SearchParameters
          key={`search_parameters_grouping_${searchParameter.id}_${level}`}
            searchParameters={ searchParameters.slice(i+1, groups[searchParameter.id]) }
            level={level+1}
            enabledEngineCategories={enabledEngineCategories}
            highlightedPills={ highlightedPills }
            togglePill={ togglePill }
            addPill={ addPill }
            openPill={ openPill }
            removePill={ removePill }
            libraries={ libraries }
            openMenu={ openMenu }
          />
          </span>
        )
        i = groups[searchParameter.id];
      }
    } else if (searchParameter.conditionType !== 'join') {
      const searchParameterEngine = enabledEngineCategories.find(engineCategory => engineCategory.id === searchParameter.conditionType);

      const { abbreviation, thumbnail } = searchParameterEngine ? searchParameterEngine.getLabel(searchParameter.value) : { abbreviation: undefined, thumbnail: undefined };
      const remove = () => removePill(searchParameter.id);

      const onClick= (e) => {
        if(e.shiftKey) {
          togglePill(searchParameter.id, searchParameters);
        } else {
          openMenu(e.currentTarget, searchParameter);
        }
      }
      //const open = () => openPill(searchParameter);
      //const toggle = () => togglePill(searchParameter.id, searchParameters);

      output.push(
        <SearchPill
          key={searchParameter.id}
          engineIconClass={searchParameterEngine.iconClass}
          onClick={ onClick }
          highlighted={ highlightedPills.indexOf(searchParameter.id) !== -1 }
          label={abbreviation}
          remove={remove}
        />
    );
    }
  }
  return output;
});

const SearchBar = ({
  color,
  searchParameters,
  enabledEngineCategories,
  addPill,
  openPill,
  removePill,
  highlightedPills,
  togglePill,
  onSearch,
  libraries,
  openMenu,
  resetSearchParameters
}) => {
  const getOnEnter = (onSearch) => (evt) => {
    console.log(evt);
    if(evt.key === 'Enter') {
      onSearch();
    }
  }

  const addTranscript = () => {
    if(searchParameters.length === 0) {
      addPill('67cd4dd0-2f75-445d-a6f0-2f297d6cd182');
    }
  }

  return (
    <div className={containerClasses}>
      <div className={searchInputContainerClass}>
        { searchParameters.length === 0 ? <InputCursor key="first_input_cursor" onFocus={ addTranscript }/> : null }
        { <SearchParameters
        key={'top_level_search_parameters'}
        searchParameters={ searchParameters }
        level={0}
        enabledEngineCategories={enabledEngineCategories}
        highlightedPills={ highlightedPills }
        togglePill={ togglePill }
        addPill={ addPill }
        openPill={ openPill }
        removePill={ removePill }
        libraries={ libraries }
        color={color}
        openMenu={ openMenu }
         /> }
        { searchParameters.length > 0 ? <InputCursor onKeyPress={getOnEnter(onSearch)} className={ cx(styles["afterCursor"]) } key={ `after_${searchParameters[searchParameters.length -1 ].id}_input_cursor` } /> : null }
      </div>
      <div className={supportedCategoriesClass}>
        {enabledEngineCategories &&
          enabledEngineCategories.map(engineCategory => (
            <EngineCategoryButton
              key={engineCategory.id}
              engineCategory={engineCategory}
              color={color}
              addPill={addPill}
            />
          ))}
      </div>
      <IconButton onClick={resetSearchParameters}>
        <CloseIcon/>
      </IconButton>
    </div>
  )
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
};

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

SearchBar.defaultProps = {
  color: '#eeeeee',
  enabledEngineCategories: [],
  searchParameters: [],
  addPill: id => console.log('Open search pill modal', id)
};

export { SearchBar, supportedEngineCategoryType };
