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
      placement="bottom"
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

const InputCursor = () => (
  <input type="textbox" size="1" style={ {width: "10px", border: 0, display: "flex" } } />
)

const JoiningOperator = ( {operator, readOnly, onChange, lastJoiningOperator} ) => {
  const joinOperatorClass = cx(styles['joinOperator']);
  const joinOperatorRootClass = cx(styles['joinOperatorRoot']);
  return (
    <Select
    classes={ { 'selectMenu': joinOperatorClass, 'root': joinOperatorRootClass } }
    value={operator}
    onChange={ onChange }
    >
      <MenuItem value={'AND'}>AND</MenuItem>
      <MenuItem value={'OR'}>OR</MenuItem>
    </Select>
  );
}

const StaticJoiningOperator = ( {operator} ) => {
  const joinOperatorReadOnly = cx(styles['joinOperatorDisabled']);
  return (
    <span className={joinOperatorReadOnly}>{ operator }</span>
  );
}

const SearchParameter = ( {searchParameter, enabledEngineCategories, isLast, openPill, removePill, modifyPill, lastJoiningOperator} ) => {
  // assume strings are always AND or OR operators for now

  if( searchParameter.conditionType === 'join' ) {
    const onChangePill = (modifyPill, id) =>
      evt => {
        console.log("Same group?", lastJoiningOperator === evt.target.value);
        modifyPill({
          value: evt.target.value,
          conditionType: 'join',
          id: id
        })
      };
    return isLast ? ( <JoiningOperator lastJoiningOperator={lastJoiningOperator} onChange={onChangePill(modifyPill, searchParameter.id)} key={searchParameter.id} operator={searchParameter.value} /> ) : ( <StaticJoiningOperator key={searchParameter.id} operator={searchParameter.value} /> )
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

    return (
      <SearchPill
        key={searchParameter.id}
        engineIconClass={searchParameterEngine.iconClass}
        label={abbreviation}
        open={open}
        remove={remove}
      />
    );
  }
}


const SearchParametersWithGrouping = ({ searchParameters, level, enabledEngineCategories, openPill, removePill, modifyPill, lastJoin }) => {
  if (!searchParameters || searchParameters.length === 0) {
    return null;
  }
  console.log("Search parameters", searchParameters);
  if (searchParameters.length === 1) {
    console.log("Last entry", searchParameters[0]);
    return [
      <SearchParameter
        openPill={openPill}
        removePill={removePill}
        modifyPill={modifyPill}
        key={`search_parameter_${searchParameters[0].id}`}
        enabledEngineCategories={enabledEngineCategories}
        searchParameter={searchParameters[0]}
        isLast
      />,
      <InputCursor key={`after_${searchParameters[0].id}_input_cursor`} />
    ];
  }

  const lastJoiningOperator = lastJoin || searchParameters[1].value;
  const parametersInGroup = []

  for(let i = 0; i < searchParameters.length; i++) {
    let searchParameter = searchParameters[i];

    if ( searchParameter.conditionType !== 'join' && searchParameters[i + 1] !== lastJoiningOperator && i != 0) {
      // this will always be an engine category
      parametersInGroup.push(
        <SearchParameter
          openPill={openPill}
          removePill={removePill}
          modifyPill={modifyPill}
          key={`search_parameter_${searchParameter.id}`}
          enabledEngineCategories={enabledEngineCategories}
          searchParameter={searchParameter}
          isLast={i === searchParameters.length - 1}
        />
      );
      // this will always be the trailing joining operator
      parametersInGroup.push(
        <SearchParameter
          openPill={openPill}
          removePill={removePill}
          modifyPill={modifyPill}
          key={`search_parameter_${searchParameters[i+1].id}`}
          enabledEngineCategories={enabledEngineCategories}
          searchParameter={searchParameters[i+1]}
          isLast={i === searchParameters.length - 2}
          lastJoiningOperator={lastJoiningOperator}
        />
      );

      if(i+2 < searchParameters.length) {
        parametersInGroup.push(
        <SearchParametersWithGrouping
        key={`search_parameter_group_${1 + level}`}
        searchParameters={searchParameters.slice(i + 2)}
        level={1 + level}
        enabledEngineCategories={enabledEngineCategories}
        lastJoin={searchParameters[i + 2 ].value}
        openPill={openPill}
        removePill={removePill}
        modifyPill={modifyPill}
        />
        );
      }
      break;
    } else {
      parametersInGroup.push(
        <SearchParameter
        openPill={openPill}
        removePill={removePill}
        modifyPill={modifyPill}
        key={`search_parameter_${searchParameter.id}`}
        enabledEngineCategories={enabledEngineCategories}
        searchParameter={searchParameter}
        isLast={i === searchParameters.length - 1}
      />)
    }
  }

  return (<span className={ level > 0 ? cx(styles["searchGroup"]) :  cx(styles["searchContainer"])  }>{parametersInGroup}</span>);
    /*
    if (
      searchParameter.conditionType === 'join' && searchParameter.value !== lastJoiningOperator && i != 0)
    {
      console.log("new group from", i);
      console.log("New group", searchParameters.slice(i));
      parametersInGroup.push(
        <SearchParametersWithGrouping key={`search_parameter_group_${1+level}` }
          searchParameters={searchParameters.slice(i)}
          level={1+level}
          enabledEngineCategories={enabledEngineCategories}
          lastJoin={ searchParameter.value }
          openPill={ openPill }
          removePill={ removePill }
          modifyPill={ modifyPill }
        />
      );
      break;
    } else {
      parametersInGroup.push(
        <SearchParameter
        openPill={openPill}
        removePill={removePill}
        modifyPill={modifyPill}
        key={`search_parameter_${searchParameter.id}`}
        enabledEngineCategories={enabledEngineCategories}
        searchParameter={searchParameter}
        isLast={i === searchParameters.length - 1}
      />
      )
    }
  }
  */
  //return (<span className={ level > 0 ? cx(styles["searchGroup"]) :  cx(styles["searchContainer"])  }>{parametersInGroup}</span>);
};


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
  // const pillActions = { openPill, removePill };
  // console.log(pillActions);
  return (
    <div className={containerClasses}>
      <div className={searchInputContainerClass} onClick={onSearch}>
        { searchParameters.length === 0 ? <InputCursor key="first_input_cursor" /> : null }
        { <SearchParametersWithGrouping searchParameters={ searchParameters }
        level={0}
        enabledEngineCategories={enabledEngineCategories}
        addPill={ addPill }
        openPill={ openPill }
        removePill={ removePill }
        modifyPill={ modifyPill }
         /> }
        {/*
        {searchParameters.map( (searchParameter, index) => {
          index === searchParameters.length - 1 ? [
            <SearchParameter
              openPill={openPill}
              removePill={removePill}
              key={ `search_parameter_${searchParameter.id}` }
              enabledEngineCategories={enabledEngineCategories}
              searchParameter={searchParameter}
              isLast={ index === searchParameters.length - 1 } />,
            <InputCursor key={ `after_${searchParameter.id}_input_cursor` } />
          ] : <SearchParameter
          openPill={openPill}
          removePill={removePill}
          key={ `search_parameter_${searchParameter.id}` }
          enabledEngineCategories={enabledEngineCategories}
          searchParameter={searchParameter}
          isLast={ index === searchParameters.length - 1 } />
        })}

      */ }
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
