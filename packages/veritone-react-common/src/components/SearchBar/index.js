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

  const onAddPill = () => addPill(engineCategory.id);

  return (
    <Tooltip
      title={engineCategory.tooltip}
      placement="bottom"
      key={engineCategory.id}
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
  <input type="textbox" size="1" style={ {width: "10px", border: 0, height: "100%" } } />
)


/*
const JoiningOperator = ( value ) => {
  const VALUES = ['AND', 'OR'];
  if (values.indexOf(values) === -1) {
    throw new ParseException(`Not a valid joining operator. Operators are ${VALUES}`);
  }
  return {
    value: object.isRequired,
    conditionType: 'join'
  };
}
*/

const JoiningOperator = ( {operator, readOnly} ) => {
  const joinOperatorClass = cx(styles['joinOperator']);
  return (
    <Select
    classes={ { 'selectMenu': joinOperatorClass } }
    value={operator}
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

const SearchParameter = ( {searchParameter, enabledEngineCategories, isLast, openPill, removePill} ) => {
  // assume strings are always AND or OR operators for now
  if( searchParameter.conditionType === 'join' ) {
    return isLast ? ( <JoiningOperator key={searchParameter.id} operator={searchParameter.value} /> ) : ( <StaticJoiningOperator key={searchParameter.id} operator={searchParameter.value} /> )
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


const LastInput = (show, searchParameterId) => {
  if (show) {
    return <InputCursor />
  }
}


const SearchBar = ({
  color,
  searchParameters,
  enabledEngineCategories,
  addPill,
  openPill,
  removePill,
  onSearch,
  onChangePill
}) => {
 // const pillActions = { openPill, removePill };
  // console.log(pillActions);
  return (
    <div className={containerClasses}>
      <div className={searchInputContainerClass} onClick={onSearch}>
        { searchParameters.length === 0 ? <InputCursor key="first_input_cursor" /> : null }
        {searchParameters.map( (searchParameter, index) => {
          if (index === searchParameters.length - 1) {
            return [
              <SearchParameter
                openPill={openPill}
                removePill={removePill}
                key={ `search_parameter_${searchParameter.id}` }
                enabledEngineCategories={enabledEngineCategories}
                searchParameter={searchParameter}
                isLast={ index === searchParameters.length - 1 } />,
              <InputCursor key={ `after_${searchParameter.id}_input_cursor` } />
            ];
          } else {
            return (
              <SearchParameter
              openPill={openPill}
              removePill={removePill}
              key={ `search_parameter_${searchParameter.id}` }
              enabledEngineCategories={enabledEngineCategories}
              searchParameter={searchParameter}
              isLast={ index === searchParameters.length - 1 } />
            );
          }
        })}
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
