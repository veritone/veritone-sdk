import React, { Fragment } from 'react';
import {
  string,
  object,
  arrayOf,
  shape,
  oneOfType,
  number,
  bool
} from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import cx from 'classnames';
import { makeStyles } from '@material-ui/styles';

import SearchPill from 'components/SearchPill';
import { getGroupsFromSearchParameters, SearchBarError } from './parser';
import { engineCategories } from './engineCategoryMappings';

import styles from './styles';

const useStyles = makeStyles(styles);

// need to look forward and backwards one search parameter, as well as take into the account the rendering level
// because we render ((hello) and world ) as (hello) and world)
const getGroupStyling = ({ before, after, level }) => {
  const classes = useStyles();

  return cx({
    [classes['searchGroupNestedLeft']]: before && before !== 'group',
    [classes['searchGroupNestedRight']]: after && after !== 'group',
    [classes['searchGroup']]: level === 0
  });
};

const SearchParameters = ({ parameters, level, disableTooltip }) => {
  const classes = useStyles();
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
        <span className={getGroupStyling({ before, after, level })} key={searchParameter.id}>
          <SearchParameters
            level={1 + level}
            parameters={parameters.slice(1 + i, group.endOfGroup)}
            disableTooltip={disableTooltip}
          />
        </span>
      );

      // skip to the end of the group, continue rendering
      i = group.endOfGroup;
    } else if (searchParameter.conditionType in engineCategories) {
      // render an engineCategory subpill
      const engine = engineCategories[searchParameter.conditionType];
      const { abbreviation, exclude, full } = engine.getLabel(
        searchParameter.value
      );

      searchParameters.push(
        <Tooltip
          title={full}
          placement="bottom"
          disableHoverListener={disableTooltip}
          key={searchParameter.id}
        >
          <div className={classes['tooltipContainer']}>
            <SearchPill
              label={abbreviation}
              exclude={exclude}
              engineCategoryIcon={engine.iconClass}
              disabled
            />
          </div>
        </Tooltip>
      );
    } else if (searchParameter.conditionType === 'join') {
      // render a joining operator
      searchParameters.push(
        <span className={classes['joiningOperator']} key={searchParameter.id}>
          {searchParameter.value}{' '}
        </span>
      );
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
  level: number,
  disableTooltip: bool
};

SearchParameters.defaultProps = {
  level: 0
};

class SearchBar extends React.Component {
  static propTypes = {
    parameters: arrayOf(
      shape({
        id: string.isRequired,
        value: oneOfType([object, string]),
        conditionType: string.isRequired
      })
    ),
    disableTooltip: bool
  };

  static defaultProps = {
    disableTooltip: false
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
      return (
        <SearchParameters
          parameters={this.props.parameters}
          disableTooltip={this.props.disableTooltip}
        />
      );
    }
  }
}

export default SearchBar;
