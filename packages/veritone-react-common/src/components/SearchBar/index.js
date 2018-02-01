import React from 'react';
import cx from 'classnames';
import { string, bool, arrayOf, shape, func, object } from 'prop-types';

import Tooltip from 'material-ui/Tooltip';

import Icon from './Icon';
import SearchPill from './SearchPill';

import styles from './styles.scss';
import Select from 'material-ui/Select';

import { MenuItem } from 'material-ui/Menu';

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

const InputCursor = ({onKeyPress}) => (
  <input onKeyPress={onKeyPress} maxLength="0" className={ cx(styles['afterCursor'])} type="textbox" size="1" />
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

const SearchParameter = ( {searchParameter, enabledEngineCategories, isLast, openPill, removePill, modifyPill, lastJoiningOperator, level} ) => {
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
    return isLast && level < 1 ? ( <JoiningOperator lastJoiningOperator={lastJoiningOperator} onChange={onChangePill(modifyPill, searchParameter.id)} key={searchParameter.id} operator={searchParameter.value} /> ) : ( <StaticJoiningOperator key={searchParameter.id} operator={searchParameter.value.toUpperCase()} /> )
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

const SearchParameters = ({searchParameters, level, enabledEngineCategories, openPill, removePill, modifyPill, lastJoin}) => {
  let lastJoiner = lastJoin ? lastJoin : (searchParameters[1] && searchParameters[1].value) || 'and';

  let output = [];
  for (let i = 0; i < searchParameters.length; i++ ) {
    // i !== searchParameters.length - 2 makes it so if the last operator is different from the last joining operator (aka it would normally be parsed as a new subtree, the last joining operator is ignored)
  	if(searchParameters[i].conditionType !== 'join' && searchParameters[i+1].value !== lastJoiner && i !== searchParameters.length - 2) {
    	// recursive descent
      output.push([
      <span className={cx(styles['searchContainer'])} key={`search_container_${searchParameters[i]}`}>
          <SearchParameter
            openPill={openPill}
            removePill={removePill}
            modifyPill={modifyPill}
            key={`search_parameter_${searchParameters[i].id}`}
            isLast={ searchParameters.length-1 === i}
            enabledEngineCategories={enabledEngineCategories}
            searchParameter={searchParameters[i]}
            level={level}
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
        searchParameter={searchParameters[i]}
        lastJoin={searchParameters.length === 0}
        isLast={ searchParameters.length-1 === i}
      />
    );
    }
  }

  return (output);
}

const SearchBar = ({
  color,
  searchParameters,
  enabledEngineCategories,
  addPill,
  openPill,
  removePill,
  modifyPill,
  onSearch,
}) => {
  const getOnEnter = (onSearch) => (evt) => {
    if(evt.key === 'Enter') {
      onSearch();
    }
  }

  return (
    <div className={containerClasses}>
      <div className={searchInputContainerClass}>
        { searchParameters.length === 0 ? <InputCursor key="first_input_cursor" /> : null }
        { <SearchParameters
        key={'top_level_search_parameters'}
        searchParameters={ searchParameters }
        level={0}
        enabledEngineCategories={enabledEngineCategories}
        addPill={ addPill }
        openPill={ openPill }
        removePill={ removePill }
        modifyPill={ modifyPill }
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
  libraries: arrayOf(string),
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
