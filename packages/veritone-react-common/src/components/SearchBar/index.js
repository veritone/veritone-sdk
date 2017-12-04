import React from 'react';
import cx from 'classnames';
import { string, bool, arrayOf, shape, func, object, oneOf, oneOfType, number } from 'prop-types';
import Tooltip from 'material-ui/Tooltip';
import Chip from 'material-ui/Chip';
import SearchBarContainer from './SearchBarContainer';
import update from 'immutability-helper';

import styles from './styles.scss';

const getEngineCategoryIcon = (enabledEngineCategories, engineCategoryId) => {
  let engineCategory = enabledEngineCategories.filter( (x) => x.id === engineCategoryId )[0];
  if ( engineCategory ) { return engineCategory.iconClass; }
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

const EngineCategoryButton = ( { engineCategory, addPill, color } ) => {
  const engineCategoryIconClasses = cx(
    styles['engineCategoryPill']
  );

  const onAddPill = () => addPill(engineCategory.id);

  return (
    <Tooltip title={engineCategory.tooltip} placement="bottom" key={engineCategory.id}>
      <div className={ cx(engineCategoryIconClasses) } onClick={ onAddPill }>
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

const SearchBar = ({
  color,
  searchParameters,
  enabledEngineCategories,
  addPill,
  openPill,
  removePill,
  onSearch,
  onChangePill
}) => (
  <div className={containerClasses}>
    <div className={searchInputContainerClass} onClick={onSearch}>
      {searchParameters.map(searchPill => {
        // get the functions associated with the search pill's engine category
        const searchParameterEngine = enabledEngineCategories.find(
          engineCategory => engineCategory.id === searchPill.engineId
        );
        const { abbreviation, thumbnail } = searchParameterEngine.getLabel(searchPill);
        const remove = () => removePill(searchPill.id);
        const open = () => openPill(searchPill);

        return (
          <SearchPill
            key={searchPill.id}
            engineIconClass={searchParameterEngine.iconClass}
            label={ abbreviation + searchPill.id}
            open={ open }
            remove={ remove }
          />
        );
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
);

const supportedEngineCategoryType = {
  id: string.isRequired,
  name: string.isRequired,
  tooltip: string.isRequired,
  iconClass: string.isRequired,
  enablePill: bool,
  showPill: bool,
  addPilll: func
};

const operator = {
  operator: string.isRequired
}

const condition = {
  id: string.isRequired,
  state: object.isRequired,
  engineId: string.isRequired
}

SearchBar.propTypes = {
  color: string.isRequired,
  searchParameters: arrayOf( oneOfType([shape(operator), shape(condition)]) ),
  enabledEngineCategories: arrayOf(shape(supportedEngineCategoryType)),
  onSearch: func,
  openPill: func,
  onChangePill: func,
};

SearchBar.defaultProps = {
  color: "#eeeeee",
  enabledEngineCategories: [],
  searchParameters: [],
  addPill: id => console.log("Open search pill modal", id)
};

export { SearchBar, supportedEngineCategoryType } ;
