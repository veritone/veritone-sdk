import React from 'react';
import { connect } from 'react-redux';
import { func, arrayOf, string, shape, number, any } from 'prop-types';
import { without, noop } from 'lodash';
import { DiscoverySideBarPure as Sidebar } from 'veritone-react-common';
import { isArray, isString } from 'lodash';
import { withStyles } from '@material-ui/styles';

import styles from './styles';

import * as Filters from './Filters';

import * as engineSelectionModule from '../../../../redux/modules/engineSelection';

@withStyles(styles)
@connect(
  (state, { id }) => ({
    filters: engineSelectionModule.getEngineFilters(state, id),
    activeSidebarPath: engineSelectionModule.getActiveSidebarPath(state, id)
  }),
  {
    addEngineFilter: engineSelectionModule.addEngineFilter,
    removeEngineFilter: engineSelectionModule.removeEngineFilter,
    clearAllFilters: engineSelectionModule.clearAllFilters,
    setActiveSidebarPath: engineSelectionModule.setActiveSidebarPath
  }
)
export default class EnginesSideBar extends React.Component {
  static propTypes = {
    id: string.isRequired,
    filters: shape({
      category: arrayOf(string)
    }).isRequired,
    activeSidebarPath: arrayOf(number),
    addEngineFilter: func.isRequired,
    removeEngineFilter: func.isRequired,
    clearAllFilters: func.isRequired,
    setActiveSidebarPath: func.isRequired,
    classes: shape({ any }),
  };

  handleFiltersNavigate = newPath => {
    this.props.setActiveSidebarPath(this.props.id, newPath);
  };

  handleClearFilter = id => {
    const { filter, value } = JSON.parse(id);
    const { filters } = this.props;

    if (!filters[filter].length) {
      return;
    }

    if (isArray(filters[filter])) {
      this.props.addEngineFilter(this.props.id, {
        type: filter,
        value: without(filters[filter], value)
      });
    }

    if (isString(filters[filter])) {
      this.props.removeEngineFilter(this.props.id, {
        type: filter,
        value
      });
    }
  };

  handleClearAllFilters = () => {
    this.props.clearAllFilters(this.props.id);
  };

  getSelectedFilters = filters => {
    const selectedFilters = [];

    Object.keys(filters).map((filter, i) => {
      if (!filters[filter].length) {
        return;
      }

      if (isArray(filters[filter])) {
        if (filter === 'rating') {
          selectedFilters.push({
            id: JSON.stringify({ filter, value: filters[filter] }),
            label: `Rating: ${filters[filter][0]} & Up`
          });
        } else {
          filters[filter].map(value =>
            selectedFilters.push({
              id: JSON.stringify({ filter, value }),
              label: value
            })
          );
        }
      }

      if (isString(filters[filter])) {
        selectedFilters.push({
          id: JSON.stringify({ filter, value: filters[filter] }),
          label: filters[filter]
        });
      }
    });

    return selectedFilters;
  };

  render() {
    const { classes } = this.props;
    const engineFilters = {
      children: Object.values(Filters).map(({ label, id }) => {
        return {
          label,
          children: [{ formComponentId: id }]
        };
      })
    };

    const formComponents = Object.values(Filters).reduce(
      (acc, { id, component: Component }) => ({
        ...acc,
        [id]: (
          <Component
            id={this.props.id}
            filters={this.props.filters}
            filterBy={this.props.addEngineFilter}
          />
        )
      }),
      {}
    );

    return (
      <div className={classes.sideBar}>
        <Sidebar
          tabs={['Filters']}
          clearAllFilters={false}
          onClearFilter={this.handleClearFilter}
          onClearAllFilters={this.handleClearAllFilters}
          filtersSections={engineFilters}
          formComponents={formComponents}
          selectedFilters={this.getSelectedFilters(this.props.filters)}
          selectedTab={'Filters'}
          onSelectTab={noop}
          filtersActivePath={this.props.activeSidebarPath}
          onFiltersNavigate={this.handleFiltersNavigate}
        />
      </div>
    );
  }
}
