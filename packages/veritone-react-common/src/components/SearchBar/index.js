import React from 'react';
import cx from 'classnames';
import { string, bool, arrayOf, shape, func, object } from 'prop-types';

import Tooltip from 'material-ui/Tooltip';

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

const JoiningOperator = ( {operator, readOnly, onChange, lastJoiningOperator} ) => {
  const joinOperatorClass = cx(styles['joinOperator']);
  // uncomment the following line if you want a dashed line at the end;
  //const joinOperatorRootClass = ( lastJoiningOperator === operator || !lastJoiningOperator ) ? cx(styles['joinOperatorRootRight']) : null;
  const joinOperatorRootClass = null;

  return (
    <Select
    classes={ { 'selectMenu': joinOperatorClass, 'root': joinOperatorRootClass } }
    value={operator}
    disableUnderline={ lastJoiningOperator === operator }
    onChange={ onChange }
    >
      <MenuItem value={'and'}>AND</MenuItem>
      <MenuItem value={'or'}>OR</MenuItem>
    </Select>
  );
}

const StaticJoiningOperator = ( {operator} ) => {
  const joinOperatorReadOnly = cx(styles['joinOperatorDisabled']);
  return (
    <span className={joinOperatorReadOnly}>{ operator }</span>
  );
}

const SearchParameter = ( {searchParameter, enabledEngineCategories, isLast, openPill, removePill, modifyPill, lastJoiningOperator, level, libraries} ) => {
  // assume strings are always AND or OR operators for now

  if( searchParameter.conditionType === 'join' ) {
    const onChangePill = (modifyPill, id) =>
      evt => {
        modifyPill({
          value: evt.target.value,
          conditionType: 'join',
          id: id
        })
      };
    // level < 1 is the feature toggle for maximum tree depth
    return (<JoiningOperator lastJoiningOperator={lastJoiningOperator} onChange={onChangePill(modifyPill, searchParameter.id)} key={searchParameter.id} operator={searchParameter.value} />);
    //return isLast && level < 1 ? ( <JoiningOperator lastJoiningOperator={lastJoiningOperator} onChange={onChangePill(modifyPill, searchParameter.id)} key={searchParameter.id} operator={searchParameter.value} /> ) : ( <StaticJoiningOperator key={searchParameter.id} operator={searchParameter.value.toUpperCase()} /> )
  }
  // otherwise it's a search engine category
  else
  {
    const searchParameterEngine = enabledEngineCategories.find(
      engineCategory => engineCategory.id === searchParameter.conditionType
    );

    const { abbreviation, thumbnail } = searchParameterEngine ? searchParameterEngine.getLabel(
      searchParameter.value
    ) : { abbreviation: undefined, thumbnail: undefined };
    const remove = () => removePill(searchParameter.id);
    const open = () => openPill(searchParameter);

    return [
      <SearchPill
        key={searchParameter.id}
        engineIconClass={searchParameterEngine.iconClass}
        label={abbreviation}
        open={open}
        remove={remove}
      />
    ];
  }
}


const SearchParameters = withTheme()(({theme, searchParameters, level, togglePill, highlightedPills, enabledEngineCategories, openPill, removePill, modifyPill, addPill, lastJoin, libraries}) => {
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
      const onChangePill = (modifyPill, id) =>
        evt => {
          modifyPill({
            value: evt.target.value,
            conditionType: 'join',
            id: id
          })
        };
      output.push(
        <JoiningOperator onChange={onChangePill(modifyPill, searchParameter.id)} key={searchParameter.id} operator={searchParameter.value} />
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
            modifyPill={ modifyPill }
            libraries={ libraries }
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
          openPill(searchParameter);
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
        />);
    }
  }
  return output;
});

/*

const SearchParameters = withTheme()(({theme, searchParameters, level, enabledEngineCategories, openPill, removePill, modifyPill, lastJoin, libraries}) => {
  let lastJoiner = lastJoin ? lastJoin : (searchParameters[1] && searchParameters[1].value) || 'and';
  let output = [];
  for (let i = 0; i < searchParameters.length; i++ ) {
    // i !== searchParameters.length - 2 makes it so if the last operator is different from the last joining operator (aka it would normally be parsed as a new subtree, the last joining operator is ignored)
  	if(searchParameters[i].conditionType !== 'join' && searchParameters[i+1].value !== lastJoiner && i !== searchParameters.length - 2) {
    	// recursive descent
      output.push([
      <span style={ { borderBottom: `2px solid ${theme.palette.primary.main}` } } className={cx(styles['searchContainer'])} key={`search_container_${searchParameters[i]}`}>
          <SearchParameter
            openPill={openPill}
            removePill={removePill}
            modifyPill={modifyPill}
            key={`search_parameter_${searchParameters[i].id}`}
            isLast={ searchParameters.length-1 === i}
            enabledEngineCategories={enabledEngineCategories}
            searchParameter={searchParameters[i]}
            level={level}
            libraries={libraries}
            lastJoin={searchParameters.length === 0}
          />
          <SearchParameters
          key={`search_parameters_grouping_${searchParameters[i].id}_${level}`}
          searchParameters={searchParameters.slice(i + 1)}
          lastJoin={searchParameters[i+1].value}
          level={level+1}
          openPill={openPill}
          enabledEngineCategories={enabledEngineCategories}
          removePill={removePill}
          modifyPill={modifyPill}
          libraries={libraries}
          />
        </span>]);
      break;
    } else {
    	output.push(
        <SearchParameter
        openPill={openPill}
        removePill={removePill}
        modifyPill={modifyPill}
        key={`search_parameter_${searchParameters[i].id}`}
        enabledEngineCategories={enabledEngineCategories}
        level={level}
        libraries={libraries}
        searchParameter={searchParameters[i]}
        lastJoin={searchParameters.length === 0}
        isLast={ searchParameters.length-1 === i}
      />
    );
    }
  }

  return (output);
})

*/

const SearchBar = ({
  color,
  searchParameters,
  enabledEngineCategories,
  addPill,
  openPill,
  removePill,
  highlightedPills,
  togglePill,
  modifyPill,
  onSearch,
  libraries
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
        modifyPill={ modifyPill }
        libraries={ libraries }
        color={color}
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
  modifyPill: func,
  onChangePill: func
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
