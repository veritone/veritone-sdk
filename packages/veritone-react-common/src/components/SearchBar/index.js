import React, { Fragment } from 'react';
import { string, object, arrayOf, shape, oneOfType, number } from 'prop-types';

import { SearchPill } from 'veritone-react-common';

import cx from 'classnames';
import styles from './styles.scss';

import { getGroupsFromSearchParameters, SearchBarError } from './parser';
import { engineCategories } from './engineCategoryMappings';

// need to look forward and backwards one search parameter, as well as take into the account the rendering level
// because we render ((hello) and world ) as (hello) and world)
const getGroupStyling = ({ before, after, level }) => {
  return cx({
    [styles['searchGroupNestedLeft']]: before && before !== 'group',
    [styles['searchGroupNestedRight']]: after && after !== 'group',
    [styles['searchGroup']]: level === 0
  });
};

const SearchParameters = ({ parameters, level }) => {
  const groups = getGroupsFromSearchParameters(parameters);
  const searchParameters = [];
  for (let i = 0; i < parameters.length; i++) {
    const searchParameter = parameters[i];
    if (
      searchParameter.conditionType === 'group' &&
      searchParameter.value === '('
    ) {
      // render a group recursively
      if (!(searchParameter.id in groups)) {
        throw new SearchBarError(
          'Cannot render the search bar because there is an unclosed group'
        );
      }
      const group = groups[searchParameter.id];
      const before = parameters[i - 1] && parameters[i - 1].conditionType;
      const after = group.afterGroup;

      searchParameters.push(
        <span className={getGroupStyling({ before, after, level })}>
          <SearchParameters
            key={searchParameter.id}
            level={1 + level}
            parameters={parameters.slice(1 + i, group.endOfGroup)}
          />
        </span>
      );

      // skip to the end of the group, continue rendering
      i = group.endOfGroup;
    } else if (searchParameter.conditionType in engineCategories) {
      // render an engineCategory subpill
      const engine = engineCategories[searchParameter.conditionType];
      const { abbreviation, exclude } = engine.getLabel(searchParameter.value);

      searchParameters.push(
        <SearchPill
          key={searchParameter.id}
          label={abbreviation}
          exclude={exclude}
          engineCategoryIcon={engine.iconClass}
          disabled
        />
      );
    } else if (searchParameter.conditionType === 'join') {
      // render a joining operator
      searchParameters.push(<span>{searchParameter.value} </span>);
    } else if (searchParameter.conditionType !== 'group') {
      throw new SearchBarError('Invalid search parameter', searchParameter);
    }
  }

  return <Fragment>{searchParameters}</Fragment>;
};

SearchParameters.propTypes = {
  parameters: arrayOf(
    shape({
      id: string.isRequired,
      value: oneOfType([object, string]),
      conditionType: string.isRequired
    })
  ),
  level: number
};

SearchParameters.defaultProps = {
  level: 0
};

class SearchBarWithError extends React.Component {
  static propTypes = {
    parameters: arrayOf(
      shape({
        id: string.isRequired,
        value: oneOfType([object, string]),
        conditionType: string.isRequired
      })
    )
  };

  state = {
    hasError: false
  };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <div>Invalid searchQuery</div>;
    } else {
      return <SearchParameters parameters={this.props.parameters} />;
    }
  }
}

export default SearchBarWithError;
