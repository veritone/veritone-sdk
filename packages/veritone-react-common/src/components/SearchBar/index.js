import React from 'react';
import cx from 'classnames';
import { string, bool, arrayOf, shape, func, object, oneOf, number } from 'prop-types';
import Tooltip from 'material-ui/Tooltip';
import Chip from 'material-ui/Chip';

import styles from './styles.scss';

const getEngineCategoryIcon = (supportedEngineCategories, engineCategoryId) => {
  let engineCategory = supportedEngineCategories.filter( (x) => x.id === engineCategoryId )[0];
  if ( engineCategoryId ) { return engineCategory.iconClass; }
}

const searchPillClass = cx(
  styles['searchPill'],
);

const deleteIconClass = cx(
  styles['deleteIcon'],
);

const searchPillLabelClass = cx(
  styles['searchPillLabel'],
);

const SearchPill = ( { engineIconClass, label, remove, open } ) => (
  <Chip
    avatar={<Icon iconClass={ engineIconClass } color={ 'grey '} size={ '1.5em' } />}
    label={ label }
    className={ searchPillClass }
    classes={ { label: searchPillLabelClass, deleteIcon: deleteIconClass } }
    onRequestDelete={ remove }
    onClick={ open }
  />
);

const Icon = ( { iconClass, color, size } ) => (
  <span
    className={ iconClass } style={ { padding: '0.25em', color: color, display: 'block', fontSize: size } }
  />
);

const EngineCategoryButton = ( { engineCategory, color } ) => {
  const engineCategoryIconClasses = cx(
    styles['engineCategoryPill']
  );

  return (
    <Tooltip title={engineCategory.tooltip} placement="bottom" key={engineCategory.id}>
      <div className={ cx(engineCategoryIconClasses) } onClick={engineCategory.addPill}>
        <Icon iconClass={ engineCategory.iconClass } color={ color } />
      </div>
    </Tooltip>
  )
}

const containerClasses = cx(
  styles['searchBar'],
);

const searchInputContainerClass = cx(
  styles['searchInput']
);

const supportedCategoriesClass = cx(
  styles['supportedCategories'],
);

const SearchBar = ( { color, query, supportedEngineCategories, onSearch, onChangePill } ) => (
  <div className={containerClasses}>
    <div className={searchInputContainerClass} onClick={onSearch}>
      {
        query && query.searchEngineCategories && query.searchEngineCategories.map( (searchEngineCategory) =>
          (
            <SearchPill
              key={ searchEngineCategory.key }
              engineIconClass={ getEngineCategoryIcon(supportedEngineCategories, searchEngineCategory.engineId) }
              label={ searchEngineCategory.searchAbbreviation }
              remove={ searchEngineCategory.remove }
              open={ searchEngineCategory.openModal }
            />
          )
        )
      }
    </div>
    <div className={supportedCategoriesClass}>
      {
        supportedEngineCategories && supportedEngineCategories.map( (supportedEngineCategory) =>
          (
            <EngineCategoryButton key={ supportedEngineCategory.id } engineCategory={ supportedEngineCategory } color={ color } />
          )
        )
      }
    </div>
  </div>
);


const filterType = {
  // name of the field to apply the search filter against:
  // GIVEN an engine category data { transcript: { transcript: "The Lakers used to have Kobe and Shaq" }, language: 'english' } }
  // and the search query ( Transcript.language = "English"  AND Transcript.transcript CONTAINS "Kobe" ), the first filter's field_name would be "language"
  key: number,
  field_name: string.isRequired,
  // given the above example, the filter_value for the first filter would be "English"
  filter_value: oneOf(string, bool, number).isRequired,
  // query_string, term, >, <, =, >=, <=
  operator: string.isRequired,
  boolean_operator: bool,
  // operators that should apply to the filter: GIVEN ( 3 + 4 ), ( would be a prefix operator
  prefix_operator: string,
  // operator used to join the next filter: GIVEN ( 3 + 4 ), + would be the joining operator
  joining_operator: string,
  // operator used to end the filter: GIVEN ( 3 + 4 ), ) would be the suffix operator
  suffix_operator: string,
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

SearchBar.propTypes = {
  color: string.isRequired,
  supportedEngineCategories: arrayOf(shape(supportedEngineCategoryType)),
  query: shape({
    prefixOperators: string,
    searchEngineCategories: arrayOf(shape({
      engineId: string.isRequired,
      thumbnail: string,
      searchAbbreviation: string.isRequired,
      filters: oneOf( arrayOf(shape(filterType)), shape(filterType) ),
      remove: func.isRequired,
      openModal: func.isRequired,
      applyFilter: func.isRequired,
      prefixOperators: arrayOf(string),
      joiningOperator: bool,
      suffixOperators: arrayOf(string)
    }))
  }),
  onSearch: func,
  onChangePill: func,
};

SearchBar.defaultProps = {
  enabledEngineCategories: [],
  query: {}
};

export { SearchBar, supportedEngineCategoryType, filterType } ;