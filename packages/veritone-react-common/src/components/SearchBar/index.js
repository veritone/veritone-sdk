import React from 'react';
import cx from 'classnames';
import { string, bool, arrayOf, shape, func, object, oneOf, number } from 'prop-types';
import Tooltip from 'material-ui/Tooltip';

import styles from './styles.scss';


const renderSearchPill = (searchEngineCategoryPill) => {

}

const renderEngineCategoryButton = (engineCategory, color) => {
  const engineCategoryIconClasses = cx(
    styles['engineCategoryPill']
  );

  const Icon = (
    <span
      className={ engineCategory.iconClass } style={ { color: color, display: 'block' } }
    />
  );

  return (
    <Tooltip title={engineCategory.tooltip} placement="bottom" key={engineCategory.id}>
      <div className={ cx(engineCategoryIconClasses) } onClick={engineCategory.addPill}>
        { Icon }
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
    <div className={searchInputContainerClass}>
      {
        query && query.searchEngineCategories && query.searchEngineCategories.map(this.renderSearchPill)
      }
    </div>
    <div className={supportedCategoriesClass}>
      {
        supportedEngineCategories && supportedEngineCategories.map( (supportedEngineCategory) => renderEngineCategoryButton(supportedEngineCategory, color) )
      }
    </div>
  </div>
);


const filterShape = {
  // name of the field to apply the search filter against:
  // GIVEN an engine category data { transcript: { transcript: "The Lakers used to have Kobe and Shaq" }, language: 'english' } }
  // and the search query ( Transcript.language = "English"  AND Transcript.transcript CONTAINS "Kobe" ), the first filter's field_name would be "language"
  field_name: string.isRequired,
  // given the above example, the filter_value for the first filter would be "English"
  filter_value: string, bool, number,
  // operators that should apply to the filter: GIVEN ( 3 + 4 ), ( would be a prefix operator
  prefix_operator: string,
  // operator used to join the next filter: GIVEN ( 3 + 4 ), + would be the joining operator
  joining_operator: string,
  // operator used to end the filter: GIVEN ( 3 + 4 ), ) would be the suffix operator
  suffix_operator: string,
};

SearchBar.propTypes = {
  color: string.isRequired,
  supportedEngineCategories: arrayOf(shape({
    id: string.isRequired,
    name: string.isRequired,
    tooltip: string.isRequired,
    iconClass: string.isRequired,
    enablePill: bool,
    showPill: bool,
    addPilll: func
  })),
  query: shape({
    prefixOperators: string,
    searchEngineCategories: arrayOf(shape({
      engineId: string.isRequired,
      thumbnail: string,
      searchAbbreviation: string.isRequired,
      filters: oneOf( arrayOf(shape(filterShape)), shape(filterShape) ),
      prefixOperators: arrayOf(string),
      joiningOperator: bool,
      suffixOperators: arrayOf(string)
      /*
      openModal: func,
      closeModal: func,

      searchCategoryQuery: object, // TO DO: determine a generic format for an engineCategorySearchModal
      prefixOperators: arrayOf(string),
      joiningOperator: boolean,
      suffixOperators: arrayOf(string),
      */
    }))
  }),
  onSearch: func,
  onChangePill: func,
};

SearchBar.defaultProps = {
  enabledEngineCategories: [],
  query: {}
};

export default SearchBar;

/*
export default class SearchBar extends React.Component {

  renderSearchPill = (searchEngineCategoryPill) => {

  }


  renderEngineCategoryButton = (engineCategory) => {
    const engineCategoryIconClasses = cx(
      styles['engineCategoryPill']
    );

    const Icon = (
      <span
        className={ engineCategory.iconClass } style={ { color: this.props.color, display: 'block' } }
      />
    );

    return (
      <Tooltip title={engineCategory.tooltip} placement="bottom">
        <div className={ cx(engineCategoryIconClasses) } onClick={engineCategory.addPill}>
          { Icon }
        </div>
      </Tooltip>
    )
  }

  render() {
    const containerClasses = cx(
      styles['searchBar'],
    );

    const searchInputContainerClass = cx(
      styles['searchInput']
    );

    const supportedCategoriesClass = cx(
      styles['supportedCategories'],
    );

    return (
      <div className={containerClasses}>
        <div className={searchInputContainerClass}>
          {
            this.props.query && this.props.searchEngineCategories && searchEngineCategories.map(this.renderSearchPill)
          }
        </div>
        <div className={supportedCategoriesClass}>
          {
            this.props.supportedEngineCategories.map(this.renderEngineCategoryButton)
          }
        </div>
      </div>
    );
  }
}

*/