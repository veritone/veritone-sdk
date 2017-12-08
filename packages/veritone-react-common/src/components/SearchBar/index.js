import React from 'react';
import cx from 'classnames';
import { string, bool, arrayOf, shape, func, object } from 'prop-types';

import Tooltip from 'material-ui/Tooltip';

import Icon from './Icon';
import SearchPill from './SearchPill';

import styles from './styles.scss';

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

        const { abbreviation, thumbnail } = searchParameterEngine ? searchParameterEngine.getLabel(
          searchPill
        ) : { abbreviation: undefined, thumbnail: undefined };
        const remove = () => removePill(searchPill.id);
        const open = () => openPill(searchPill);

        return (
          <SearchPill
            key={searchPill.id}
            engineIconClass={searchParameterEngine.iconClass}
            label={abbreviation}
            open={open}
            remove={remove}
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
  engineId: string.isRequired
};

SearchBar.defaultProps = {
  color: '#eeeeee',
  enabledEngineCategories: [],
  searchParameters: [],
  addPill: id => console.log('Open search pill modal', id)
};

export { SearchBar, supportedEngineCategoryType };
